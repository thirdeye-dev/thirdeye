from django.core.validators import EmailValidator
from django.utils.translation import gettext_lazy as _
from rest_framework import serializers
from organizations.models import Organization


class OrganizationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Organization
        fields = '__all__'

    # write create where i fill the slug (making it URL safe) myself on the basis of the name
    def create(self, validated_data):
        slug = validated_data['name'].replace(' ', '-').lower()
        validated_data['slug'] = slug
        return super().create(validated_data)

class UserInviteSerializer(serializers.Serializer):
    email = serializers.EmailField(
        validators=[EmailValidator(message=_('Enter a valid email address.'))],
        help_text=_('Email address of the user to be invited.'),
    )

    def save(self, **kwargs):
        request = self.context['request']
        organization = kwargs.get('organization')
        email = self.validated_data['email']

        invite = organization.invite_user(request.user, email)
        return invite
