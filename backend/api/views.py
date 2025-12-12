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
            model_path = os.path.join(settings.BASE_DIR, 'ml_pipeline', 'strada_model.joblib')
            model = joblib.load(model_path)

            # 2. Get data from the frontend request
            data = request.data
            
            print(f"\n[DEBUG] Received Data: {data}")
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
                'make': [data.get('make')],
                'model': [data.get('model')],
                'condition': [data.get('condition')],
                'transmission': [data.get('transmission')],
                'fuel_type': [data.get('fuel_type')] 
            })

            # 5. Make the prediction
            predicted_price = model.predict(input_df)[0]
            final_price = round(predicted_price, 2)
            print(f"[DEBUG] Predicted Price: RM {final_price}")

            # --- EXPLANATION LOGIC ---
            explanation = []
            try:
                # Access steps
                regressor = model.named_steps['regressor']
                preprocessor = model.named_steps['preprocessor']
                
                # Get Scaler info
                scaler = preprocessor.named_transformers_['num']['scaler']
                scaler_mean = scaler.mean_
                scaler_scale = scaler.scale_
                numeric_features = ['age', 'mileage_km']
                
                # Get Categorical info
                ohe = preprocessor.named_transformers_['cat']['onehot']
                categorical_features = ['make', 'model', 'condition', 'transmission', 'fuel_type']
                
                # Get Coefficients
                coefs = regressor.coef_
                intercept = regressor.intercept_
                
                # Map coefficients
                ohe_feature_names = ohe.get_feature_names_out(categorical_features)
                all_feature_names = numeric_features + list(ohe_feature_names)
                coef_dict = dict(zip(all_feature_names, coefs))
                
                # Base Price
                explanation.append(f"Base Price: RM {intercept:,.2f}")
                
                # Numeric Contributions
                # age
                age_val = car_age
                age_scaled = (age_val - scaler_mean[0]) / scaler_scale[0]
                age_contrib = coef_dict['age'] * age_scaled
                explanation.append(f"Age ({age_val} years): RM {age_contrib:,.2f}")
                
                # mileage
                mileage_val = float(data.get('mileage'))
                mileage_scaled = (mileage_val - scaler_mean[1]) / scaler_scale[1]
                mileage_contrib = coef_dict['mileage_km'] * mileage_scaled
                explanation.append(f"Mileage ({mileage_val:,.0f} km): RM {mileage_contrib:,.2f}")

                # Categorical Contributions
                for feature in categorical_features:
                    val = data.get(feature) # e.g. "Honda"
                    if not val: continue
                    # Construct OHE feature name, e.g. "make_Honda"
                    # Note: OHE usually outputs "feature_value"
                    target_col = f"{feature}_{val}"
                    if target_col in coef_dict:
                        contrib = coef_dict[target_col]
                        explanation.append(f"{feature.capitalize()} ({val}): RM {contrib:,.2f}")
                    else:
                        # If not found, it might be a reference category or unseen
                        pass

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