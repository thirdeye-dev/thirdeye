from rest_framework import status as Status
from rest_framework import viewsets
from rest_framework.response import Response

from api_app.smartcontract.permissions import CanAccessSmartContract
from authentication.organizations.models import Membership, Organization
from authentication.organizations.permissions import IsMember
from rest_framework.decorators import api_view, permission_classes

from .models import SmartContract
from .serializers import SmartContractSerializer, ABISerializer


class SmartContractViewSet(viewsets.ModelViewSet):
    serializer_class = SmartContractSerializer

    def get_permissions(self):
        if self.action in ["create", "list"]:
            return [IsMember()]
        if self.action in ["retrieve", "update", "partial_update", "destroy"]:
            return [CanAccessSmartContract()]

        return super().get_permissions()

    def get_queryset(self):
        if self.action == "retrieve":
            return SmartContract.objects.all()

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


@api_view(["POST"])
@permission_classes([CanAccessSmartContract])
def add_abi(request):
    smart_contract_id = request.data.get("smart_contract")
    smart_contract = SmartContract.objects.filter(id=smart_contract_id).first()

    abi = request.data.get("abi")
    serializer = ABISerializer(data=abi)
    serializer.is_valid(raise_exception=True)
    smart_contract.abi = serializer.data

    smart_contract.save()
    return Response({"message": "abi added successfully"}, status=Status.HTTP_200_OK)
