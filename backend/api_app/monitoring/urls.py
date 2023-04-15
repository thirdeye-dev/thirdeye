from django.urls import path

from .views import (
    AlertCreateAPIView,
    AlertRetrieveAPIView,
    NotificationListViewSet,
    OrganizationAlertListViewSet,
    SmartContractAlertListViewSet,
    get_pre_written_alerts
)

urlpatterns = [
    path("contract/<int:pk>/alerts", SmartContractAlertListViewSet.as_view()),
    path("organization/alerts", OrganizationAlertListViewSet.as_view()),
    path("alerts/<int:pk>", AlertRetrieveAPIView.as_view(), name="alert-retrieve"),
    path("alerts", AlertCreateAPIView.as_view(), name="alert-create"),
    path("notifications", NotificationListViewSet.as_view(), name="notification-list"),
    path("pre-written-alerts", get_pre_written_alerts, name="pre-written-alerts"),
]
