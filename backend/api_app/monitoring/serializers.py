import logging

from api_app.monitoring.models import Alerts

from rest_framework import serializers as rfs

logger = logging.getLogger(__name__)


class AlertSerializer(rfs.ModelSerializer):
    class Meta:
        model = Alerts
        fields = "__all__"

