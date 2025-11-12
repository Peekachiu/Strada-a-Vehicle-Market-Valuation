from django.db import models
from django.contrib.auth.models import User

# This model will store all extra user data
class Profile(models.Model):
    # This links the Profile to a single User.
    # on_delete=models.CASCADE means if a User is deleted, delete their Profile too.
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    
    # This is the new field we want to save
    phone_number = models.CharField(max_length=20, blank=True)
    # We can add more fields here later (like location)

    def __str__(self):
        return f"{self.user.username}'s Profile"