from django.db.models.signals import post_save
from django.dispatch import receiver
from api_app.monitoring.models import (
    MonitoringTasks
)
from api_app.monitoring import tasks

from api_app.smartcontract.models import SmartContract

@receiver(post_save, sender=SmartContract)
def smart_contract_post_save(sender, instance, created, **kwargs):
    if created:
        # do on create
        monitoring_task = MonitoringTasks.objects.create(
            SmartContract=instance,
            status="PENDING"
        )

        monitoring_task.save()

        task = tasks.monitor_contract.delay(args=[monitoring_task.id])

        monitoring_task.status = "RUNNING"
        monitoring_task.task_id = task.id

        monitoring_task.save()
    # else:
        # do on update