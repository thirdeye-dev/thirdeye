import re

from rest_framework import serializers

from authentication.organizations.models import Organization

from .models import SmartContract


def smart_contract_validator(value):
    pattern = re.compile(r"^0x[a-fA-F0-9]{40}$")
    if not pattern.match(value):
        raise serializers.ValidationError("Invalid smart contract address")


class SmartContractSerializer(serializers.ModelSerializer):
    address = serializers.CharField(validators=[smart_contract_validator])
    chain = serializers.CharField(required=True)
    network = serializers.CharField(required=True)
    owner_organization = serializers.PrimaryKeyRelatedField(
        queryset=Organization.objects.all(),
        required=True,
        write_only=True,
        source="owner_organization.id",
    )

    class Meta:
        model = SmartContract
        fields = "__all__"
        read_only_fields = ("id",)

    def validate(self, data):
        if data["chain"] == "ETH":
            if data["network"] not in ["MAINNET", "SEPOLIA", "GOERLI"]:
                raise serializers.ValidationError("Invalid network for ETH chain")
        return data
