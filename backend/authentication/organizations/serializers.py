import uuid

from rest_framework import serializers

from .models import Invitation, Membership, Organization


class MembershipSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(
        read_only=True, default=serializers.CurrentUserDefault()
    )

    class Meta:
        model = Membership
        fields = "__all__"


class OrganizationSerializer(serializers.ModelSerializer):
    memberships = MembershipSerializer(many=True, read_only=True)
    is_member = serializers.SerializerMethodField()

    class Meta:
        model = Organization
        read_only_fields = (
            "id",
            "is_member",
            "memberships",
            "created_at",
            "updated_at",
        )
        fields = "__all__"

    def save(self, **kwargs):
        id = uuid.uuid4()
        self.validated_data["id"] = id

        return super().save(**kwargs)

    def get_is_member(self, obj):
        request = self.context.get("request")
        return (
            request.user.is_authenticated
            and obj.memberships.filter(user=request.user).exists()
        )


class InvitationSerializer(serializers.ModelSerializer):
    is_admin = serializers.BooleanField(default=False)

    class Meta:
        model = Invitation
        fields = ("email", "is_admin")
