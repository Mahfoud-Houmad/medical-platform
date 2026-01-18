from django.db import models
from users.models import CustomUser

class Medicament(models.Model):
    nom = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    dosage = models.CharField(max_length=100, blank=True)
    prix = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)  # ✅ Prix du médicament

    def __str__(self):
        return self.nom

class Stock(models.Model):
    pharmacie = models.ForeignKey(CustomUser, on_delete=models.CASCADE, limit_choices_to={'role': 'pharmacien'})
    medicament = models.ForeignKey(Medicament, on_delete=models.CASCADE)
    quantite = models.PositiveIntegerField(default=0)

    def __str__(self):
        return f"{self.pharmacie.username} - {self.medicament.nom} ({self.quantite})"



