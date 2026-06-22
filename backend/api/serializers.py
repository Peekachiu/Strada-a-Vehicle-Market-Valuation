from django.contrib.auth.models import User
from rest_framework import serializers, validators
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import authenticate
from .models import (
    Profile, Valuation, Vehicle, PasswordResetOTP,
    Category, Product, Cart, CartItem, Order, OrderItem
)

# --- User Serializer  ---
class UserSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(
        validators=[validators.UniqueValidator(
            queryset=User.objects.all(),
            message="A user with this email address already exists."
        )]
    )
    username = serializers.CharField(
        read_only=True,
        validators=[validators.UniqueValidator(
            queryset=User.objects.all(),
            message="A user with this username already exists."
        )]
    )
    phone_number = serializers.CharField(source='profile.phone_number', read_only=True)
    full_name = serializers.CharField(write_only=True, required=False, allow_blank=True)
    first_name = serializers.CharField(read_only=True)
    last_name = serializers.CharField(read_only=True)
    phone_number_write = serializers.CharField(write_only=True, required=False, allow_blank=True)
    old_password = serializers.CharField(write_only=True, required=False, allow_blank=True)

    class Meta:
        model = User
        fields = (
            'id', 'username', 'email', 'password', 
            'phone_number', 'phone_number_write',
            'full_name', 'first_name', 'last_name',
            'date_joined', 'old_password'
        )
        extra_kwargs = {
            'password': {'write_only': True},
        }

    def validate_full_name(self, value):
        if not value.strip():
            raise serializers.ValidationError("Full name cannot be empty.")
        
        first_name = value.split(' ')[0] if ' ' in value else value
        last_name = ' '.join(value.split(' ')[1:]) if ' ' in value else ''
        
        query = User.objects.filter(first_name=first_name, last_name=last_name)
        
        if self.instance:
            query = query.exclude(pk=self.instance.pk)

        if query.exists():
            raise serializers.ValidationError("A user with this name already exists.")
        return value

    def validate_password(self, value):
        if len(value) < 8:
            raise serializers.ValidationError("Password must be at least 8 characters long.")
        if not any(char.isupper() for char in value):
            raise serializers.ValidationError("Password must contain at least one uppercase letter.")
        if not any(not char.isalnum() for char in value):
            raise serializers.ValidationError("Password must contain at least one special character.")
        return value

    def validate_phone_number_write(self, value):
        if not value.isdigit() and not (value.startswith('+') and value[1:].isdigit()):
             raise serializers.ValidationError("Phone number must contain only digits and optional '+' prefix.")
        
        clean_value = value
        if value.startswith('+'):
            clean_value = value[1:]
        
        if len(clean_value) < 9 or len(clean_value) > 13:
             raise serializers.ValidationError("Phone number length is invalid.")
        
        return value

    def create(self, validated_data):
        phone_data = validated_data.pop('phone_number_write', '')
        full_name = validated_data.pop('full_name', '')
        first_name = full_name.split(' ')[0]
        last_name = ' '.join(full_name.split(' ')[1:])
        validated_data.pop('old_password', None)
        
        if phone_data and not phone_data.startswith('+60'):
             phone_data = f"+60{phone_data}"

        user = User.objects.create_user(
            username=validated_data['email'],
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=first_name,
            last_name=last_name
        )
        
        Profile.objects.create(
            user=user,
            phone_number=phone_data
        )
        
        return user

    def update(self, instance, validated_data):
        old_password = validated_data.get('old_password')
        new_password = validated_data.get('password')
        if new_password or old_password:
            if not old_password:
                raise serializers.ValidationError({"old_password": "Please enter your current password to confirm these changes."})
            if not instance.check_password(old_password):
                raise serializers.ValidationError({"old_password": "The current password you entered is incorrect."})

        phone = validated_data.pop('phone_number_write', None)
        if phone is not None:
             if phone and not phone.startswith('+60'):
                phone = f"+60{phone}"
             
             profile, created = Profile.objects.get_or_create(user=instance)
             profile.phone_number = phone
             profile.save()

        new_email = validated_data.get('email')
        if new_email:
            instance.email = new_email
            instance.username = new_email
        
        full_name = validated_data.get('full_name')
        if full_name:
            instance.first_name = full_name.split(' ')[0] if ' ' in full_name else full_name
            instance.last_name = ' '.join(full_name.split(' ')[1:]) if ' ' in full_name else ''

        password = validated_data.get('password')
        if password:
            instance.set_password(password)

        instance.save()
        return instance

