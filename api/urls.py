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
]