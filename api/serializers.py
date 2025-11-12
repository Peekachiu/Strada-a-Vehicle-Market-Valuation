from django.contrib.auth.models import User
from rest_framework import serializers, validators
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import authenticate
from .models import Profile

class UserSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(
        validators=[validators.UniqueValidator(queryset=User.objects.all())]
    )

    # This field is for GET requests (like /api/me/)
    # It reads the phone_number from the related Profile object.
    phone_number = serializers.CharField(source='profile.phone_number', read_only=True)
    
    # This field is for POST requests (like /api/signup/)
    # It's write-only, not required, and we'll handle it in create()
    phone_number_write = serializers.CharField(write_only=True, required=False, allow_blank=True)

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password', 'phone_number', 'phone_number_write')
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def create(self, validated_data):
        # Pop our custom phone number field out of the data
        phone_data = validated_data.pop('phone_number_write', '') # Defaults to empty string
        
        # Create the user first
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )

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
        token['username'] = user.username
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