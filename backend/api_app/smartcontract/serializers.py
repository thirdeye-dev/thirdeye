import re

from rest_framework import serializers
from .models import SmartContract


def smart_contract_validator(value):
    pattern = re.compile(r"^0x[a-fA-F0-9]{40}$")
    if not pattern.match(value):
        raise serializers.ValidationError("Invalid smart contract address")


class SmartContractSerializer(serializers.ModelSerializer):
    address = serializers.CharField(validators=[smart_contract_validator])

    class Meta:
        model = SmartContract
        fields = "__all__"
        read_only_fields = ("id", "owner")

    def create(self, validated_data):
        validated_data["owner"] = self.context["request"].user
        return super().create(validated_data)
