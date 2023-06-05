from django.urls import include, path
from rest_framework import routers

from .views import SmartContractViewSet, add_abi, delete_abi, get_abi

router = routers.DefaultRouter(trailing_slash=False)
router.register(r"my", SmartContractViewSet, basename="smartcontract")

urlpatterns = [
    path("", include(router.urls)),
    path("add_abi", add_abi, name="add_abi"),
    path("get_abi", get_abi, name="get_abi"),
    path("delete_abi", delete_abi, name="delete_abi"),
]
