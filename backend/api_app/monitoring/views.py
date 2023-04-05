import logging

from rest_framework import status, viewsets
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from authentication.organizations.permissions import IsMember
from .models import Alerts

logger = logging.getLogger(__name__)


# write a simple viewset to set alerts
# for an organisation that the user is a member of
# and if he is of none, then he can set alerts
class AlertViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated, IsMember]

    def get_queryset(self):
        queryset = Alerts.objects.filter(
            organization=self.request.user
        )
        return queryset

