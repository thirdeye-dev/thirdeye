from django.urls import path
from rest_framework import routers

from .views import InviteUserView, InviteView, OrganizationViewSet

router = routers.SimpleRouter(trailing_slash=False)
router.register(r"my", OrganizationViewSet)

urlpatterns = [
    path("accept_invitation/<str:token>", InviteView.as_view(), name="invitation_view"),
    path("<str:organization_id>/invite", InviteUserView.as_view(), name="invite_user"),
]

urlpatterns += router.urls
