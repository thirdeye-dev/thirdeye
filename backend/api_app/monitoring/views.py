import logging

from rest_framework.generics import ListAPIView, RetrieveAPIView

from authentication.organizations.permissions import IsMember

from .models import Alerts
from .permissions import SmartContractAlertPermissions
from .serializers import AlertsAPISerializer

logger = logging.getLogger(__name__)


class SmartContractAlertListViewSet(ListAPIView):
    serializer_class = AlertsAPISerializer
    permission_classes = [SmartContractAlertPermissions]

    def get_queryset(self):
        smart_contract_id = self.kwargs.get("pk")
        if smart_contract_id is None:
            return super().get_queryset()

        queryset = Alerts.objects.filter(smart_contract=smart_contract_id)
        return queryset


class OrganizationAlertListViewSet(ListAPIView):
    serializer_class = AlertsAPISerializer
    permission_classes = [IsMember]

    def get_queryset(self):
        organization = self.request.query_params.get("owner_organization")
        queryset = Alerts.objects.filter(organization=organization)
        return queryset


class AlertRetrieveAPIView(RetrieveAPIView):
    serializer_class = AlertsAPISerializer
    permission_classes = [IsMember]

    def get_queryset(self):
        queryset = Alerts.objects.all()
        return queryset
