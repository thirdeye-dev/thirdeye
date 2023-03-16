from rest_framework.permissions import BasePermission
from organizations.models import Organization

class IsAdminOrOwner(BasePermission):
    def has_permission(self, request, view):
        # Get the slug from the URL path
        org_id = view.kwargs.get('org_id')

        # Get the organization object
        org = Organization.objects.get(id=org_id)

        # Check if the user is an admin
        if request.user in org.admins.all():
            return True

        return False