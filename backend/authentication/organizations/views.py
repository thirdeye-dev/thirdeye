from django.shortcuts import get_object_or_404
from django.contrib.auth import get_user_model

from rest_framework import (
    status, 
    views, 
    viewsets,
    generics
)
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from .models import Organization, Membership, Invitation
from .serializers import (
    OrganizationSerializer, 
    MembershipSerializer,
    InvitationSerializer
)
from .permissions import IsAdminOrReadOnly

User = get_user_model()

class OrganizationViewSet(viewsets.ModelViewSet):
    queryset = Organization.objects.all()
    serializer_class = OrganizationSerializer

    def get_permissions(self):
        if self.action == 'create':
            permission_classes = [IsAuthenticated]
        else:
            permission_classes = [IsAdminOrReadOnly]
        return [permission() for permission in permission_classes]

    def perform_create(self, serializer):
        organization = serializer.save()
        membership = Membership.objects.create(
            user=self.request.user,
            organization=organization,
            is_admin=True,
            is_owner=True,
        )
        membership.save()

    def perform_update(self, serializer):
        organization = serializer.save()
        membership = Membership.objects.get(
            user=self.request.user,
            organization=organization
        )
        membership.is_owner = True
        membership.save()

class InviteUserView(generics.CreateAPIView):
    queryset = Invitation.objects.all()
    serializer_class = InvitationSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        organization_id = kwargs.get('organization_id')
        try:
            organization = Organization.objects.get(
                pk=organization_id,
                memberships__user=request.user,
                memberships__is_admin=True,
            )
        except Organization.DoesNotExist:
            return Response({'error': 'You can\'t invite users to this organization.'}, status=status.HTTP_404_NOT_FOUND)

        data = request.data.copy()
        data['organization'] = organization_id
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)

        email = serializer.validated_data['email']

        # Check if the user is already a member of the organization
        if Membership.objects.filter(user__email=email, organization=organization).exists():
            return Response({'error': 'User is already a member of this organization.'}, status=status.HTTP_400_BAD_REQUEST)

        # Check if the user has already been invited to join the organization
        if Invitation.objects.filter(email=email, organization=organization).exists():
            return Response(
                {'error': 'User has already been invited to join this organization.'}, status=status.HTTP_400_BAD_REQUEST
            )

        invitation = Invitation.objects.create(
            email=email,
            organization=organization,
            invited_by=request.user,
            is_admin=serializer.validated_data['is_admin'],
            token=Invitation.generate_token(),
        )

        invitation.save()

        return Response({'success': 'Invitation sent successfully.'}, status=status.HTTP_201_CREATED)


class InviteView(views.APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, token):
        invitation = get_object_or_404(Invitation, token=token)
        organization = invitation.organization
        if invitation.email == request.user.email:
            declined = request.data.get('decline', False)
            if declined:
                invitation.delete()
                return Response(status=status.HTTP_204_NO_CONTENT)

            membership = Membership.objects.create(
                user=request.user,
                organization=organization,
                is_admin=invitation.is_admin,
                is_owner=invitation.is_owner,
            )
            membership.save()
            invitation.is_accepted = True
            invitation.save()
            return Response({
                "status": "Accepted Invitation Successfully!",
                'organization': OrganizationSerializer(organization).data,
                'membership': MembershipSerializer(membership).data,
            })
        return Response({
            "error": "You are not authorized to accept this invitation."
        }, status=status.HTTP_400_BAD_REQUEST)