from django.contrib import admin
from django.urls import path, include  # <--- Import 'include'
from django.views.generic import TemplateView

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # This is your new API route
    # It tells Django to send any URL starting with "api/"
    # to your 'api.urls' file for handling.
    path('api/', include('api.urls')),
]