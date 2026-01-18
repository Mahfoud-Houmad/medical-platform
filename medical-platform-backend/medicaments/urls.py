from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import MedicamentViewSet, StockViewSet, MedicamentSearchAPIView

router = DefaultRouter()
router.register(r'medicaments', MedicamentViewSet, basename='medicament')
router.register(r'stocks', StockViewSet, basename='stock')

urlpatterns = [
    path('medicaments/search/', MedicamentSearchAPIView.as_view(), name='medicament-search'),
    path('', include(router.urls)),

]
