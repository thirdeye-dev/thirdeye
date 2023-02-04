from .celery import app

from celery import shared_task
from celery.utils.log import get_task_logger

logger = get_task_logger(__name__)
