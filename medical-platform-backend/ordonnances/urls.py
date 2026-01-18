from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import OrdonnanceViewSet, MedicamentOrdonnanceViewSet
from .views import CreateOrdonnanceView , PatientOrdonnancesView
from .views import OrdonnancesDuMedecinView

router = DefaultRouter()
router.register(r'ordonnances', OrdonnanceViewSet)
router.register(r'medicament-ordonnance', MedicamentOrdonnanceViewSet)

urlpatterns = [
    path('ordonnances/create/', CreateOrdonnanceView.as_view(), name='create-ordonnance'),
    path('', include(router.urls)),
    path('ordonnances/patient/', PatientOrdonnancesView.as_view(), name='ordonnances-du-patient'),
    path('ordonnances/mes/', OrdonnancesDuMedecinView.as_view(), name='ordonnances-du-medecin'),
]
