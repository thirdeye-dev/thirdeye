import logging

from api_app.smartcontract.permissions import CanAccessSmartContract
from authentication.organizations.permissions import IsMember

from rest_framework.generics import ListAPIView, RetrieveAPIView

from .models import Alerts
from .serializers import AlertsAPISerializer

logger = logging.getLogger(__name__)


class SmartContractAlertListViewSet(ListAPIView):
    serializer_class = AlertsAPISerializer
    permission_classes = [CanAccessSmartContract]

    def get_queryset(self):
        smart_contract = self.request.query_params.get("smart_contract")
        queryset = Alerts.objects.filter(smart_contract=smart_contract)
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
