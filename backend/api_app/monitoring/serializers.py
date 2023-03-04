import logging

from rest_framework import serializers as rfs

from api_app.monitoring.models import IoC
from api_app.core.serializers import IOCSerializer
from api_app.smartcontract.models import SmartContract

logger = logging.getLogger(__name__)


class SetIoCSerializer(rfs.ModelSerializer):
    ioc_name = rfs.CharField(required=True)
    ioc_params = rfs.JSONField(required=True)
    smart_contract_id = rfs.CharField(required=True)

    # make alert_types a choice field that only accepts the values in the alert_types
    alert_types = rfs.ListField(
        child=rfs.CharField(),
        required=False,
    )
    alert_url = rfs.CharField(required=False)

    class Meta:
        model = IoC
        fields = (
            "ioc_name",
            "ioc_params",
            "smart_contract_id",
            "alert_types",
            "alert_url",
        )

    def validate(self, attrs):
        type_map = {
            "int": int,
            "str": str,
            "float": float,
            # add more types as we go
        }
        smart_contract = SmartContract.objects.get(pk=attrs.get("smart_contract_id"))

        if not smart_contract.user == self.context["request"].user:
            raise rfs.ValidationError(
                "You do not have permission to set an alert for this contract."
            )

        attrs = super().validate(attrs)

        iocs = IOCSerializer.read_and_verify_config()
        ioc_name = attrs.get("ioc_name")
        ioc = iocs.get(ioc_name)

        if not ioc:
            raise rfs.ValidationError(f"IOC {ioc_name} not found.")

        ioc_params = attrs.get("ioc_params")
        for params in ioc_params:
            param = ioc_params.get(params)
            if not param:
                raise rfs.ValidationError(f"IOC {ioc_name} value not found.")

            if type(param) != type_map.get(ioc.get("params").get(param)):
                raise rfs.ValidationError(f"IOC {ioc_name} value type not found.")

        attrs["SmartContract"] = SmartContract.objects.get(
            pk=attrs.get("smart_contract_id")
        )
        attrs["threshold"] = ioc_params.get("threshold")
        attrs["threshold_currency"] = ioc_params.get("threshold_currency")
        attrs["alert_types"] = attrs.get("alert_types")
        attrs["alert_url"] = attrs.get("alert_url")

        return attrs
