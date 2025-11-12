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

# --- Custom Login Serializer (Accepts Email for Login) ---
class MyTokenObtainPairSerializer(TokenObtainPairSerializer):

    def validate(self, attrs):
        # Your loginController.js sends the email in the 'username' field.
        # So, attrs = {'username': 'user@example.com', 'password': '...'}
        email = attrs.get('username')
        password = attrs.get('password')

        if email and password:
            # Try to find the user by their email.
            try:
                user_obj = User.objects.get(email=email)
            except User.DoesNotExist:
                user_obj = None

            if user_obj and user_obj.check_password(password):
                # If user is found and password is correct,
                # we need to authenticate with their *actual* username.
                user = authenticate(username=user_obj.username, password=password)
                
                if user:
                    refresh = self.get_token(user)
                    data = {
                        'refresh': str(refresh),
                        'access': str(refresh.access_token),
                    }
                    return data # Return the tokens
        
        # If any check fails, raise the standard error.
        raise serializers.ValidationError("No active account found with the given credentials")