from django.urls import path
from . import views

# Import the pre-built views from simplejwt
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    # Your Sign Up URL
    path('signup/', views.SignUpView.as_view(), name='signup'),
    
    # Your new Login URL
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    
    # Your new Token Refresh URL
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]