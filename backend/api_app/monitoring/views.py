import logging

from authentication.organizations.permissions import IsMember

from rest_framework.generics import ListAPIView, RetrieveAPIView

from rest_framework import status
from rest_framework.response import Response

from .models import Alerts
from .permissions import (
    SmartContractAlertPermissions, 
    AlertCanBeAccessedPermissions
)
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
    permission_classes = [AlertCanBeAccessedPermissions]

    def get_queryset(self):
        queryset = Alerts.objects.all()
        return queryset

    def get(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, include_alert_yaml=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
