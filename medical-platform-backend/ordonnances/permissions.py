from rest_framework import permissions

class IsMedecin(permissions.BasePermission):
    """
    Permission personnalisée : autoriser uniquement les utilisateurs ayant le rôle 'medecin'.
    """

    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'medecin'
