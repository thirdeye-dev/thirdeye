from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class SmartContract(models.Model):
    address = models.CharField(max_length=42, unique=True)
    name = models.CharField(max_length=100)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.name
