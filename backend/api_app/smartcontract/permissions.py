from rest_framework import permissions

from authentication.organizations.models import Membership

from .models import SmartContract


class CanAccessSmartContract(permissions.BasePermission):
    """
    Custom permission to check by smart contract id
    if the user is a member of the organization

    Made for ModelViewSets.
    """

    message = "You are not a member of the organization that owns this smart contract."

    def has_permission(self, request, view):
        smart_contract_id = request.data.get("smart_contract")
        if request.method == "GET":
            smart_contract_id = request.query_params.get("smart_contract")

        if view.action in ["retrieve", "update", "partial_update", "destroy"]:
            smart_contract_id = view.kwargs.get("pk")

        if smart_contract_id is None:
            self.message = "smart contract id is required"
            return False

        # check if smart_contract of the id exists
        smart_contract = SmartContract.objects.filter(id=smart_contract_id).first()
        if smart_contract is None:
            self.message = "smart contract of that id does not exist"
            return False

        # check owner_organization of smart contract
        organization = smart_contract.owner_organization

        return Membership.is_member(user=request.user, organization=organization)


class CanAccessSmartContractWithoutAction(permissions.BasePermission):
    """
    Custom permission to check by smart contract id
    if the user is a member of the organization

    Made for ModelViewSets.
    """

    message = "You are not a member of the organization that owns this smart contract."

    def has_permission(self, request, view):
        smart_contract_id = request.query_params.get("smart_contract")

        if smart_contract_id is None:
            self.message = "smart contract id is required"
            return False

        # check if smart_contract of the id exists
        smart_contract = SmartContract.objects.filter(id=smart_contract_id).first()
        if smart_contract is None:
            self.message = "smart contract of that id does not exist"
            return False

        # check owner_organization of smart contract
        organization = smart_contract.owner_organization

        return Membership.is_member(user=request.user, organization=organization)