# --- Custom Login Serializer (Accepts Email & Adds Username to Token) ---
class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['username'] = user.get_full_name() 
        token['email'] = user.email
        return token

    def validate(self, attrs):
        email = attrs.get('username')
        password = attrs.get('password')

        if email and password:
            try:
                user = User.objects.get(email=email)
                
                if user.check_password(password):
                    attrs['username'] = user.username
                else:
                    raise serializers.ValidationError("No active account found with the given credentials")
            except User.DoesNotExist:
                raise serializers.ValidationError("No active account found with the given credentials")
        
        data = super().validate(attrs)
        return data
    
# --- Valuation Serializer ---
class ValuationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Valuation
        fields = ['id', 'make', 'model', 'year', 'mileage', 'predicted_price', 'created_at']

# --- Vehicle Serializer ---
class VehicleSerializer(serializers.ModelSerializer):
    next_service_date = serializers.DateField(read_only=True)

    class Meta:
        model = Vehicle
        fields = '__all__'
        read_only_fields = ('user', 'created_at', 'next_service_date')

    def validate_mileage(self, value):
        if value > 1000000:
            raise serializers.ValidationError("Mileage cannot exceed 1,000,000 km.")
        return value

    def validate_year(self, value):
        if value > 2026:
            raise serializers.ValidationError("Year cannot exceed 2026.")
        return value

    def validate_last_service_date(self, value):
        from datetime import date
        if value > date.today():
             raise serializers.ValidationError("Last service date cannot be in the future.")
        return value


# ========================================
# E-COMMERCE SERIALIZERS
# ========================================

class CategorySerializer(serializers.ModelSerializer):
    product_count = serializers.IntegerField(source='products.count', read_only=True)

    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'description', 'icon', 'display_order', 'product_count']


class ProductSerializer(serializers.ModelSerializer):
    discount_percentage = serializers.FloatField(read_only=True)
    category_name = serializers.CharField(source='category.name', read_only=True)

    class Meta:
        model = Product
        fields = [
            'id', 'name', 'slug', 'brand', 'category', 'category_name',
            'description', 'price', 'original_price', 'discount_percentage',
            'image', 'stock', 'is_active', 'created_at', 'updated_at'
        ]
        read_only_fields = ('created_at', 'updated_at')


class CartItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)
    product_price = serializers.DecimalField(source='product.price', max_digits=10, decimal_places=2, read_only=True)
    product_brand = serializers.CharField(source='product.brand', read_only=True)
    product_image = serializers.ImageField(source='product.image', read_only=True)
    subtotal = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model = CartItem
        fields = ['id', 'product', 'product_name', 'product_price', 'product_brand', 'product_image', 'quantity', 'subtotal']


class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)
    item_count = serializers.IntegerField(read_only=True)
    total_price = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model = Cart
        fields = ['id', 'user', 'items', 'item_count', 'total_price', 'created_at']
        read_only_fields = ('user', 'created_at')


class CartItemWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = CartItem
        fields = ['product', 'quantity']

    def validate_quantity(self, value):
        if value < 1:
            raise serializers.ValidationError("Quantity must be at least 1.")
        return value


class OrderItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)

    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'product_name', 'quantity', 'price', 'subtotal']
        read_only_fields = ('price',)


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = ['id', 'user', 'status', 'total_price', 'shipping_address', 'items', 'created_at', 'updated_at']
        read_only_fields = ('user', 'total_price', 'created_at', 'updated_at')