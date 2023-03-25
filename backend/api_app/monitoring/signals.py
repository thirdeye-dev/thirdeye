import requests

from celery.signals import task_success

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
        )

        monitoring_task.save()

        task = tasks.monitor_contract.delay(monitoring_task.id)

        monitoring_task.task_status = MonitoringTasks.TaskStatus.RUNNING
        monitoring_task.task_id = task.id

        monitoring_task.save()


@task_success.connect(sender=tasks.monitor_contract, weak=False)
def post_monitor_run_handler(request=None, **kwargs):
    sender = kwargs.get('sender')

    task_id = sender.request.id

    monitoring_task = MonitoringTasks.objects.get(task_id=task_id)

    monitoring_task.task_status = MonitoringTasks.TaskStatus.STOPPED
    monitoring_task.save()
