from rest_framework import viewsets
from .models import Medicament
from .serializers import MedicamentSerializer

class MedicamentViewSet(viewsets.ModelViewSet):
    queryset = Medicament.objects.all()
    serializer_class = MedicamentSerializer

from .models import Stock
from .serializers import StockSerializer

from rest_framework import permissions

class StockViewSet(viewsets.ModelViewSet):
    serializer_class = StockSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'pharmacien':
            return Stock.objects.filter(pharmacie=user)
        return Stock.objects.none()


from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Medicament, Stock
from users.models import CustomUser

class MedicamentSearchAPIView(APIView):
    def post(self, request):
        medicament_inputs = request.data.get('medicaments', [])
        if not medicament_inputs:
            return Response({"error": "No medicament names provided."}, status=status.HTTP_400_BAD_REQUEST)

        pharmacies_data = []
        pharmacies = CustomUser.objects.filter(role='pharmacien')

        for pharmacie in pharmacies:
            matched_medicaments = []
            for input_name in medicament_inputs:
                # Séparer nom et dosage (si donné comme "Doliprane 500mg")
                parts = input_name.lower().split()
                nom_part = parts[0] if parts else ''
                dosage_part = parts[1] if len(parts) > 1 else ''

                stocks = Stock.objects.filter(
                    pharmacie=pharmacie,
                    medicament__nom__icontains=nom_part,
                    medicament__dosage__icontains=dosage_part,
                    quantite__gt=0
                )

                matched_medicaments += list(stocks.values_list('medicament__nom', flat=True))

            if matched_medicaments:
                pharmacies_data.append({
                    "pharmacie": pharmacie.username,
                    "address": pharmacie.address,
                    "google_maps_link": f"https://maps.google.com/?q={pharmacie.address.replace(' ', '+')}",
                    "medicaments_disponibles": list(set(matched_medicaments)),
                    "nombre_medicaments_disponibles": len(set(matched_medicaments))
                })

        pharmacies_data.sort(key=lambda x: x['nombre_medicaments_disponibles'], reverse=True)

        return Response(pharmacies_data, status=status.HTTP_200_OK)
