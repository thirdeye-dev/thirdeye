from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt

from organizations.models import Organization, OrganizationUser
from organizations.views.mixins import OrganizationMixin

from .permissions import IsAdminOrOwner

from .serializers import UserInviteSerializer, OrganizationSerializer
from authentication.serializers import UserSerializer

from django.contrib.auth import get_user_model

User = get_user_model()

class CreateOrganizationAPIView(generics.CreateAPIView):
    serializer_class = OrganizationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            # Create organization
            organization = serializer.save()

            # Add user as owner of the organization
            organization.add_user(request.user, is_owner=True, is_admin=True)

            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserInviteAPIView(generics.CreateAPIView):
    serializer_class = UserInviteSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request, org_pk, *args, **kwargs):
        org = get_object_or_404(Organization, pk=org_pk)
        
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        email = serializer.validated_data['email']

        try:
            org_user = OrganizationUser.objects.get(organization=org, email=email)
            if org_user.is_active:
                return Response({'detail': 'User is already a member of this organization.'},
                                status=status.HTTP_400_BAD_REQUEST)
            else:
                org_user.resend_activation_email(request=request)
        except OrganizationUser.DoesNotExist:
            org_user = org.invite_user(email=email, sender=request.user)

        return Response(
            {
            'detail': 'Invitation email sent to {} for organization: .'.format(email, org.name)
            }
        )

    
class UpdateUserRoleAPIView(OrganizationMixin, generics.UpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = (IsAuthenticated, IsAdminOrOwner)

    def put(self, request, org_pk, user_pk, *args, **kwargs):
        organization = self.get_organization()
        user = User.objects.get(user_pk)
        user_role = request.data.get('role', None)

        try:
            OrganizationUser.objects.get(organization=organization, user=user)
        except OrganizationUser.DoesNotExist:
            return Response({'detail': 'User is not a member of this organization.'},
                            status=status.HTTP_400_BAD_REQUEST)
        if user_role == 'admin':
            organization.make_user_admin(user)
            return Response({'detail': 'User role updated to admin.'}, status=status.HTTP_200_OK)
        elif user_role == 'member':
            organization.make_user_member(user)
            return Response({'detail': 'User role updated to member.'}, status=status.HTTP_200_OK)
        else:
            return Response({'detail': 'Invalid role.'}, status=status.HTTP_400_BAD_REQUEST)

class KickUserAPIView(OrganizationMixin, generics.DestroyAPIView):
    permission_classes = (permissions.IsAuthenticated, IsAdminOrOwner)

    def destroy(self, request, org_pk, user_pk, *args, **kwargs):
        user = User.objects.get(pk=user_pk)
        org = Organization.objects.get(pk=org_pk)

        # Check that the user is not the owner
        if user == org.owner:
            return Response(
                {'detail': 'Cannot remove owner from organization'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Remove the user from the organization
        org.remove_user(user)

        return Response(status=status.HTTP_204_NO_CONTENT)

    @method_decorator(csrf_exempt)
    def dispatch(self, *args, **kwargs):
        return super().dispatch(*args, **kwargs)


class OrganizationDeleteView(APIView):
    permission_classes = [IsAdminOrOwner]

    def delete(self, request, org_pk):
        org = Organization.objects.get(pk=org_pk)
        org.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class OrganizationLeaveView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, org_pk):
        user = request.user
        org_user = OrganizationUser.objects.get(user=user, organization_id=org_pk)
        if org_user.is_owner:
            return Response("Owners and Admins cannot leave the organization", status=status.HTTP_400_BAD_REQUEST)
        org_user.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    

