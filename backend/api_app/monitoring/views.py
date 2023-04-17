import logging

from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.generics import CreateAPIView, ListAPIView, RetrieveAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.generics import CreateAPIView, ListAPIView, RetrieveAPIView

from api_app.core.serializer import PreWrittenAlertsSerializer
from authentication.organizations.permissions import IsMember

from .models import Alerts
from .permissions import (
    AlertCanBeAccessedPermissions,
    SmartContractAlertPermissions,
    SmartContractNotificationAndAlertsPermissions,
)
from .serializers import AlertsAPISerializer, NotificationAPISerializer
from api_app.core.serializer import PreWrittenAlertsSerializer

logger = logging.getLogger(__name__)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_pre_written_alerts(request):
    serializer_class = PreWrittenAlertsSerializer()
    data = serializer_class.return_in_frontend_format()

    return Response(data, status=status.HTTP_200_OK)


@api_view(["POST"])
@permission_classes([SmartContractNotificationAndAlertsPermissions])
def set_pre_written_alerts(request):
    serializer_class = PreWrittenAlertsSerializer()
    config = serializer_class.read_and_verify_config()
    data = request.data

    name = data.get("name")
    params = data.get("params")
    if name is None or params is None:
        return Response(
            {"error": "name and params are required fields"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    if not isinstance(params, dict):
        return Response(
            {"error": "params must be a dictionary"}, status=status.HTTP_400_BAD_REQUEST
        )
    try:
        result = serializer_class.create_yaml(name, params)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
    name = config.get(name).get("name")
    description = config.get(name).get("description")

    alert = {
        "name": name,
        "description": description,
        "alert_yaml": result,
        "smart_contract": data.get("smart_contract"),
    }

    alert_data = AlertsAPISerializer(data=alert, include_alert_yaml=True)
    alert_data.is_valid(raise_exception=True)
    alert_data.save()

    response_data = alert_data.validated_data
    smart_contract = response_data.pop("smart_contract")
    response_data["smart_contract"] = {
        "id": smart_contract.id,
        "name": smart_contract.name,
    }

    return Response(response_data, status=status.HTTP_200_OK)


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


class AlertRetrieveAPIView(RetrieveAPIView, CreateAPIView):
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
    permission_classes = [SmartContractNotificationAndAlertsPermissions]

    def get_queryset(self):
        queryset = Alerts.objects.all()
        return queryset

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data, include_alert_yaml=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class NotificationListViewSet(ListAPIView):
    serializer_class = NotificationAPISerializer
    permission_classes = [SmartContractNotificationAndAlertsPermissions]

    def get_queryset(self):
        queryset = self.serializer_class.Meta.model.objects.all()
        return queryset
