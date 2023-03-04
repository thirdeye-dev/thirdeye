from django.urls import path
from .views import IoCListAPI, set_ioc_alert

urlpatterns = [
    path("get_ioc_config", IoCListAPI.as_view()),
    path("set_ioc_alert", set_ioc_alert),
]
