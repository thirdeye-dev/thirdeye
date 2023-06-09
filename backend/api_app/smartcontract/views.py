from rest_framework import status as Status
from rest_framework import viewsets
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response

<<<<<<< HEAD
from api_app.smartcontract.permissions import CanAccessSmartContractWithoutAction, CanAccessSmartContract
=======
from api_app.smartcontract.permissions import (
    CanAccessSmartContract,
    CanAccessSmartContractWithoutAction,
)
>>>>>>> b80fd4fe7b7b218c2593720b0aa72b2c32b25bf2
from authentication.organizations.models import Membership, Organization
from authentication.organizations.permissions import IsMember
from rest_framework.decorators import api_view, permission_classes

from .models import SmartContract
<<<<<<< HEAD
from .serializers import SmartContractSerializer, ABIJSONSerializer
=======
from .serializers import ABIJSONSerializer, SmartContractSerializer
>>>>>>> b80fd4fe7b7b218c2593720b0aa72b2c32b25bf2


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

# the assumption here is that CanAccessSmartContractWithoutAction
# takes care of verifying that smart_contract exists in request body.
@api_view(["DELETE"])
@permission_classes([CanAccessSmartContractWithoutAction])
def delete_abi(request):
    smart_contract_id = request.data.get("smart_contract")
    smart_contract = SmartContract.objects.filter(id=smart_contract_id).first()

    smart_contract.abi = None
    smart_contract.save()
    return Response({"message": "abi deleted successfully"}, status=Status.HTTP_200_OK)

@api_view(["GET"])
@permission_classes([CanAccessSmartContractWithoutAction])
def get_abi(request):
    smart_contract_id = request.data.get("smart_contract")
    smart_contract = SmartContract.objects.filter(id=smart_contract_id).first()

    abi = smart_contract.abi
    return Response(abi, status=Status.HTTP_200_OK)

@api_view(["POST"])
@permission_classes([CanAccessSmartContractWithoutAction])
def add_abi(request):
    smart_contract_id = request.data.get("smart_contract")
    smart_contract = SmartContract.objects.filter(id=smart_contract_id).first()

    abi = request.data.get("abi")
    serializer = ABIJSONSerializer(data=abi, many=True)
    serializer.is_valid(raise_exception=True)
    smart_contract.abi = serializer.data

    smart_contract.save()
    return Response({"message": "abi added successfully"}, status=Status.HTTP_200_OK)
