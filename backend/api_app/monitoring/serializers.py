import logging
from collections import OrderedDict

import yaml
from rest_framework import serializers as rfs
from simpleeval import simple_eval

from api_app.monitoring.exceptions import (
    ABINotFoundError,
    ConditionResultError,
    ContractFunctionError,
)
from api_app.monitoring.integrations import airstack_identities
from api_app.monitoring.models import Alerts, Notification

logger = logging.getLogger(__name__)


class Transaction:
    def __init__(self, transaction_data):
        # base class for all transactions
        pass

    def compile_to_dict(self):
        dict_normal = self.to_dict

        dict_with_str = {str(x): y for x, y in dict_normal.items()}
        return dict_with_str


#     # what's the point of doing this anyway?
#     def compile_to_dict_with_prefix(self, prefix: str = "txn_"):
#         dict_normal = self.to_dict

#         dict_with_str = {str(prefix + x): y for x, y in dict_normal.items()}
#         return dict_with_str


# new code. This is the new serializer.
# Transaction class to map transaction attributes
class TransactionETH(Transaction):
    def __init__(self, transaction_data):
        self.transaction_data = transaction_data

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
        self.fn_name = transaction_data.get("fn_name")
        self.output = transaction_data.get("output")
        self.v = transaction_data.get("v")
        self.r = transaction_data.get("r")
        self.s = transaction_data.get("s")
        self.timestamp = transaction_data.get("timestamp")

        # wait, why did i do this earlier?
        # why not just use the transaction_data dict?
        self.to_dict = {
            "hash": self.hash,
            "nonce": self.nonce,
            "blockHash": self.blockHash,
            "blockNumber": self.blockNumber,
            "transactionIndex": self.transactionIndex,
            "from": self.from_address,
            "to": self.to,
            "value": self.value,
            "gas": self.gas,
            "gasPrice": self.gasPrice,
            "input": self.input,
            "fn_name": self.fn_name,
            "v": self.v,
            "r": self.r,
            "s": self.s,
            "timestamp": self.timestamp,
            "output": self.output,
            # "airstack_identities": airstack_identities(),
        }


class TransactionSOL(Transaction):
    def __init__(self, transaction_data):
        self.to_dict = transaction_data


class NotificationType(rfs.ChoiceField):
    def __init__(self, **kwargs):
        super().__init__(choices=["send_email", "send_sms", "send_webhook"], **kwargs)


class AlertSerializer(rfs.Serializer):
    condition = rfs.CharField()
    notifications = rfs.ListField(child=NotificationType())

    # optional webhook field, only used if notification_type is "send_webhook"
    webhook_url = rfs.URLField(required=False)


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


class AlertUpdateSerializer(rfs.ModelSerializer):
    class Meta:
        model = Alerts
        fields = (
            "name",
            "smart_contract",
            "alert_yaml",
            "active",
        )  # Include the fields you want to allow for update

    def validate(self, data):
        if "alert_yaml" in data:
            try:
                yaml_to_json = yaml.safe_load(data["alert_yaml"])
                data["alert_yaml"] = validate_configuration(yaml_to_json)
            except Exception as e:
                logger.error(e)
                raise rfs.ValidationError(e)
        if "smart_contract" in data:
            if (
                data["smart_contract"].owner_organization
                != self.instance.smart_contract.owner_organization
            ):
                raise rfs.ValidationError(
                    "Cannot change smart contract to a different organization"
                )
        return data


class AlertsAPISerializer(rfs.ModelSerializer):
    class CustomYAMLField(rfs.Field):
        @classmethod
        def represent_ordereddict(cls, dumper, data):
            return dumper.represent_dict(data.items())

        def to_internal_value(self, data):
            return data

        def to_representation(self, value):
            yaml.add_representer(OrderedDict, self.represent_ordereddict)
            return yaml.dump(value)

    def __init__(self, *args, include_alert_yaml=False, **kwargs):
        super().__init__(*args, **kwargs)
        if include_alert_yaml:
            self.fields["alert_yaml"] = self.CustomYAMLField()
        else:
            self.fields.pop("alert_yaml", None)

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
        if Alert.smart_contract.chain == "sol":
            self.transaction = TransactionSOL(transaction_data)
        else:
            self.transaction = TransactionETH(transaction_data)

    def run(self):
        for contract_address in self.validated_data["blockchain_alerts"]:
            for alert_name, alert in contract_address["alerts"].items():
                if self.check_alert_condition(alert):
                    self.trigger_notifications(alert)
                else:
                    # condition not met
                    pass

    def trigger_automations(self, automations):
        abi = self.Alert.smart_contract.abi

        if abi is None:
            raise ABINotFoundError("ABI not found for smart contract.")

        for automation_name, automation in automations:
            function_to_call = automation.get("function")
            if function_to_call is None:
                # ideally, shouldn't get here.
                raise ContractFunctionError("No function set in automation.")

            function = self.Alert.smart_contract.get_function_by_name(function_to_call)
            if function is None:
                raise ContractFunctionError("Function not found in ABI.")

            function_inputs_from_abi = automation.get("inputs")
            function_input_arguments = automation.get("arguments")
            if function_inputs_from_abi is None:
                raise ContractFunctionError("No inputs found in ABI.")

            if function_input_arguments is None:
                raise ContractFunctionError("No arguments found in automation.")

            if len(function_inputs_from_abi) != len(function_input_arguments):
                raise ContractFunctionError(
                    "Number of inputs and arguments don't match."
                )

            # call function with arguments

    def check_alert_condition(self, alert) -> bool:
        txn_or_block = self.transaction.compile_to_dict()
        condition = alert.get("condition")

        variables = {
            "txn": txn_or_block,
        }

        functions = {
            "airstack_identities": airstack_identities,
        }

        if condition is None:
            raise ConditionResultError("Condition not found in alert.", condition)

        try:
            result: bool = simple_eval(condition, names=variables, functions=functions)
        except Exception as e:
            raise ConditionResultError(e, condition)

        if isinstance(result, bool):
            return result

        raise ConditionResultError("Condition didn't return a boolean.", condition)

    def run_dummy_check(self):
        # implement this later
        # should be used to check if the condition given
        # by user runs.
        pass

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

        logger.info(
            f"Attempting to trigger webhook notification for {self.Alert.name}."
        )

        if self.Alert.smart_contract.chain == "sol":
            # to support multiple transactions in a single block for solana
            hash_ = self.transaction.to_dict["blockhash"]
        else:
            hash_ = self.transaction.to_dict["hash"]

        text = "transaction" if self.Alert.smart_contract.chain != "sol" else "block"

        alert_body = {
            "message": f"Alert {self.Alert.name} triggered for { text } {hash_}",
            "notification_limit_details": {
                "limit": self.Alert.smart_contract.owner_organization.notification_limit,
                "current": Notification.objects.filter(
                    alert=self.Alert, notification_type="send_webhook"
                ).count(),
            },
            text: self.transaction.compile_to_dict(),
        }

        logger.info("[INFO] Alert body: " + str(alert_body))

        notification = Notification.objects.create(
            alert=self.Alert,
            notification_type="send_webhook",
            notification_body=alert_body,
            notification_target=webhook_url,
            trigger_transaction_hash=hash_,
        )
        notification.save()

        logger.info(f"Webhook notification triggered for {self.Alert.name}.")


class NotificationAPISerializer(rfs.ModelSerializer):
    alert_name = rfs.CharField(source="alert.name")
    alert_description = rfs.CharField(source="alert.description")
    contract_name = rfs.CharField(source="alert.smart_contract.name")

    class Meta:
        model = Notification
        exclude = ["task_id"]
