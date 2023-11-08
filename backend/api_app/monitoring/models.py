from django.db import models
from yamlfield.fields import YAMLField

from api_app.core.models import BaseMixin
from api_app.smartcontract.models import SmartContract


# monitoring model for celery tasks
class MonitoringTasks(BaseMixin):
    class TaskStatus(models.TextChoices):
        RUNNING = "RUNNING"
        PENDING = "PENDING"
        STOPPED = "STOPPED"

    SmartContract = models.ForeignKey(SmartContract, on_delete=models.CASCADE)

    # celery task id
    task_id = models.CharField(max_length=255, blank=True, null=True, unique=True)

    # celery task status
    task_status = models.CharField(
        max_length=16, choices=TaskStatus.choices, default=TaskStatus.PENDING
    )

    def __str__(self):
        return f"{self.SmartContract.address} - {self.task_id}"


class Alerts(BaseMixin):
    smart_contract = models.ForeignKey(SmartContract, on_delete=models.CASCADE)
    alert_yaml = YAMLField()
    name = models.CharField(max_length=255, blank=False, null=False)
    description = models.TextField(blank=True, null=True)
    active = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.smart_contract.address} - {self.name}"


class Notification(BaseMixin):
    class NotificationType(models.TextChoices):
        EMAIL = "EMAIL"
        SMS = "SMS"
        WEBHOOK = "WEBHOOK"

    class Status(models.TextChoices):
        PENDING = "PENDING"
        SENT = "SENT"
        FAILED = "FAILED"

    alert = models.ForeignKey(Alerts, on_delete=models.CASCADE)
    notification_type = models.CharField(
        max_length=16, choices=NotificationType.choices, default=NotificationType.EMAIL
    )
    notification_body = models.JSONField(blank=True, null=True)

    # this can be email, phone number, or webhook url
    notification_target = models.CharField(max_length=255, blank=False, null=False)

    # just in case, save the (last, if multiple caused)
    # transaction hash that triggered this alert
    trigger_transaction_hash = models.CharField(max_length=255, blank=True, null=True)

    task_id = models.CharField(max_length=255, blank=True, null=True, unique=True)

    meta_logs = models.JSONField(blank=True, null=True)

    status = models.CharField(
        max_length=16, choices=Status.choices, default=Status.PENDING
    )

    def __str__(self):
        return f"{self.alert.smart_contract.address} - {self.notification_target}"
