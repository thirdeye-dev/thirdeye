from django.urls import path

from .views import (
    SmartContractAlertListViewSet, 
    OrganizationAlertListViewSet,
    AlertRetrieveAPIView
)

urlpatterns = [
    path("contract/<int:pk>/alerts", SmartContractAlertListViewSet.as_view()),
    path("organization/alerts", OrganizationAlertListViewSet.as_view()),
    path("alerts/<int:pk>", AlertRetrieveAPIView.as_view()),
]
