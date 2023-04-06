from celery import signals
from celery.utils.log import get_task_logger

from api_app.monitoring.models import MonitoringTasks
from api_app.smartcontract.models import SmartContract
from backend.celery import app

logger = get_task_logger(__name__)


@app.task(bind=True)
def entrypoint(self):
    # first celery task that runs when the server starts
    # checks all active alerts for smart contracts
    # and then start a thread for a contract.

    # delete all monitoring tasks that are not running
    # and are not in the queue
    # this is to avoid the case where a monitoring task is not running
    # but the task is still in the queue
    # this can happen if the worker is restarted
    # or if the task is not running for some reason
    tasks_to_delete = MonitoringTasks.objects.all()
    tasks_to_delete.delete()

    smart_contracts = SmartContract.objects.filter(active=True)
    for contract in smart_contracts:
        monitoring_task = MonitoringTasks.objects.create(
            SmartContract=contract,
        )

        # this calls the signal which is
        # for the monitoring task
        monitoring_task.save()


# TODO: add a celery-beat task to check if the main monitoring task for a
#  smart contract is running. If not, start it again.
@app.task(bind=True)
def fail_check(self):
    # 1 task per smart contract should be running minimum.
    # write a fail safe to check for it.

    # write a query to get all smart contracts which have a failed monitoring
    # task model instance
    # or one that does not exist at all.
    # then start a new monitoring task for it.
    pass


@signals.worker_ready.connect
def start_monitoring_tasks(**kwargs):
    # start monitoring tasks when the worker starts
    entrypoint.delay()
