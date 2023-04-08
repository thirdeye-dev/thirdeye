import requests

from rest_framework import permissions

from authentication.organizations.models import Membership

from .models import SmartContract


class CanAccessSmartContract(permissions.BasePermission):
    """
    Custom permission to check by smart contract id
    if the user is a member of the organization
    """

    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False

        smart_contract_id = request.data.get("smart_contract")
        if request.method == "GET":
            smart_contract_id = request.query_params.get("smart_contract")

        if view.action == "retrieve":
            smart_contract_id = view.kwargs.get("pk")

        if smart_contract_id is None:
            return False
        
        # check if smart_contract of the id exists
        smart_contract = SmartContract.objects.filter(id=smart_contract_id).first()
        if smart_contract is None:
            # API must give better feedback?
            return False

        # check owner_organization of smart contract
        organization = (
            smart_contract
            .owner_organization
        )

        return Membership.is_member(user=request.user, organization=organization)

