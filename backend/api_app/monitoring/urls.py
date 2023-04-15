from django.urls import path

from .views import (
    AlertRetrieveAPIView,
    AlertCreateAPIView,
    OrganizationAlertListViewSet,
    SmartContractAlertListViewSet,
)

urlpatterns = [
    path("contract/<int:pk>/alerts", SmartContractAlertListViewSet.as_view()),
    path("organization/alerts", OrganizationAlertListViewSet.as_view()),
    path(
        "alerts/<int:pk>", AlertRetrieveAPIView.as_view(), name="alert-retrieve"
    ),
    path("alerts", AlertCreateAPIView.as_view(), name="alert-create"),
]
