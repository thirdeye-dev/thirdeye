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

    def __str__(self):
        return f"{self.smart_contract.address} - {self.name}"
