from uuid import UUID

from rest_framework import permissions

from .models import Membership, Organization


class IsMember(permissions.BasePermission):
    """
    Custom permission to only allow members of an organization.
    """

    message = (
        "You are not a member of the organization. "
        "Try checking owner_organization is right."
    )

    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False

        owner_organization = None
        if request.method == "GET" or request.method == "DELETE":
            owner_organization = request.query_params.get("owner_organization")

        if request.method == "POST":
            owner_organization = request.data.get("owner_organization")

        if owner_organization is None:
            self.message = "owner_organization is not provided."
            return False

        # check if owner_organization is a well formed uuid
        try:
            UUID(owner_organization)
        except ValueError:
            return False

        organization = Organization.objects.filter(id=owner_organization).first()

        # i want this to be handled by the serializer
        if organization is None:
            return False

        return Membership.is_member(user=request.user, organization=organization)


class IsAdminOrReadOnly(permissions.BasePermission):
    """
    Custom permission to only allow admin users to edit an organization.
    """

    message = "You are not an admin of the organization to write to it."

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

    message = "You are not an owner or admin of the organization to access."

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
