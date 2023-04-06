import logging

from rest_framework import viewsets

from api_app.smartcontract.permissions import CanAccessSmartContract

from .models import Alerts
from .serializers import AlertsAPISerializer

logger = logging.getLogger(__name__)


class AlertViewSet(viewsets.ModelViewSet):
    serializer_class = AlertsAPISerializer
    permission_classes = [CanAccessSmartContract]

    def get_queryset(self):
        smart_contract = self.request.data.get("smart_contract")
        queryset = Alerts.objects.filter(smart_contract=smart_contract)
        return queryset
