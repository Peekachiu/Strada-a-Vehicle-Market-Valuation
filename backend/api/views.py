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

# --- OTP Password Reset Views ---
from django.utils.crypto import get_random_string
from django.core.mail import send_mail
from django.conf import settings
from datetime import timedelta
from django.utils import timezone
from .models import PasswordResetOTP

class RequestOTPView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        print(f"[DEBUG] RequestOTPView POST called. EMAIL_BACKEND={settings.EMAIL_BACKEND}")
        email = request.data.get('email')
        if not email:
            print("[DEBUG] No email provided")
            return Response({"error": "Email is required"}, status=400)
        
        try:
            print(f"[DEBUG] Looking up user: {email}")
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            print("[DEBUG] User not found")
            return Response({"message": "If this email is registered, we have sent a verification code."}, status=200)

        # Generate 6-digit OTP
        otp_code = get_random_string(length=6, allowed_chars='0123456789')
        
        try:
            # Save to DB
            print("[DEBUG] Saving OTP to DB")
            PasswordResetOTP.objects.create(user=user, otp_code=otp_code)
        except Exception as db_e:
            print(f"[ERROR] DB Error: {db_e}")
            return Response({"error": "Database error"}, status=500)
        
        # Send Email
        try:
            print("[DEBUG] Sending email...")
            send_mail(
                subject="Your Strada Password Reset Code",
                message=f"Your verification code is: {otp_code}\n\nThis code expires in 10 minutes.",
                from_email=None, # Uses DEFAULT_FROM_EMAIL
                recipient_list=[email],
                fail_silently=False,
            )
            print("[DEBUG] Email sent successfully (check console)")
            return Response({"message": "If this email is registered, we have sent a verification code."}, status=200)
        except Exception as e:
            print(f"[ERROR] Email Error: {e}")
            return Response({"error": "Failed to send email. Please try again."}, status=500)

class ResetPasswordWithOTPView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        email = request.data.get('email')
        otp_input = request.data.get('otp')
        new_password = request.data.get('new_password')
        
        if not all([email, otp_input, new_password]):
            return Response({"error": "Email, OTP, and new password are required."}, status=400)
            
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
             return Response({"error": "Invalid request."}, status=400)

        # Verify OTP
        # Get latest OTP for user
        otp_record = PasswordResetOTP.objects.filter(user=user).order_by('-created_at').first()
        
        if not otp_record:
            return Response({"error": "Invalid or expired code."}, status=400) # Technically no code found
            
        # Check if code matches
        if otp_record.otp_code != otp_input:
             return Response({"error": "Invalid code."}, status=400)
             
        # Check expiry (10 mins)
        if timezone.now() > otp_record.created_at + timedelta(minutes=10):
             return Response({"error": "Code has expired. Please request a new one."}, status=400)
             
        # SUCCESS -> Reset Password
        user.set_password(new_password)
        user.save()
        
        # Cleanup used OTPs for this user
        PasswordResetOTP.objects.filter(user=user).delete()
        
        return Response({"message": "Password reset successful. You can now login."}, status=200)

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

class ShopPagination(PageNumberPagination):
    page_size = 12
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


# ========================================
# E-COMMERCE VIEWS
# ========================================

from .models import Category, Product, Cart, CartItem, Order, OrderItem
from .serializers import (
    CategorySerializer, ProductSerializer,
    CartItemSerializer, CartSerializer, CartItemWriteSerializer,
    OrderItemSerializer, OrderSerializer
)


# --- Category Views ---
class CategoryListView(generics.ListAPIView):
    """
    List all active product categories.
    Public endpoint - no authentication required.
    """
    serializer_class = CategorySerializer
    permission_classes = [permissions.AllowAny]
    pagination_class = ShopPagination

    def get_queryset(self):
        return Category.objects.all()


# --- Product Views ---
class ProductListView(generics.ListAPIView):
    """
    List all active products with optional filtering.
    Public endpoint - no authentication required.
    Query params:
        - category: Filter by category slug
        - brand: Filter by brand name (case-insensitive contains)
        - search: Search in name and description (case-insensitive contains)
        - min_price / max_price: Price range filter
        - ordering: Sort by 'price', '-price', 'created_at', '-created_at', 'name'
    """
    serializer_class = ProductSerializer
    permission_classes = [permissions.AllowAny]
    pagination_class = ShopPagination
    def get_queryset(self):
        queryset = Product.objects.filter(is_active=True)

        # Filter by category
        category = self.request.query_params.get('category')
        if category:
            queryset = queryset.filter(category__slug=category)

        # Filter by brand
        brand = self.request.query_params.get('brand')
        if brand:
            queryset = queryset.filter(brand__icontains=brand)

        # Search in name and description
        search = self.request.query_params.get('search')
        if search:
            queryset = queryset.filter(
                Q(name__icontains=search) | Q(description__icontains=search)
            )

        # Price range
        min_price = self.request.query_params.get('min_price')
        max_price = self.request.query_params.get('max_price')
        if min_price:
            queryset = queryset.filter(price__gte=min_price)
        if max_price:
            queryset = queryset.filter(price__lte=max_price)

        # Ordering
        ordering = self.request.query_params.get('ordering', '-created_at')
        valid_orderings = ['price', '-price', 'created_at', '-created_at', 'name', '-name']
        if ordering in valid_orderings:
            queryset = queryset.order_by(ordering)

        return queryset


