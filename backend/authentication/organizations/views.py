from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404
from rest_framework import generics, status, views, viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import Invitation, Membership, Organization
from .serializers import (
    InvitationSerializer,
    MembershipSerializer,
    OrganizationSerializer,
)

User = get_user_model()


class OrganizationViewSet(viewsets.ModelViewSet):
    queryset = Organization.objects.all()
    serializer_class = OrganizationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Organization.objects.filter(memberships__user=self.request.user)

    def perform_create(self, serializer):
        organization = serializer.save()
        membership = Membership.objects.create(
            user=self.request.user,
            organization=organization,
            is_admin=True,
            is_owner=True,
        )
        membership.save()


class InviteUserView(generics.CreateAPIView):
    queryset = Invitation.objects.all()
    serializer_class = InvitationSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        organization_id = kwargs.get("organization_id")
        try:
            organization = Organization.objects.get(
                pk=organization_id,
                memberships__user=request.user,
                memberships__is_admin=True,
            )
        except Organization.DoesNotExist:
            return Response(
                {"error": "You can't invite users to this organization."},
                status=status.HTTP_404_NOT_FOUND,
            )

        data = request.data.copy()
        data["organization"] = organization_id
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)

        email = serializer.validated_data["email"]

        # Check if the user is already a member of the organization
        if Membership.objects.filter(
            user__email=email, organization=organization
        ).exists():
            return Response(
                {"error": "User is already a member of this organization."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Check if the user has already been invited to join the organization
        if Invitation.objects.filter(email=email, organization=organization).exists():
            return Response(
                {"error": "User has already been invited to join this organization."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        invitation = Invitation.objects.create(
            email=email,
            organization=organization,
            invited_by=request.user,
            is_admin=serializer.validated_data["is_admin"],
            token=Invitation.generate_token(),
        )

        invitation.save()

        return Response(
            {"success": "Invitation sent successfully."}, status=status.HTTP_201_CREATED
        )


class InviteView(views.APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, token):
        invitation = get_object_or_404(Invitation, token=token)
        organization = invitation.organization
        if invitation.email == request.user.email:
            declined = request.data.get("decline", False)
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
            return Response(
                {
                    "status": "Accepted Invitation Successfully!",
                    "organization": OrganizationSerializer(organization).data,
                    "membership": MembershipSerializer(membership).data,
                }
            )
        return Response(
            {"error": "You are not authorized to accept this invitation."},
            status=status.HTTP_400_BAD_REQUEST,
        )
