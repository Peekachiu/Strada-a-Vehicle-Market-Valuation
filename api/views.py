from django.shortcuts import render
from django.contrib.auth.models import User
from .serializers import UserSerializer
from rest_framework import generics, permissions
from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated

# --- User Sign Up View ---
class SignUpView(generics.CreateAPIView):
    """
    API view for creating a new user (Sign Up).
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny]

# --- Vehicle Valuation View ---
class EstimateView(APIView):
    """
    API view for getting a vehicle valuation estimate.
    Requires a valid JWT token.
    """
    permission_classes = [IsAuthenticated]

    def post(self, request):
        # 1. Get the data from the request
        #    (e.g., car_make = request.data.get('make'))
        #    We will do this in the next step.
        
        # 2. For now, just print the user who made the request
        print("Request made by user:", request.user.username)
        
        # 3. Return a mock (fake) response
        mock_estimate = {
            "estimated_price": 50000.00,
            "model": "Placeholder Model",
            "year": 2020
        }
        return Response(mock_estimate)