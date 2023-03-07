import re

from rest_framework import serializers
from .models import SmartContract


def smart_contract_validator(value):
    pattern = re.compile(r"^0x[a-fA-F0-9]{40}$")
    if not pattern.match(value):
        raise serializers.ValidationError("Invalid smart contract address")


class SmartContractSerializer(serializers.ModelSerializer):
    address = serializers.CharField(validators=[smart_contract_validator])
    chain = serializers.CharField(required=True)
    network = serializers.CharField(required=True)

    class Meta:
        model = SmartContract
        fields = "__all__"
        read_only_fields = ("id", "owner")

    def create(self, validated_data):
        validated_data["owner"] = self.context["request"].user
        return super().create(validated_data)
    

    def validate(self, data):
        if data["chain"] == "ETH":
            if data["network"] not in ["MAINNET", "SEPOLIA", "GOERLI"]:
                raise serializers.ValidationError(
                    "Invalid network for ETH chain"
                )
        return data
