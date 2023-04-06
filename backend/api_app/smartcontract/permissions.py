# write permissions for viewsets
# where the user is a member of the organization
# can only access the smart contracts of that organization

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

        if smart_contract_id is None:
            return False

        # check owner_organization of smart contract
        organization = (
            SmartContract.objects.filter(id=smart_contract_id)
            .first()
            .owner_organization
        )

        return Membership.is_member(user=request.user, organization=organization)