class ProductDetailView(generics.RetrieveAPIView):
    """
    Retrieve a single product detail.
    Public endpoint - no authentication required.
    """
    serializer_class = ProductSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        return Product.objects.filter(is_active=True)


# --- Cart Views ---
class CartView(APIView):
    """
    Get or create the current user's cart.
    Authenticated endpoint.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """Get the current user's cart with all items."""
        cart, created = Cart.objects.get_or_create(user=request.user)
        serializer = CartSerializer(cart)
        return Response(serializer.data)

    def post(self, request):
        """Add an item to the cart or update quantity if already exists."""
        cart, created = Cart.objects.get_or_create(user=request.user)
        item_serializer = CartItemWriteSerializer(data=request.data)
        
        if item_serializer.is_valid():
            product_id = item_serializer.validated_data['product'].id
            quantity = item_serializer.validated_data['quantity']

            # Check stock
            try:
                product = Product.objects.get(id=product_id, is_active=True)
            except Product.DoesNotExist:
                return Response({"error": "Product not found."}, status=404)

            if product.stock < quantity:
                return Response({"error": f"Insufficient stock. Only {product.stock} available."}, status=400)

            # Add or update cart item
            cart_item, created = CartItem.objects.get_or_create(
                cart=cart,
                product=product,
                defaults={'quantity': quantity}
            )
            if not created:
                cart_item.quantity += quantity
                if product.stock < cart_item.quantity:
                    return Response({"error": f"Insufficient stock. Only {product.stock} available."}, status=400)
                cart_item.save()

            # Return updated cart
            cart_serializer = CartSerializer(cart)
            return Response(cart_serializer.data, status=201 if created else 200)
        
        return Response(item_serializer.errors, status=400)


class CartItemUpdateView(APIView):
    """
    Update or delete a specific cart item.
    Authenticated endpoint.
    """
    permission_classes = [IsAuthenticated]

    def patch(self, request, item_id):
        """Update quantity of a cart item."""
        try:
            cart_item = CartItem.objects.get(
                id=item_id,
                cart__user=request.user
            )
        except CartItem.DoesNotExist:
            return Response({"error": "Cart item not found."}, status=404)

        quantity = request.data.get('quantity')
        if quantity is None or quantity < 1:
            return Response({"error": "Quantity must be at least 1."}, status=400)

        # Check stock
        if cart_item.product.stock < quantity:
            return Response({"error": f"Insufficient stock. Only {cart_item.product.stock} available."}, status=400)

        cart_item.quantity = quantity
        cart_item.save()

        cart_serializer = CartSerializer(cart_item.cart)
        return Response(cart_serializer.data)

    def delete(self, request, item_id):
        """Remove an item from the cart."""
        try:
            cart_item = CartItem.objects.get(
                id=item_id,
                cart__user=request.user
            )
        except CartItem.DoesNotExist:
            return Response({"error": "Cart item not found."}, status=404)

        cart_item.delete()
        cart_serializer = CartSerializer(cart_item.cart)
        return Response(cart_serializer.data)


# --- Order Views ---
class OrderListView(generics.ListAPIView):
    """
    List all orders for the current user.
    Authenticated endpoint.
    """
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user).order_by('-created_at')


class OrderCreateView(APIView):
    """
    Create an order from the current user's cart.
    Authenticated endpoint.
    """
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            cart = Cart.objects.get(user=request.user)
        except Cart.DoesNotExist:
            return Response({"error": "No cart found. Please add items first."}, status=400)

        if cart.items.count() == 0:
            return Response({"error": "Cart is empty."}, status=400)

        # Verify stock availability for all items
        for cart_item in cart.items.all():
            product = cart_item.product
            if product.stock < cart_item.quantity:
                return Response(
                    {"error": f"Insufficient stock for {product.name}. Only {product.stock} available."},
                    status=400
                )

        shipping_address = request.data.get('shipping_address')
        if not shipping_address:
            return Response({"error": "Shipping address is required."}, status=400)

        # Create order
        order = Order.objects.create(
            user=request.user,
            total_price=cart.total_price,
            shipping_address=shipping_address,
            status='pending'
        )

        # Create order items and update stock
        for cart_item in cart.items.all():
            OrderItem.objects.create(
                order=order,
                product=cart_item.product,
                quantity=cart_item.quantity,
                price=cart_item.product.price
            )
            # Update stock
            cart_item.product.stock -= cart_item.quantity
            cart_item.product.save()

        # Clear the cart
        cart.items.all().delete()
        cart.delete()

        order_serializer = OrderSerializer(order)
        return Response(order_serializer.data, status=201)


class OrderDetailView(generics.RetrieveAPIView):
    """
    Retrieve a single order detail.
    Authenticated endpoint - users can only view their own orders.
    """
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user)


class OrderCancelView(APIView):
    """
    Cancel a pending order and restore stock.
    Authenticated endpoint.
    """
    permission_classes = [IsAuthenticated]

    def post(self, request, order_id):
        try:
            order = Order.objects.get(id=order_id, user=request.user)
        except Order.DoesNotExist:
            return Response({"error": "Order not found."}, status=404)

        if order.status != 'pending':
            return Response({"error": f"Cannot cancel order with status '{order.status}'."}, status=400)

        # Restore stock for all items
        for order_item in order.items.all():
            order_item.product.stock += order_item.quantity
            order_item.product.save()

        order.status = 'cancelled'
        order.save()

        order_serializer = OrderSerializer(order)
        return Response(order_serializer.data)