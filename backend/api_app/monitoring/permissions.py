from rest_framework import permissions
from .models import Alerts

from authentication.organizations.models import Membership

class AlertCanBeAccessed(permissions.BasePermission):
    """
    Custom permission to only allow members of an organization to access alerts.
    """

    message = (
        "You are not a member of the organization. "
        "Try checking owner_organization is right."
    )

    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False

        alert = Alerts.objects.filter(id=view.kwargs['pk']).first()
        if alert is None:
            self.message = (
                f"Alert with id {view.kwargs['pk']} does not exist."
            )
            return False

        return Membership.is_member(
            user=request.user,
            organization=alert.owner_organization,
        )
