from django.db import models
from django.utils import timezone
from django.contrib.postgres.fields import ArrayField
from django.core.exceptions import ValidationError

from api_app.smartcontract.models import SmartContract
from api_app.core.serializers import IOCSerializer

ioc_types = IOCSerializer.read_and_verify_config()
ioc_choices = [ioc_type for ioc_type in ioc_types.keys()]


# status of alerts "SUCCESS" and "FAILURE"
class Status(models.TextChoices):
    SUCCESS = "SUCCESS"
    FAILURE = "FAILURE"


# alert type choice model to support enum
class AlertType(models.TextChoices):
    SMS = "SMS"
    EMAIL = "EMAIL"
    WEBHOOK = "WEBHOOK"


# ioc_type model to support enum
# read from ioc.json to get the ioc types
class IoCType(models.TextChoices):
    *ioc_types,

    @classmethod
    def choices(cls):
        return [(choice.name, choice.value) for choice in cls]


# a enum class for threshold currency
class ThresholdCurrency(models.TextChoices):
    ETH = "ETH"
    GWEI = "GWEI"
    USD = "USD"


# validate alert type
def validate_alert_type(value):
    if value not in AlertType.values:
        raise ValidationError((f"{value} is not a valid choice for AlertType"))


# IoC activated by a user
# on a smart contract
class IoC(models.Model):
    SmartContract = models.ForeignKey(SmartContract, on_delete=models.CASCADE)

    ioc_type = models.CharField(max_length=120, choices=IoCType.choices)
    threshold = models.FloatField(null=True)
    threshold_currency = models.CharField(
        max_length=16, choices=ThresholdCurrency.choices
    )

    # fix the alert_types
    alert_types = ArrayField(
        models.CharField(max_length=16),
        validators=[validate_alert_type],
        default=list,
    )
    alert_url = models.CharField(max_length=255, blank=True, null=True)

    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"{self.SmartContract.address} - {self.ioc_type}"


class IOCAlert(models.Model):
    message = models.TextField()

    # status an enum of "SUCCESS" and "FAILURE"
    status = models.CharField(max_length=16, choices=Status.choices)

    # for alert_type == "webhook"
    url = models.CharField(max_length=255, null=True)
    request_token = models.CharField(max_length=16, null=True)
    response = models.TextField(blank=True, null=True)
    response_code = models.IntegerField(blank=True, null=True)

    # for alert_type == "email"
    email = models.CharField(max_length=255, null=True)

    # for alert_type == "sms"
    phone_number = models.CharField(max_length=255, null=True)

    ioc = models.ForeignKey(IoC, on_delete=models.CASCADE)

    updated_at = models.DateTimeField(default=timezone.now)
    created_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"{self.url} - {self.status}"
