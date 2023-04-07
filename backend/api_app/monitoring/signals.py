from celery.signals import task_failure, task_success
from celery.utils.log import get_task_logger
from django.db.models.signals import post_save
from django.dispatch import receiver

from api_app.monitoring import tasks
from api_app.monitoring.models import MonitoringTasks, Notification
from api_app.smartcontract.models import SmartContract

logger = get_task_logger(__name__)


@receiver(post_save, sender=SmartContract)
def smart_contract_post_save(sender, instance, created, **kwargs):
    if created:
        # do on create
        monitoring_task = MonitoringTasks.objects.create(
            SmartContract=instance,
        )

        # this calls the next signal
        # which is for the monitoring task
        monitoring_task.save()


@receiver(post_save, sender=MonitoringTasks)
def monitoring_task_post_save(sender, instance, created, **kwargs):
    if created:
        task = tasks.monitor_contract.delay(instance.id)

        instance.task_status = MonitoringTasks.TaskStatus.RUNNING
        instance.task_id = task.id

        instance.save()


@receiver(post_save, sender=Notification)
def notification_post_save(sender, instance, created, **kwargs):
    if created:
        # task = tasks.send_webhook.delay(instance.id)
        # use async_to_sync to make it work
        task = tasks.send_webhook.apply_async(args=[instance.id])
        instance.task_id = task.id
        instance.save()


@task_failure.connect(sender=tasks.monitor_contract, weak=False)
@task_success.connect(sender=tasks.monitor_contract, weak=False)
def post_monitor_run_handler(request=None, **kwargs):
    sender = kwargs.get("sender")

    task_id = sender.request.id

    monitoring_task = MonitoringTasks.objects.filter(task_id=task_id).first()

    if not monitoring_task:
        error_msg = f"Monitoring task with id {task_id} not found"
        logger.error(error_msg)

        # silently, exit task.
        # this task is probably a ghost task.
        return

    monitoring_task.task_status = MonitoringTasks.TaskStatus.STOPPED
    monitoring_task.save()
