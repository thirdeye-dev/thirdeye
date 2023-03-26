import logging

from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from api_app.core.serializers import IOCSerializer

from .serializers import SetIoCSerializer

logger = logging.getLogger(__name__)


# add authentication to this
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def set_ioc_alert(request):
    serializer_class = SetIoCSerializer(
        data=request.data,
        context={"request": request},
    )

    if serializer_class.is_valid():
        serializer_class.save()
        return Response(
            {"message": "IOC alert set successfully."}, status=status.HTTP_200_OK
        )
    else:
        return Response(serializer_class.errors, status=status.HTTP_400_BAD_REQUEST)


class IoCListAPI(APIView):
    serializer_class = IOCSerializer
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        try:
            iocs = self.serializer_class.read_and_verify_config()
            return Response(iocs, status=status.HTTP_200_OK)
        except Exception as e:
            logger.exception(f"get_iocs requester:{str(request.user)} error:{e}.")
            return Response(
                {"error": "error in get_iocs. Check logs."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
