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
                "year": input_year
            })

        except Exception as e:
            print(f"Prediction Error: {e}")
            return Response({"error": str(e)}, status=400)

class HistoryView(generics.ListAPIView):
    serializer_class = ValuationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self) -> Any:
        # Return only the valuations that belong to the currently logged-in user
        return Valuation.objects.filter(user=self.request.user).order_by('-created_at')