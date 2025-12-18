from django.urls import path
from . import views
from rest_framework_simplejwt.views import (
    TokenRefreshView,
)

urlpatterns = [
    # --- Auth URLs ---
    path('signup/', views.SignUpView.as_view(), name='signup'),
    path('token/', views.MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # --- App URLs ---
    path('estimate/', views.EstimateView.as_view(), name='estimate'),
    path('me/', views.GetUserView.as_view(), name='get_user'),
    path('history/', views.HistoryView.as_view(), name='history'),
    path('history/<int:pk>/', views.ValuationDetailView.as_view(), name='history_detail'),
    path('vehicles/', views.VehicleListCreateView.as_view(), name='vehicle_list_create'),
    path('vehicles/<int:pk>/', views.VehicleDetailView.as_view(), name='vehicle_detail'),
    
    # --- Password Reset (OTP) ---
    path('password-reset/request-otp/', views.RequestOTPView.as_view(), name='request_otp'),
    path('password-reset/verify-otp/', views.ResetPasswordWithOTPView.as_view(), name='verify_reset_otp'),
]