import logging

from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated

from api_app.core.serializers import IOCSerializer
from api_app.monitoring.models import MonitoringTasks
from api_app.monitoring.tasks import monitor_contract

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

        print(serializer_class.data)

        # add entry to Monitoring model
        # if not already added
        if MonitoringTasks.objects.filter(
            SmartContract__contract_address=serializer_class.data["contract_address"],
            SmartContract__user=serializer_class.data["user_id"],
        ).exists():
            return Response(
                {"message": "IOC alert set successfully."}, status=status.HTTP_200_OK
            )

        # start monitoring and add to db
        monitoring_task = MonitoringTasks.objects.create(
            SmartContract_id=serializer_class.data["contract_address"],
            user_id=serializer_class.data["user_id"],
        )

        monitoring_celery_task = monitor_contract.delay(
            serializer_class.data["contract_address"],
            serializer_class.data["user_id"],
        )

        monitoring_task.task_id = monitoring_celery_task.task_id
        monitoring_task.save()

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
