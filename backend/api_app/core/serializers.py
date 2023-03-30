import hashlib
import json
import os
import sys
from datetime import datetime

import yaml
from cache_memoize import cache_memoize
from django.conf import settings
from rest_framework import serializers
from rest_framework import serializers as rfs


# would be legacy soon
class IOCSerializer(rfs.Serializer):
    name = rfs.CharField(required=True)
    entrypoint = rfs.CharField(required=True)
    description = rfs.CharField(required=True)
    params = rfs.JSONField(required=True)

    CONFIG_FILE_NAME = "iocs.json"

    @classmethod
    def _get_config_path(cls) -> str:
        return os.path.join(settings.BASE_DIR, "configuration", cls.CONFIG_FILE_NAME)

    @classmethod
    def _read_config(cls):
        config_path = cls._get_config_path()
        with open(config_path) as f:
            config_dict = json.load(f)
        return config_dict

    @classmethod
    def _verify_params(cls, params):
        for param in params:
            if params.get(param) not in ["int", "str", "float"]:
                raise rfs.ValidationError(
                    f"Invalid type {param.get('type')} for param {param.get('name')}"
                )

    @classmethod
    def _md5_config_file(cls) -> str:
        """
        Returns md5sum of config file.
        """
        fpath = cls._get_config_path()
        with open(fpath, "r") as fp:
            buffer = fp.read().encode("utf-8")
            md5hash = hashlib.md5(buffer).hexdigest()
        return md5hash

    @classmethod
    @cache_memoize(
        timeout=sys.maxsize,
        args_rewrite=lambda cls: f"{cls.__name__}-{cls._md5_config_file()}",
    )
    def read_and_verify_config(cls) -> dict:
        """
        Returns verified config.
        This function is memoized for the md5sum of the JSON file.
        """
        config_dict = cls._read_config()

        serializer_errors = {}
        for key, config in config_dict.items():
            new_config = {"name": key, **config}
            serializer = cls(data=new_config)
            if serializer.is_valid():
                cls._verify_params(serializer.validated_data.get("params"))
                config_dict[key] = serializer.data
            else:
                serializer_errors[key] = serializer.errors

        if bool(serializer_errors):
            raise rfs.ValidationError(serializer_errors)

        return config_dict


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

        if operator == "<":
            return attribute_value < value
        elif operator == "<=":
            return attribute_value <= value
        elif operator == ">":
            return attribute_value > value
        elif operator == ">=":
            return attribute_value >= value
        elif operator == "==":
            return attribute_value == value
        elif operator == "!=":
            return attribute_value != value
        else:
            return False


class ContractAddressSerializer(serializers.Serializer):
    blockchain_name = serializers.CharField()
    network = serializers.ChoiceField(choices=["mainnet", "testnet"])
    alert_type = serializers.ChoiceField(choices=["every_transaction"])
    contract_addresses = serializers.ListField(
        child=serializers.CharField(min_length=42, max_length=42)
    )
    alerts = serializers.DictField(child=AlertSerializer())


class BlockchainAlertsSerializer(serializers.Serializer):
    blockchain_alerts = ContractAddressSerializer(many=True)


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
