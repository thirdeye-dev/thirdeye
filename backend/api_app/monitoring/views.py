import logging

from rest_framework import status, viewsets
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from api_app.smartcontract.permissions import CanAccessSmartContract

from .models import Alerts
from .serializers import AlertsAPISerializer

logger = logging.getLogger(__name__)


class AlertViewSet(viewsets.ModelViewSet):
    serializer_class = AlertsAPISerializer
    permission_classes = [CanAccessSmartContract]

    def get_queryset(self):
        smart_contract = self.request.data.get("smart_contract")
        queryset = Alerts.objects.filter(
            smart_contract=smart_contract
        )
        return queryset
