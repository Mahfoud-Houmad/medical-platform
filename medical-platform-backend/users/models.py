from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    ROLE_CHOICES = [
        ('patient', 'Patient'),
        ('medecin', 'Médecin'),
        ('pharmacien', 'Pharmacien'),
    ]
    
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)
    cin = models.CharField(max_length=20, blank=True, null=True)
    inp = models.CharField(max_length=20, blank=True, null=True)
    inpe = models.CharField(max_length=20, blank=True, null=True)
    phone = models.CharField(max_length=15, blank=True, null=True)
    address = models.CharField(max_length=255, blank=True, null=True)


    def __str__(self):
        return f"{self.username} ({self.role})"
