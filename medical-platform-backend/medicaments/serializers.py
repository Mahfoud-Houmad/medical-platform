from rest_framework import serializers
from .models import Stock, Medicament
from users.models import CustomUser

class MedicamentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Medicament
        fields = ['id', 'nom', 'dosage', 'prix']

class StockSerializer(serializers.ModelSerializer):
    medicament = serializers.PrimaryKeyRelatedField(queryset=Medicament.objects.all())
    pharmacie = serializers.PrimaryKeyRelatedField(queryset=CustomUser.objects.all())

    medicament_nom = serializers.CharField(source='medicament.nom', read_only=True)
    medicament_dosage = serializers.CharField(source='medicament.dosage', read_only=True)

    class Meta:
        model = Stock
        fields = ['id', 'pharmacie', 'medicament', 'medicament_nom', 'medicament_dosage', 'quantite']
