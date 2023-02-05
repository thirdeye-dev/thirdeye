from django.urls import path
from .views import SmartContractList, SmartContractCreate, SmartContractRetrieve, SmartContractUpdate, SmartContractDelete

urlpatterns = [
    path('smart_contracts/list', SmartContractList.as_view(), name='smart_contract-list'),
    path('smart_contracts/create', SmartContractCreate.as_view(), name='smart_contract-create'),
    path('smart_contracts/<int:pk>', SmartContractRetrieve.as_view(), name='smart_contract-detail'),
    path('smart_contracts/<int:pk>/update', SmartContractUpdate.as_view(), name='smart_contract-update'),
    path('smart_contracts/<int:pk>/delete', SmartContractDelete.as_view(), name='smart_contract-delete'),
]