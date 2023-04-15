from rest_framework import permissions

from api_app.smartcontract.models import SmartContract
from authentication.organizations.models import Membership

from .models import Alerts


class AlertCanBeAccessedPermissions(permissions.BasePermission):
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

        alert = Alerts.objects.filter(id=view.kwargs["pk"]).first()
        if alert is None:
            self.message = f"Alert with id {view.kwargs['pk']} does not exist."
            return False

        return Membership.is_member(
            user=request.user,
            organization=alert.smart_contract.owner_organization,
        )


class AlertCanBeCreatedForContractPermissions(permissions.BasePermission):
    """
    Custom permission to only allow members of an organization to create alerts.
    """

    message = (
        "You are not a member of the organization. "
        "Try checking owner_organization is right."
    )

    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False

        smart_contract_id = request.data.get("smart_contract")
        if smart_contract_id is None:
            self.message = "smart_contract is required."
            return False

        smart_contract = SmartContract.objects.filter(id=smart_contract_id).first()

        if smart_contract is None:
            self.message = f"Smart contract with id smart_contract_id does not exist."
            return False

        return Membership.is_member(
            user=request.user,
            organization=smart_contract.owner_organization,
        )


class SmartContractAlertPermissions(permissions.BasePermission):
    """
    Custom permission to only allow members who can access the smart contract
    to access alerts.
    """

    message = (
        "You are not a member of the organization. "
        "Try checking owner_organization is right."
    )

    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False

        smart_contract_id = view.kwargs["pk"]

        smart_contract = SmartContract.objects.filter(id=smart_contract_id).first()

        if smart_contract is None:
            self.message = f"Smart contract with id {view.kwargs['pk']} does not exist."
            return False

        return Membership.is_member(
            user=request.user,
            organization=smart_contract.owner_organization,
        )
