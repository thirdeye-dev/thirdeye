from celery import shared_task
from django.conf import settings
from django.core.mail import send_mail


@shared_task(bind=True, max_retries=3)
def send_invite_email(self, email, invite_text, invite_html):
    try:
        send_mail(
            subject="You have been invited to join an organization",
            message=invite_text,
            html_message=invite_html,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[email],
            fail_silently=False,
        )
    except Exception as exc:
        raise self.retry(exc=exc)
