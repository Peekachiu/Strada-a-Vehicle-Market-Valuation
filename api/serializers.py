from django.contrib.auth.models import User
from rest_framework import serializers, validators
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import authenticate


class UserSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(
        validators=[validators.UniqueValidator(queryset=User.objects.all())]
    )

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password')
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def create(self, validated_data):
        # This create method handles the password hashing
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
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