from rest_framework import permissions

from .models import Membership


class IsMember(permissions.BasePermission):
    """
    Custom permission to only allow members of an organization to view it.
    """

    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False

        organisation_id = request.data.get("organization_id", None)

        if organisation_id is None:
            return False

        return Membership.objects.filter(
            user=request.user, organization=organisation_id
        ).exists()


class IsAdminOrReadOnly(permissions.BasePermission):
    """
    Custom permission to only allow admin users to edit an organization.
    """

    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False

        return Membership.objects.filter(
            user=request.user, organization=view.kwargs["pk"], is_admin=True
        ).exists()


class IsOwnerOrAdmin(permissions.BasePermission):
    """
    Custom permission to only allow owners or admin users to edit an organization.
    """

    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False

        return (
            request.user.is_authenticated
            and Membership.objects.filter(
                user=request.user, organization=view.kwargs["pk"], is_owner=True
            ).exists()
            or IsAdminOrReadOnly().has_permission(request, view)
        )
