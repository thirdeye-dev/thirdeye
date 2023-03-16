from django.urls import path
from .views import (
    CreateOrganizationAPIView,
    UserInviteAPIView,
    UpdateUserRoleAPIView,
    OrganizationDeleteView,
    OrganizationLeaveView,
    KickUserAPIView
)

urlpatterns = [
    path('create', CreateOrganizationAPIView.as_view(), name='create'),
    path('<int:org_pk>/invite', UserInviteAPIView.as_view(), name='invite-user'),
    # path('<int:org_pk>/update-role/<int:user_pk>', UpdateUserRoleAPIView.as_view(), name='update-role'),
    # path('<int:org_pk>/delete', OrganizationDeleteView.as_view(), name='delete'),
    # path('leave/<int:org_pk>', OrganizationLeaveView.as_view(), name='leave'),
    # path('<int:org_pk>/kick/<int:user_id>', KickUserAPIView.as_view(), name='kick'),
]
