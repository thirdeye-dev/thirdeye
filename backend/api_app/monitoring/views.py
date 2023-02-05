import logging

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .serializers import IOCSerializer

logger = logging.getLogger(__name__)

class PlaybookListAPI(APIView):
    serializer_class = IOCSerializer

    def get(self, request, *args, **kwargs):
        try:
            iocs = self.serializer_class.read_and_verify_config()
            return Response(iocs, status=status.HTTP_200_OK)
        except Exception as e:
            logger.exception(
                f"get_iocs requester:{str(request.user)} error:{e}."
            )
            return Response(
                {"error": "error in get_iocs. Check logs."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
