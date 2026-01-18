from django.contrib.auth.models import User
from rest_framework import serializers, validators
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import authenticate
from .models import Profile, Valuation, Vehicle

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
        
        # Check if a user with this first and last name already exists
        first_name = value.split(' ')[0] if ' ' in value else value
        last_name = ' '.join(value.split(' ')[1:]) if ' ' in value else ''
        
        query = User.objects.filter(first_name=first_name, last_name=last_name)
        
        # Exclude this user if it's an update
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
        # Value comes in as string from frontend
        # Allow + at the start, otherwise digits only
        if not value.isdigit() and not (value.startswith('+') and value[1:].isdigit()):
             raise serializers.ValidationError("Phone number must contain only digits and optional '+' prefix.")
        
        # Strip + for length check if present
        clean_value = value
        if value.startswith('+'):
            clean_value = value[1:]
        
        # User defined length "between 10 or 11" 
        # Case 1: User enters 9-10 digits (no prefix) -> we add +60 later -> Total 11-12
        # Case 2: User enters +60... (full number) -> Total length 12-13?
        # Let's trust the refined check:
        # If it's just local digits: 9-10.
        # If it includes country code (assuming +60): 11-12 digits (excluding +).
        
        # Let's simplify: Check if reasonable length.
        if len(clean_value) < 9 or len(clean_value) > 13:
             raise serializers.ValidationError("Phone number length is invalid.")
        
        return value

    def create(self, validated_data):
        phone_data = validated_data.pop('phone_number_write', '')
        full_name = validated_data.pop('full_name', '')
        first_name = full_name.split(' ')[0]
        last_name = ' '.join(full_name.split(' ')[1:])
        validated_data.pop('old_password', None)  # Not needed for creation
        
        # Format phone number with +60 prefix if not already present
        # Frontend might send raw digits "123456789"
        if phone_data and not phone_data.startswith('+60'):
             phone_data = f"+60{phone_data}"

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

    def update(self, instance, validated_data):
        # Verify Old Password
        old_password = validated_data.get('old_password')
        new_password = validated_data.get('password')
        if new_password or old_password:
            if not old_password:
                raise serializers.ValidationError({"old_password": "Please enter your current password to confirm these changes."})
            if not instance.check_password(old_password):
                raise serializers.ValidationError({"old_password": "The current password you entered is incorrect."})

        # 1. Update Phone Number (if provided)
        phone = validated_data.pop('phone_number_write', None)
        if phone is not None:
             if phone and not phone.startswith('+60'):
                phone = f"+60{phone}"
             
             # Get or create ensures we don't crash if profile is missing
             profile, created = Profile.objects.get_or_create(user=instance)
             profile.phone_number = phone
             profile.save()

        # 2. Update Email & Username (Keep them synced)
        new_email = validated_data.get('email')
        if new_email:
            instance.email = new_email
            instance.username = new_email # We use email as username
        
        # 3. Update Name
        full_name = validated_data.get('full_name')
        if full_name:
            instance.first_name = full_name.split(' ')[0] if ' ' in full_name else full_name
            instance.last_name = ' '.join(full_name.split(' ')[1:]) if ' ' in full_name else ''

        # 4. Update Password (Securely)
        password = validated_data.get('password')
        if password:
            instance.set_password(password)

        instance.save()
        return instance

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