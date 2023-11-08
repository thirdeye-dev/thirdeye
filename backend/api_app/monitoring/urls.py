from django.urls import path

from .views import (
    AlertCreateAPIView,
    AlertDeleteAPIView,
    AlertRetrieveAPIView,
    AlertUpdateAPIView,
    NotificationListViewSet,
    OrganizationAlertListViewSet,
    OverviewDataAPIView,
    OverviewStatsAPIView,
    SmartContractAlertListViewSet,
    get_pre_written_alerts,
    set_pre_written_alerts,
)

urlpatterns = [
    path("contract/<int:pk>/alerts", SmartContractAlertListViewSet.as_view()),
    path("organization/alerts", OrganizationAlertListViewSet.as_view()),
    path("alerts/<int:pk>", AlertRetrieveAPIView.as_view(), name="alert-retrieve"),
    path("alerts", AlertCreateAPIView.as_view(), name="alert-create"),
    path("alerts/update/<int:pk>", AlertUpdateAPIView.as_view(), name="alert-update"),
    path("alerts/delete/<int:pk>", AlertDeleteAPIView.as_view(), name="alert-delete"),
    path("notifications", NotificationListViewSet.as_view(), name="notification-list"),
    path("pre-written-alerts", get_pre_written_alerts, name="pre-written-alerts"),
    path(
        "set-pre-written-alerts", set_pre_written_alerts, name="set_pre_written_alerts"
    ),
    path("overview-data", OverviewDataAPIView, name="overview-data"),
    path("overview-stats", OverviewStatsAPIView, name="overview-stats"),
]
