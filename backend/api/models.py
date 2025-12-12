from django.db import models
from django.contrib.auth.models import User

# --- Existing Profile Model ---
class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    phone_number = models.CharField(max_length=20, blank=True)

    def __str__(self):
        return f"{self.user.username}'s Profile"

# --- NEW: Valuation History Model ---
class Valuation(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='valuations')
    
    # Input Data
    make = models.CharField(max_length=100)
    model = models.CharField(max_length=100)
    year = models.IntegerField()
    mileage = models.IntegerField()
    condition = models.CharField(max_length=50)
    transmission = models.CharField(max_length=50)
    fuel_type = models.CharField(max_length=50)
    
    # Result
    predicted_price = models.DecimalField(max_digits=12, decimal_places=2)
    
    # Timestamp
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.year} {self.make} {self.model} - RM {self.predicted_price}"

# --- NEW: My Vehicle Model ---
from datetime import timedelta

class Vehicle(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='my_vehicles')
    make = models.CharField(max_length=100)
    model = models.CharField(max_length=100)
    year = models.IntegerField()
    mileage = models.IntegerField()
    last_service_date = models.DateField(null=True, blank=True)
    last_service_mileage = models.IntegerField(null=True, blank=True)
    repair_history = models.TextField(blank=True)
    
    # Auto-calculated
    next_service_date = models.DateField(null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        # Allow input to be None, but if present, calculate next date
        if self.last_service_date:
            # Estimate next service in 6 months
            self.next_service_date = self.last_service_date + timedelta(days=180)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.user.username}'s {self.make} {self.model}"