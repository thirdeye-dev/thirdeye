import logging

from rest_framework import status
from rest_framework.generics import CreateAPIView, ListAPIView, RetrieveAPIView
from rest_framework.response import Response

from authentication.organizations.permissions import IsMember

from .models import Alerts
from .permissions import (
    AlertCanBeAccessedPermissions,
    AlertCanBeCreatedForContractPermissions,
    SmartContractAlertPermissions,
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

class OrganizationAlertListViewSet(ListAPIView):
    serializer_class = AlertsAPISerializer
    permission_classes = [IsMember]

    def get_queryset(self):
        organization = self.request.query_params.get("owner_organization")
        queryset = Alerts.objects.filter(organization=organization)
        return queryset


class AlertCreateRetrieveAPIView(RetrieveAPIView, CreateAPIView):
    serializer_class = AlertsAPISerializer

    def get_permissions(self):
        if self.request.method == "GET":
            permission_classes = [AlertCanBeAccessedPermissions]
        else:
            permission_classes = [IsMember]
        return [permission() for permission in permission_classes]

    def get_queryset(self):
        queryset = Alerts.objects.all()
        return queryset

    def get(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, include_alert_yaml=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class AlertCreateAPIView(CreateAPIView):
    serializer_class = AlertsAPISerializer

    def get_permissions(self):
        permission_classes = [AlertCanBeCreatedForContractPermissions()]
        return permission_classes

    def get_queryset(self):
        queryset = Alerts.objects.all()
        return queryset

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data, include_alert_yaml=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
