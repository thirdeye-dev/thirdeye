import logging

from rest_framework import serializers as rfs

from api_app.monitoring.models import Alerts

logger = logging.getLogger(__name__)


class AlertSerializer(rfs.ModelSerializer):
    class Meta:
        model = Alerts
        fields = "__all__"
