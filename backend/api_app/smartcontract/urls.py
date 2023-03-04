from django.urls import path
from .views import (
    SmartContractList,
    SmartContractCreate,
    SmartContractRetrieve,
    SmartContractUpdate,
    SmartContractDelete,
)

urlpatterns = [
    path("list", SmartContractList.as_view(), name="smart_contract-list"),
    path("create", SmartContractCreate.as_view(), name="smart_contract-create"),
    path("<int:pk>", SmartContractRetrieve.as_view(), name="smart_contract-detail"),
    path(
        "<int:pk>/update", SmartContractUpdate.as_view(), name="smart_contract-update"
    ),
    path(
        "<int:pk>/delete", SmartContractDelete.as_view(), name="smart_contract-delete"
    ),
]
