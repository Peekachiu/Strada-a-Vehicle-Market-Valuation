from django.contrib.auth.models import User
from rest_framework import serializers, validators

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