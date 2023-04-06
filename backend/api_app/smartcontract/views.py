from rest_framework import status as Status
from rest_framework import viewsets
from rest_framework.response import Response

from authentication.organizations.models import Membership, Organization
from authentication.organizations.permissions import IsMember

from .models import SmartContract
from .serializers import SmartContractSerializer


# add permissions later
class SmartContractViewSet(viewsets.ModelViewSet):
    serializer_class = SmartContractSerializer
    permission_classes = [IsMember]

    def get_queryset(self):
        owner_owner_organization = self.request.query_params.get("owner_organization")

        owner_organization = Organization.objects.get(id=owner_owner_organization)

        return SmartContract.objects.filter(owner_organization=owner_organization)

    def perform_create(self, serializer):
        owner_owner_organization = self.request.data.get("owner_organization")

        owner_organization = Organization.objects.get(id=owner_owner_organization)

        is_member = Membership.is_member(self.request.user, owner_organization)

        if is_member:
            serializer.save(owner_organization=owner_organization)
            serializer.is_valid(raise_exception=True)
            return Response(serializer.data, status=Status.HTTP_201_CREATED)
        raise Response(
            {"error": "User is not a member of the organization"},
            status=Status.HTTP_400_BAD_REQUEST,
        )
