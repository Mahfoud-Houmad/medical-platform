from rest_framework import viewsets
from .models import Ordonnance, MedicamentOrdonnance
from .serializers import OrdonnanceSerializer, MedicamentOrdonnanceSerializer
from .permissions import IsMedecin
from rest_framework.permissions import IsAuthenticated
from rest_framework import generics


class OrdonnanceViewSet(viewsets.ModelViewSet):
    queryset = Ordonnance.objects.all()
    serializer_class = OrdonnanceSerializer
    permission_classes = [IsAuthenticated]
    
    

class MedicamentOrdonnanceViewSet(viewsets.ModelViewSet):
    queryset = MedicamentOrdonnance.objects.all()
    serializer_class = MedicamentOrdonnanceSerializer
    permission_classes = [IsAuthenticated]

class PatientOrdonnancesView(generics.ListAPIView):
    serializer_class = OrdonnanceSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Ordonnance.objects.filter(patient=self.request.user)


from rest_framework import permissions, status, generics
from rest_framework.response import Response
from ordonnances.models import Ordonnance, MedicamentOrdonnance
from medicaments.models import Medicament
from users.models import CustomUser
from .serializers import OrdonnanceSerializer

class CreateOrdonnanceView(generics.GenericAPIView):
    serializer_class = OrdonnanceSerializer
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        # 1. Vérifier que l'utilisateur connecté est un médecin
        if request.user.role != 'medecin':
            return Response({"detail": "Seulement les médecins peuvent créer des ordonnances."},
                            status=status.HTTP_403_FORBIDDEN)

        # 2. Récupérer les données envoyées
        patient_cin = request.data.get('patient_cin')
        medicaments = request.data.get('medicaments')

        # 3. Chercher le patient par son CIN
        try:
            patient = CustomUser.objects.get(cin=patient_cin, role='patient')
        except CustomUser.DoesNotExist:
            return Response({"detail": "Patient non trouvé."}, status=status.HTTP_404_NOT_FOUND)

        # 4. Créer l'ordonnance
        ordonnance = Ordonnance.objects.create(medecin=request.user, patient=patient)

        # 5. Associer les médicaments
        for med in medicaments:
            try:
                medicament_obj = Medicament.objects.get(id=med['medicament_id'])
                MedicamentOrdonnance.objects.create(
                    ordonnance=ordonnance,
                    medicament=medicament_obj,
                    duree_traitement=med['duree_traitement']
                )
            except Medicament.DoesNotExist:
                return Response({"detail": f"Médicament ID {med['medicament_id']} non trouvé."},
                                status=status.HTTP_400_BAD_REQUEST)

        serializer = self.get_serializer(ordonnance)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


from rest_framework import generics, permissions
from .models import Ordonnance
from .serializers import OrdonnanceSerializer

class OrdonnancesDuMedecinView(generics.ListAPIView):
    serializer_class = OrdonnanceSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'medecin':
            return Ordonnance.objects.filter(medecin=user).order_by('-date_creation')
        return Ordonnance.objects.none()
