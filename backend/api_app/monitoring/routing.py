from django.urls import path

from api_app.monitoring.consumer import NotificationsConsumer

websocket_urlpatterns = [
    path(
        "ws/notifications/<str:owner_organization_id>", NotificationsConsumer.as_asgi()
    ),
]
