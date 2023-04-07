import requests
import logging

import yaml
from rest_framework import serializers as rfs

from api_app.monitoring.models import Alerts, Notification

logger = logging.getLogger(__name__)


# new code. This is the new serializer.
# Transaction class to map transaction attributes
class Transaction:
    def __init__(self, transaction_data):
        self.hash = transaction_data.get("hash")
        self.nonce = transaction_data.get("nonce")
        self.blockHash = transaction_data.get("blockHash")
        self.blockNumber = transaction_data.get("blockNumber")
        self.transactionIndex = transaction_data.get("transactionIndex")
        self.from_address = transaction_data.get("from")
        self.to = transaction_data.get("to")
        self.value = transaction_data.get("value")
        self.gas = transaction_data.get("gas")
        self.gasPrice = transaction_data.get("gasPrice")
        self.input = transaction_data.get("input")
        self.v = transaction_data.get("v")
        self.r = transaction_data.get("r")
        self.s = transaction_data.get("s")
        self.timestamp = transaction_data.get("timestamp")


class NotificationType(rfs.ChoiceField):
    def __init__(self, **kwargs):
        super().__init__(choices=["send_email", "send_sms", "send_webhook"], **kwargs)


class AlertSerializer(rfs.Serializer):
    attribute = rfs.CharField()
    operator = rfs.ChoiceField(choices=["<", "<=", ">", ">=", "==", "!="])
    value = rfs.FloatField()
    notifications = rfs.ListField(child=NotificationType())

    # optional webhook field, only used if notification_type is "send_webhook"
    webhook_url = rfs.URLField(required=False)

    @staticmethod
    def check_operator(attribute_value, operator, value):
        attribute_value = float(attribute_value)

        return {
            "<": attribute_value < value,
            "<=": attribute_value <= value,
            ">": attribute_value > value,
            ">=": attribute_value >= value,
            "==": attribute_value == value,
            "!=": attribute_value != value,
        }.get(operator, False)


class AlertDescriptiveSerializer(rfs.Serializer):
    # later on, I want to add for "every_transaction" and
    # every x amount of time: "moment_of_day", where
    # i can expect a validated cron expression
    alert_type = rfs.ChoiceField(choices=["every_transaction"])
    alerts = rfs.DictField(child=AlertSerializer())


class BlockchainAlertsSerializer(rfs.Serializer):
    blockchain_alerts = AlertDescriptiveSerializer(many=True)


def parse_yaml_file(file_path):
    with open(file_path, "r") as yaml_file:
        yaml_data = yaml.safe_load(yaml_file)
    return yaml_data


def validate_configuration(yaml_data):
    serializer = BlockchainAlertsSerializer(data=yaml_data)
    serializer.is_valid(raise_exception=True)
    return serializer.validated_data


class AlertsAPISerializer(rfs.ModelSerializer):
    class Meta:
        model = Alerts
        fields = "__all__"
        read_only_fields = ["id", "created_at", "updated_at"]

    def validate_alert_yaml(self, configuration):
        try:
            yaml_to_json = yaml.safe_load(configuration)
            configuration = validate_configuration(yaml_to_json)
        except Exception as e:
            logger.error(e)
            raise rfs.ValidationError(e)
        return configuration


class BlockchainAlertRunner:
    def __init__(self, Alert: Alerts, transaction_data: dict):
        self.Alert = Alert
        self.validated_data = validate_configuration(Alert.alert_yaml)
        self.transaction = Transaction(transaction_data)

    def run(self):
        for contract_address in self.validated_data["blockchain_alerts"]:
            for alert_name, alert in contract_address["alerts"].items():
                if self.check_alert_condition(alert):
                    self.trigger_notifications(alert)
                else:
                    requests.post(
                        "https://eot0jnzvvvbvr8j.m.pipedream.net/notmet",
                        json={"alert": alert_name, "transaction": self.transaction},
                    )

    def check_alert_condition(self, alert):
        attribute_key = (
            alert["attribute"].replace("{{ $transaction.", "").replace(" }}", "")
        )
        attribute_value = getattr(self.transaction, attribute_key)
        operator = alert["operator"]
        value = alert["value"]

        if not AlertSerializer.check_operator(attribute_value, operator, value):
            return False
        return True

    def trigger_notifications(self, alert_data):
        notifications = alert_data["notifications"]
        for notification in notifications:
            {
                "send_email": self.send_email,
                "send_sms": self.send_sms,
                "send_webhook": self.send_webhook,
            }.get(notification)(alert_data)

    # all these methods (should) use django signals
    # to trigger the notification
    def send_email(self, alert_data):
        # add an email notification here
        print("Email notification triggered.")

    def send_sms(self, alert_data):
        # Implement SMS sending logic here
        print("SMS notification triggered.")

    def send_webhook(self, alert_data):
        webhook_url = alert_data.get("webhook_url")
        alert_body = {
            "message": f"Alert {self.Alert.name} triggered for transaction.",
            "transaction": self.transaction.__dict__,
        }

        notification = Notification.objects.create(
            alert=self.Alert,
            notification_type="send_webhook",
            notification_body=alert_body,
            notification_target=webhook_url,
            trigger_transaction_hash=self.transaction.hash,
        )
        notification.save()
