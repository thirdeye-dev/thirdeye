from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AlertViewSet

router = DefaultRouter(trailing_slash=False)
router.register(r"alerts", AlertViewSet, basename="alerts")

urlpatterns = [
    path("", include(router.urls)),
]
