from rest_framework import permissions
from rest_framework import status as Status
from rest_framework import viewsets
from rest_framework.response import Response

from authentication.organizations.models import Membership, Organization

from .models import SmartContract
from .serializers import SmartContractSerializer


class CanRead(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return Membership.is_member(request.user, obj.owner_organization)


# add permissions later
class SmartContractViewSet(viewsets.ModelViewSet):
    serializer_class = SmartContractSerializer
    permission_classes = [CanRead]

    def get_queryset(self):
        owner_organization_id = self.request.query_params.get("owner_organization_id")

        if not owner_organization_id:
            raise Response(
                {"error": "owner_organization_id is required"},
                status=Status.HTTP_400_BAD_REQUEST,
            )

        owner_organization = Organization.objects.get(id=owner_organization_id)

        return SmartContract.objects.filter(owner_organization=owner_organization)

    def perform_create(self, serializer):
        owner_organization_id = self.request.query_params.get(
            "owner_organization_id", None
        )
        if not owner_organization_id:
            raise Response(
                {"error": "owner_organization_id is required"},
                status=Status.HTTP_400_BAD_REQUEST,
            )

        owner_organization = Organization.objects.get(id=owner_organization_id)

        is_member = Membership.is_member(self.request.user, owner_organization)

        if is_member:
            serializer.save(owner_organization=owner_organization)
            return
        raise Response(
            {"error": "User is not a member of the organization"},
            status=Status.HTTP_400_BAD_REQUEST,
        )
