from django.urls import include, path
from rest_framework import routers

from .views import SmartContractViewSet

router = routers.DefaultRouter(trailing_slash=False)
router.register(r"my", SmartContractViewSet, basename="smartcontract")

urlpatterns = [
    path("", include(router.urls)),
]
