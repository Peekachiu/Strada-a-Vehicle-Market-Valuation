from django.shortcuts import render
from django.contrib.auth.models import User
from .serializers import UserSerializer
from rest_framework import generics, permissions

# --- User Sign Up View ---
class SignUpView(generics.CreateAPIView):
    """
    API view for creating a new user (Sign Up).
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny]
