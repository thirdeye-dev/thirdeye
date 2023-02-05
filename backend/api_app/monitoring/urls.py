from django.urls import path
from .views import PlaybookListAPI

urlpatterns = [
    path("get_ioc_config", PlaybookListAPI.as_view())
]
