from django.core.validators import EmailValidator
from django.utils.translation import gettext_lazy as _
from rest_framework import serializers
from organizations.models import Organization


class OrganizationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Organization
        fields = ('name', 'slug')

    def validate(self, attrs):
        slug = attrs['name'].replace(' ', '-').lower()
        attrs['slug'] = slug

        if Organization.objects.filter(slug=slug).exists():
            raise serializers.ValidationError(_('Organization with this name already exists.'))

        return super().validate(attrs)

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
