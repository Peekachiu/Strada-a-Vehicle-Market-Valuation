import os
import joblib
import pandas as pd
from typing import Any
from django.conf import settings
from django.db.models import Q
from rest_framework import generics
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from .serializers import UserSerializer, MyTokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

# --- Auth Views ---
from rest_framework import generics, permissions
from django.contrib.auth.models import User
from .serializers import UserSerializer

# Import the new Model and Serializer
from .models import Profile, Valuation 
from .serializers import UserSerializer, MyTokenObtainPairSerializer, ValuationSerializer

from rest_framework.pagination import PageNumberPagination
from django.db.models import Sum

class SignUpView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny]

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

class GetUserView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)
    def put(self, request):
        # partial=True means the user can update just 1 field (like phone) without sending everything
        serializer = UserSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

    def delete(self, request):
        # 1. Get password from request body
        password = request.data.get('password')
        if not password:
            return Response({"error": "Password is required to delete account."}, status=400)
        
        # 2. Verify password
        if not request.user.check_password(password):
            return Response({"error": "Incorrect password."}, status=400)
        
        # 3. Delete user
        try:
            request.user.delete()
            return Response(status=204)
        except Exception as e:
            return Response({"error": str(e)}, status=500)

# --- The Real ML Valuation View ---
class EstimateView(APIView):
    """
    API view that loads the trained model and predicts car price.
    """
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            # 1. Load the trained model
            # We construct the path relative to the project base directory
            model_path = os.path.join(settings.BASE_DIR, 'ML_pipeline', 'strada_model.joblib')
            model = joblib.load(model_path)

            # 2. Get data from the frontend request
            data = request.data
            
            print(f"\n[DEBUG] Received Data: {data}")

            # --- NORMALIZATION ---
            # The model is trained on specific capitalized strings.
            # We must map frontend inputs (e.g., "poor", "cvt") to model classes (e.g., "Poor", "CVT").
            
            def normalize_text(text):
                if not text: return text
                return str(text).strip().title() # Default to Title Case: "honda" -> "Honda"

            raw_make = normalize_text(data.get('make'))
            raw_model = normalize_text(data.get('model'))
            
            # Condition: Map simple keys to Model keys if needed
            # Training keys: ['Excellent', 'Very Good', 'Good', 'Fair', 'Poor']
            raw_condition = normalize_text(data.get('condition'))
            # Fix "Very good" -> "Very Good" if title() messed it up or if input is different
            if raw_condition.lower() == 'very good': 
                raw_condition = 'Very Good'

            # Transmission: ['Automatic', 'Manual', 'CVT']
            raw_transmission = normalize_text(data.get('transmission'))
            if raw_transmission.upper() == 'CVT':
                raw_transmission = 'CVT'

            # Fuel: ['Petrol', 'Diesel', 'Hybrid']
            # Note: "Electric" is not in training data, but we normalize it anyway.
            raw_fuel = normalize_text(data.get('fuel_type'))
            
            # 3. Preprocess: Calculate 'age' 
            # The model was trained on 'age', but the user inputs 'year'.
            # We must use the same logic as train_model.py (2025 - year)
            current_year = 2025
            input_year = int(data.get('year'))
            car_age = current_year - input_year

            # 4. Create a DataFrame matching the training data columns
            # The model expects: ['age', 'mileage_km', 'make', 'model', 'condition', 'transmission', 'fuel_type']
            input_df = pd.DataFrame({
                'age': [car_age],
                'mileage_km': [float(data.get('mileage'))],
                'make': [raw_make],
                'model': [raw_model],
                'condition': [raw_condition],
                'transmission': [raw_transmission],
                'fuel_type': [raw_fuel] 
            })

            # 5. Make the prediction
            predicted_price = model.predict(input_df)[0]
            final_price = round(predicted_price, 2)
            print(f"[DEBUG] Predicted Price: RM {final_price}")

            # --- EXPLANATION LOGIC (Refined Waterfall) ---
            explanation = []
            try:
                # Helper to quickly predict price for a specific configuration
                def get_price_for_config(y, m_km, c, t, f):
                    # Normalized data is already title-cased in raw variables above
                    # raw_make and raw_model capture the user's specific car type
                    d = pd.DataFrame({
                        'age': [2025 - y],
                        'mileage_km': [float(m_km)],
                        'make': [raw_make],
                        'model': [raw_model],
                        'condition': [c],
                        'transmission': [t],
                        'fuel_type': [f]
                    })
                    return model.predict(d)[0]

                # 1. Define Baseline (Standard Reference Car)
                # 2020 Model, 50k km, Good Condition, Automatic, Petrol
                base_year = 2020
                base_mileage = 50000
                base_cond = 'Good'
                base_trans = 'Automatic'
                base_fuel = 'Petrol'

                # P0: Base Price
                p0 = get_price_for_config(base_year, base_mileage, base_cond, base_trans, base_fuel)
                explanation.append(f"Base Value (Standard 2020 Model): RM {p0:,.2f}")

                # P1: Apply Year
                p1 = get_price_for_config(input_year, base_mileage, base_cond, base_trans, base_fuel)
                diff_year = p1 - p0
                explanation.append(f"Year Adjustment ({input_year}): RM {diff_year:+,.2f}")

                # P2: Apply Mileage (On top of Year)
                # Note: Using input_year here ensures we capture the mileage impact relevant to that age if there were interactions,
                # but mostly it isolates mileage.
                input_mileage = float(data.get('mileage'))
                p2 = get_price_for_config(input_year, input_mileage, base_cond, base_trans, base_fuel)
                diff_mileage = p2 - p1
                explanation.append(f"Mileage Adjustment ({input_mileage:,.0f} km): RM {diff_mileage:+,.2f}")

                # P3: Apply Condition
                p3 = get_price_for_config(input_year, input_mileage, raw_condition, base_trans, base_fuel)
                diff_cond = p3 - p2
                explanation.append(f"Condition ({raw_condition}): RM {diff_cond:+,.2f}")

                # P4: Apply Transmission
                p4 = get_price_for_config(input_year, input_mileage, raw_condition, raw_transmission, base_fuel)
                diff_trans = p4 - p3
                if raw_transmission != base_trans: # Only show if different/relevant
                     explanation.append(f"Transmission ({raw_transmission}): RM {diff_trans:+,.2f}")
                
                # P5: Apply Fuel
                p5 = get_price_for_config(input_year, input_mileage, raw_condition, raw_transmission, raw_fuel)
                diff_fuel = p5 - p4
                if raw_fuel != base_fuel:
                    explanation.append(f"Fuel ({raw_fuel}): RM {diff_fuel:+,.2f}")
                
                # --- Qualitative Summary ---
                summary_parts = []
                if input_year > base_year:
                    summary_parts.append("Newer model year boosts value.")
                elif input_year < base_year:
                    summary_parts.append("Depreciation due to age.")
                
                if input_mileage < 40000:
                    summary_parts.append("Low mileage is a strong asset.")
                elif input_mileage > 80000:
                    summary_parts.append("High mileage lowers value.")
                
                if raw_condition in ['Excellent', 'Very Good']:
                    summary_parts.append("Excellent condition adds premium.")
                elif raw_condition in ['Fair', 'Poor']:
                    summary_parts.append("Condition impacts resale value.")

                if summary_parts:
                    explanation.append(f"Analysis: {' '.join(summary_parts)}")

                # The final P5 should ideally equal predicted_price (within float error)
                
            except Exception as exp_e:
                print(f"Explanation Error: {exp_e}")
                explanation.append("Could not generate detailed explanation.")

            # Save the valuation to the database
            Valuation.objects.create(
                user=request.user,
                make=data.get('make'),
                model=data.get('model'),
                year=input_year,
                mileage=int(data.get('mileage')),
                condition=data.get('condition'),
                transmission=data.get('transmission'),
                fuel_type=data.get('fuel_type'),
                predicted_price=final_price
            )

            # 6. Return the result
            return Response({
                "estimated_price": round(predicted_price, 2),
                "model": data.get('model'),
                "year": input_year,
                "explanation": explanation
            })

        except Exception as e:
            print(f"Prediction Error: {e}")
            return Response({"error": str(e)}, status=400)

