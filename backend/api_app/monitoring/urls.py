from django.urls import path

from .views import (
    AlertCreateRetrieveAPIView,
    OrganizationAlertListViewSet,
    SmartContractAlertListViewSet,
)

urlpatterns = [
    path("contract/<int:pk>/alerts", SmartContractAlertListViewSet.as_view()),
    path("organization/alerts", OrganizationAlertListViewSet.as_view()),
    path("alerts/<int:pk>", AlertCreateRetrieveAPIView.as_view(), name="alert-retrieve"),
    path("alerts", AlertCreateRetrieveAPIView.as_view(), name="alert-create"),
]
