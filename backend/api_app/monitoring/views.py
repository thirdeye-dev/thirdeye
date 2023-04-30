import logging
from datetime import datetime, timedelta

import pytz
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.generics import CreateAPIView, ListAPIView, RetrieveAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from api_app.core.serializer import PreWrittenAlertsSerializer
from api_app.monitoring.models import Alerts, Notification
from api_app.smartcontract.models import SmartContract
from authentication.organizations.models import Organization
from authentication.organizations.permissions import IsMember

from .models import Alerts
from .permissions import (
    AlertCanBeAccessedPermissions,
    SmartContractAlertPermissions,
    SmartContractNotificationAndAlertsPermissions,
)
from .serializers import AlertsAPISerializer, NotificationAPISerializer

logger = logging.getLogger(__name__)

"""
    Ideally, a lot of what happens in this file should be moved to a cronjob
    that runs every day at 00:00 UTC for every organization.
"""


@api_view(["GET"])
@permission_classes([IsMember])
def OverviewDataAPIView(request):
    owner_organization_id = request.query_params.get("owner_organization")
    if owner_organization_id is None:  # Ideally, shouldn't come here to begin with.
        return Response(
            {"error": "owner_organization is a required query parameter"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    owner_organization = Organization.objects.filter(id=owner_organization_id).first()

    time_mode = request.query_params.get("time_mode")
    if time_mode is None:
        time_mode = "weekly"  # options: weekly & yearly

    # Get the current date and time
    now = datetime.now()

    # Calculate the start date based on the time_mode
    if time_mode == "weekly":
        start_date = now - timedelta(days=now.weekday())  # since monday
    else:
        start_date = datetime(now.year, 1, 1)  # Yearly

    notifications = Notification.objects.filter(
        alert__smart_contract__owner_organization=owner_organization,
        created_at__gte=start_date,
    )

    smart_contracts = SmartContract.objects.filter(
        owner_organization=owner_organization
    )

    smart_contracts_data = []
    for smart_contract in smart_contracts:
        smart_contract_data = {
            "name": smart_contract.name,
            "id": smart_contract.id,
            "entries": [],
        }

        smart_contract_notifications = notifications.filter(
            alert__smart_contract=smart_contract, created_at__gte=start_date
        )

        day_to_number_of_notifications = {}

        for notification in smart_contract_notifications:
            date = notification.created_at.astimezone(pytz.utc)
            day = notification.created_at.strftime("%A")

            if day not in day_to_number_of_notifications:
                day_to_number_of_notifications[day] = 1
            else:
                day_to_number_of_notifications[day] += 1

        smart_contracts_data.append(smart_contract_data)

    for smart_contract_data in smart_contracts_data:
        for day, number_of_notifications in day_to_number_of_notifications.items():
            smart_contract_data["entries"].append(
                {
                    "day" if time_mode == "weekly" else "date": date,
                    "executions": number_of_notifications,
                }
            )

    return Response(smart_contracts_data, status=status.HTTP_200_OK)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_pre_written_alerts(request):
    serializer_class = PreWrittenAlertsSerializer()
    data = serializer_class._in_frontend_format()
    return Response(data, status=status.HTTP_200_OK)


@api_view(["POST"])
@permission_classes([SmartContractNotificationAndAlertsPermissions])
def set_pre_written_alerts(request):
    serializer_class = PreWrittenAlertsSerializer()
    config = serializer_class.read_and_verify_config()
    data = request.data

    # write this as serializer class later.
    # i hate how it looks.
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
    response_data["id"] = alert_data.instance.id

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
    permission_classes = [IsMember]

    def get_queryset(self):
        queryset = self.serializer_class.Meta.model.objects.filter(
            alert__smart_contract__owner_organization=self.request.data.get(
                "owner_organization"
            )
        )
        return queryset