class StandardResultsSetPagination(PageNumberPagination):
    page_size = 5
    page_size_query_param = 'page_size'
    max_page_size = 100

class HistoryView(generics.ListAPIView):
    serializer_class = ValuationSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = StandardResultsSetPagination

    def get_queryset(self) -> Any:
        # Return only the valuations that belong to the currently logged-in user
        return Valuation.objects.filter(user=self.request.user).order_by('-created_at')

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        
        # Calculate stats on the full queryset BEFORE pagination
        total_count = queryset.count()
        total_value = queryset.aggregate(Sum('predicted_price'))['predicted_price__sum'] or 0

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            response = self.get_paginated_response(serializer.data)
            response.data['stats'] = {
                'total_count': total_count,
                'total_value': total_value
            }
            return response

        serializer = self.get_serializer(queryset, many=True)
        return Response({
            'results': serializer.data,
            'stats': {
                'total_count': total_count,
                'total_value': total_value
            }
        })

class ValuationDetailView(generics.RetrieveDestroyAPIView):
    serializer_class = ValuationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Ensure users can only delete their own valuations
        return Valuation.objects.filter(user=self.request.user)

# --- My Vehicle Views ---
from .models import Vehicle
from .serializers import VehicleSerializer

class VehicleListCreateView(generics.ListCreateAPIView):
    serializer_class = VehicleSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Vehicle.objects.filter(user=self.request.user).order_by('-created_at')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class VehicleDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = VehicleSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Vehicle.objects.filter(user=self.request.user)