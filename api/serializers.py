from django.contrib.auth.models import User
from rest_framework import serializers, validators
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import authenticate
from .models import Profile, Valuation

# --- User Serializer  ---
class UserSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(
        validators=[validators.UniqueValidator(queryset=User.objects.all())]
    )
    phone_number = serializers.CharField(source='profile.phone_number', read_only=True)
    
    full_name = serializers.CharField(write_only=True, required=False, allow_blank=True)
    first_name = serializers.CharField(read_only=True)
    last_name = serializers.CharField(read_only=True)
    phone_number_write = serializers.CharField(write_only=True, required=False, allow_blank=True)

    class Meta:
        model = User
        fields = (
            'id', 'username', 'email', 'password', 
            'phone_number', 'phone_number_write',
            'full_name', 'first_name', 'last_name',
            'date_joined'
        )
        extra_kwargs = {
            'password': {'write_only': True},
            'username': {'read_only': True}, 
        }

    def create(self, validated_data):
        phone_data = validated_data.pop('phone_number_write', '')
        full_name = validated_data.pop('full_name', '')
        
        # Split the full name into first and last
        first_name = full_name.split(' ')[0]
        last_name = ' '.join(full_name.split(' ')[1:])

        # Create the user, using the email as the username
        user = User.objects.create_user(
            username=validated_data['email'], # Use email as username
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=first_name,
            last_name=last_name
        )
        
        # Create the profile
        Profile.objects.create(
            user=user,
            phone_number=phone_data
        )
        
        return user

# --- Custom Login Serializer (Accepts Email & Adds Username to Token) ---
class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    
    @classmethod
    def get_token(cls, user):
        # This method is called after validation to create the token
        token = super().get_token(user)
        # --- Add custom claims ---
        token['username'] = user.get_full_name() 
        token['email'] = user.email
        # ---
        return token

    def validate(self, attrs):
        # 'username' from the frontend is actually the email
        email = attrs.get('username')
        password = attrs.get('password')

        if email and password:
            try:
                # Find the user by their email
                user = User.objects.get(email=email)
                
                # Manually check password
                if user.check_password(password):
                    # If password is correct, we MUST change the 'username' field
                    # to be the user's REAL username for the parent
                    # validate() method to work.
                    attrs['username'] = user.username
                else:
                    # Password was wrong
                    raise serializers.ValidationError("No active account found with the given credentials")
            except User.DoesNotExist:
                # Email was wrong
                raise serializers.ValidationError("No active account found with the given credentials")
        
        # Now, call the parent's validate method with the *corrected* username
        # This will call get_token() for us and return the token data
        data = super().validate(attrs)
        return data
    
# --- Valuation Serializer ---
class ValuationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Valuation
        fields = ['id', 'make', 'model', 'year', 'mileage', 'predicted_price', 'created_at']
        # We only send back the essentials for the history list