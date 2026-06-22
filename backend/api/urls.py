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

    # ========================================
    # E-COMMERCE URLs
    # ========================================
    
    # --- Categories (Public) ---
    path('shop/categories/', views.CategoryListView.as_view(), name='shop_categories'),
    
    # --- Products (Public) ---
    path('shop/products/', views.ProductListView.as_view(), name='shop_products'),
    path('shop/products/<int:pk>/', views.ProductDetailView.as_view(), name='shop_product_detail'),
    
    # --- Cart (Authenticated) ---
    path('shop/cart/', views.CartView.as_view(), name='shop_cart'),
    path('shop/cart/items/<int:item_id>/', views.CartItemUpdateView.as_view(), name='shop_cart_item_update'),
    
    # --- Orders (Authenticated) ---
    path('shop/orders/', views.OrderListView.as_view(), name='shop_orders'),
    path('shop/orders/<int:pk>/', views.OrderDetailView.as_view(), name='shop_order_detail'),
    path('shop/orders/<int:order_id>/cancel/', views.OrderCancelView.as_view(), name='shop_order_cancel'),
    path('shop/checkout/', views.OrderCreateView.as_view(), name='shop_checkout'),
]