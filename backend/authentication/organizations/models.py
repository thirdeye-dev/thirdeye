from django.conf import settings
from django.contrib.auth import get_user_model
from django.db import models
from django.utils.crypto import get_random_string
from django.utils.translation import ugettext_lazy as _

from api_app.core.models import BaseMixin

from .tasks import send_invite_email

User = get_user_model()


def invite_user_from_email(email, invited_by, organization=None, token=None):
    if not organization and token is None:
        raise ValueError("Organization and token is required")

    invite_link = f"{settings.FRONTEND_URL}/invite/{token}"
    invite_text = (
        f"You've been invited to join {organization.name} organization by {invited_by.email}"
        f"Click the link below to accept the invitation.\n{invite_link}"
    )
    invite_html = (
        f"<p>You've been invited to join {organization.name} organization. "
        f"Click the link below to accept the invitation.</p><a href='{invite_link}'>{invite_link}</a>"
    )
    send_invite_email.delay(email, invite_text, invite_html)


class Organization(BaseMixin):
    id = models.UUIDField(primary_key=True, editable=False)
    name = models.CharField(max_length=100)

    class Meta:
        verbose_name = _("Organization")
        verbose_name_plural = _("Organizations")

    def __str__(self):
        return self.name


class Membership(BaseMixin):
    user = models.ForeignKey(
        to=User, on_delete=models.CASCADE, related_name="memberships"
    )
    organization = models.ForeignKey(
        to=Organization, on_delete=models.CASCADE, related_name="memberships"
    )
    is_admin = models.BooleanField(default=False)
    is_owner = models.BooleanField(default=False)

    class Meta:
        verbose_name = _("Membership")
        verbose_name_plural = _("Memberships")

    @classmethod
    def is_member(cls, user, organization):
        return cls.objects.filter(user=user, organization=organization).exists()


class Invitation(BaseMixin):
    email = models.EmailField()
    invited_by = models.ForeignKey(
        to=User, related_name="invitations_sent", on_delete=models.CASCADE
    )
    organization = models.ForeignKey(
        to=Organization, related_name="invitations", on_delete=models.CASCADE
    )
    is_accepted = models.BooleanField(default=False)
    is_admin = models.BooleanField(default=False)
    is_owner = models.BooleanField(default=False)
    token = models.CharField(max_length=100)

    class Meta:
        verbose_name = _("Invitation")
        verbose_name_plural = _("Invitations")

    def __str__(self):
        return self.email

    def save(self, *args, **kwargs):
        invite_user_from_email(
            self.email, self.invited_by, self.organization, self.token
        )
        return super().save(*args, **kwargs)

    @classmethod
    def generate_token(cls):
        return get_random_string(length=32)
