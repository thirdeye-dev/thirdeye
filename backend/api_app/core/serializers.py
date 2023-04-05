import os
from datetime import datetime

import yaml
from cache_memoize import cache_memoize
from django.conf import settings
from rest_framework import serializers
from rest_framework import serializers as rfs


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


class NotificationType(serializers.ChoiceField):
    def __init__(self, **kwargs):
        super().__init__(choices=["send_email", "send_sms"], **kwargs)


class AlertSerializer(serializers.Serializer):
    attribute = serializers.CharField()
    operator = serializers.ChoiceField(choices=["<", "<=", ">", ">=", "==", "!="])
    value = serializers.FloatField()
    notifications = serializers.ListField(child=NotificationType())

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


class AlertDescriptiveSerializer(serializers.Serializer):
    alert_type = serializers.ChoiceField(choices=["every_transaction"])
    alerts = serializers.DictField(child=AlertSerializer())


class BlockchainAlertsSerializer(serializers.Serializer):
    blockchain_alerts = AlertDescriptiveSerializer(many=True)


def parse_yaml_file(file_path):
    with open(file_path, "r") as yaml_file:
        yaml_data = yaml.safe_load(yaml_file)
    return yaml_data


def validate_configuration(yaml_data):
    serializer = BlockchainAlertsSerializer(data=yaml_data)
    serializer.is_valid(raise_exception=True)
    return serializer.validated_data


class BlockchainAlertRunner:
    def __init__(self, config_data, transaction_data):
        self.validated_data = validate_configuration(config_data)
        self.transaction = Transaction(transaction_data)

    def run(self):
        for contract_address in self.validated_data["blockchain_alerts"]:
            for alert_name, alert in contract_address["alerts"].items():
                if self.check_alert_condition(alert):
                    self.trigger_notifications(alert["notifications"])

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

    def trigger_notifications(self, notifications):
        for notification in notifications:
            if notification == "send_email":
                self.send_email()
            elif notification == "send_sms":
                self.send_sms()

    def send_email(self):
        # Implement email sending logic here
        print("Email notification triggered.")

    def send_sms(self):
        # Implement SMS sending logic here
        print("SMS notification triggered.")


# Example usage
def main():
    # get current file path
    file_path = os.path.dirname(os.path.realpath(__file__))
    file_path = os.path.join(file_path, "config.yaml")

    yaml_config = parse_yaml_file(file_path)
    transaction_data = {
        # Provide the transaction data received from Infura
        "hash": "0x1234...",
        "nonce": 2,
        "blockHash": "0x1234...",
        "blockNumber": 403,
        "transactionIndex": 0,
        "from": "0x1234...",
        "to": "0x5678...",
        "value": "0x9184e72a",
        "gas": 100000,
        "gasPrice": "0x4a817c800",
        "input": "0x...",
        "v": "0x1b",
        "r": "0x1234...",
        "s": "0x5678...",
    }

    transaction_data["timestamp"] = datetime.now().timestamp()
    transaction_data["value"] = int(transaction_data["value"], 16)
    transaction_data["gasPrice"] = int(transaction_data["gasPrice"], 16)

    alert_runner = BlockchainAlertRunner(yaml_config, transaction_data)
    alert_runner.run()
