from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import RegisterSerializer 
from users.models import CustomUser


class RegisterView(APIView):
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


from rest_framework import generics
from .serializers import PharmacieSerializer

class PharmacieListView(generics.ListAPIView):
    serializer_class = PharmacieSerializer

    def get_queryset(self):
        return CustomUser.objects.filter(role='pharmacien')


from rest_framework.permissions import IsAuthenticated
from .serializers import CustomUserSerializer

class CurrentUserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = CustomUserSerializer(request.user)
        return Response(serializer.data)


from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import CustomTokenObtainPairSerializer

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import CustomUser
from .serializers import CustomUserSerializer
from rest_framework.permissions import IsAuthenticated

class PatientByCINView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, cin):
        try:
            patient = CustomUser.objects.get(cin=cin, role='patient')
        except CustomUser.DoesNotExist:
            return Response({'detail': 'Patient introuvable.'}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = CustomUserSerializer(patient)
        return Response(serializer.data, status=status.HTTP_200_OK)


