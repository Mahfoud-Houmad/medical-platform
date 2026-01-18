from django.db import models
from users.models import CustomUser
from medicaments.models import Medicament

class Ordonnance(models.Model):
    medecin = models.ForeignKey(CustomUser, on_delete=models.CASCADE, limit_choices_to={'role': 'medecin'})
    patient = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='ordonnances', limit_choices_to={'role': 'patient'})
    date_creation = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Ordonnance du {self.date_creation.strftime('%Y-%m-%d')} pour {self.patient.username}"

class MedicamentOrdonnance(models.Model):
    ordonnance = models.ForeignKey(Ordonnance, related_name='medicaments', on_delete=models.CASCADE)
    medicament = models.ForeignKey(Medicament, on_delete=models.CASCADE)
    duree_traitement = models.PositiveIntegerField(help_text="Durée du traitement en jours")

    def __str__(self):
        return f"{self.medicament.nom} pour {self.duree_traitement} jours"
