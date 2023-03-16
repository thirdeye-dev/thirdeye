from django.core.validators import EmailValidator
from django.utils.translation import gettext_lazy as _
from rest_framework import serializers
from organizations.models import OrganizationInvitation

from django.db import models

# create ROLE_CHOICES 
class ROLE_CHOICES(models.TextChoices):
    MEMBER = 'member'
    ADMIN = 'admin'


class UserInviteSerializer(serializers.Serializer):
    email = serializers.EmailField(
        validators=[EmailValidator(message=_('Enter a valid email address.'))],
        help_text=_('Email address of the user to be invited.'),
    )
    role = serializers.ChoiceField(
        choices=ROLE_CHOICES.choices,
        help_text=_('Role of the invited user.'),
    )

    def save(self, **kwargs):
        request = self.context['request']
        organization = kwargs.get('organization')
        email = self.validated_data['email']
        role = self.validated_data['role']
        invite = organization.invite_user(request.user, email, role)
        return invite
