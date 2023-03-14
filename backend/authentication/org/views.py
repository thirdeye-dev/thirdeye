from rest_framework import generics, permissions, status
from rest_framework.response import Response
from organizations.models import Organization, OrganizationUser
from .serializers import UserInviteSerializer

class UserInviteAPIView(generics.CreateAPIView):
    serializer_class = UserInviteSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        email = serializer.validated_data['email']
        organization = Organization.objects.get(id=request.user.organizationuser.organization_id)

        try:
            org_user = OrganizationUser.objects.get(organization=organization, email=email)
            if org_user.is_active:
                return Response({'detail': 'User is already a member of this organization.'},
                                status=status.HTTP_400_BAD_REQUEST)
            else:
                org_user.resend_activation_email(request=request)
        except OrganizationUser.DoesNotExist:
            org_user = organization.invite_user(email=email, sender=request.user)

        return Response({'detail': 'Invitation email sent to {} for organization: .'.format(email, organization.name)})
