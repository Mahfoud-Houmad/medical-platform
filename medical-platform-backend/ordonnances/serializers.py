from rest_framework import serializers
from .models import Ordonnance, MedicamentOrdonnance
from medicaments.models import Medicament
from medicaments.serializers import MedicamentSerializer

class MedicamentOrdonnanceSerializer(serializers.ModelSerializer):
    nom = serializers.CharField(source='medicament.nom')
    dosage = serializers.CharField(source='medicament.dosage')
    class Meta:
        model = MedicamentOrdonnance
        fields = ['id', 'nom', 'dosage', 'duree_traitement']

class OrdonnanceSerializer(serializers.ModelSerializer):
    medicaments = MedicamentOrdonnanceSerializer(many=True)
    nom_med = serializers.CharField(source='medecin.username')

    class Meta:
        model = Ordonnance
        fields = ['id', 'nom_med', 'patient', 'date_creation', 'medicaments']

    def create(self, validated_data):
        # Extraire la liste des médicaments envoyée
        medicaments_data = validated_data.pop('medicaments')

        # Créer l'ordonnance principale
        ordonnance = Ordonnance.objects.create(**validated_data)

        # Pour chaque médicament, créer un lien avec l'ordonnance
        for medicament_data in medicaments_data:
            MedicamentOrdonnance.objects.create(
                ordonnance=ordonnance,
                medicament=medicament_data['medicament'],
                duree_traitement=medicament_data['duree_traitement']
            )

        return ordonnance

from medicaments.models import Medicament
from medicaments.serializers import MedicamentSerializer
from medicaments.models import Medicament

class MedicamentOrdonnanceSerializer(serializers.ModelSerializer):


    class Meta:
        model = MedicamentOrdonnance
        fields = ['id', 'nom', 'duree_traitement']


