from rest_framework.permissions import BasePermission

class IsAdminOrOwner(BasePermission):
    """
    Custom permission to allow only admins or owners of an organization to update the organization.
    """

    def has_object_permission(self, request, view, obj):
        user = request.user
        if user.is_superuser:
            return True
        if obj.owner == user:
            return True
        if user in obj.admin_users.all():
            return True
        return False
