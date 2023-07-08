import re

from rest_framework import serializers

from authentication.organizations.models import Organization

from .models import SmartContract


class InputSerializer(serializers.Serializer):
    internalType = serializers.CharField()
    name = serializers.CharField()
    type = serializers.CharField()


class CompilerSerializer(serializers.Serializer):
    version = serializers.CharField()


class InputSerializer(serializers.Serializer):
    internalType = serializers.CharField()
    name = serializers.CharField()
    type = serializers.CharField()


class OutputSerializer(serializers.Serializer):
    internalType = serializers.CharField()
    name = serializers.CharField(allow_blank=True)
    type = serializers.CharField()


class ABIJSONSerializer(serializers.Serializer):
    inputs = InputSerializer(many=True)
    name = serializers.CharField()
    outputs = OutputSerializer(many=True)
    stateMutability = serializers.CharField()
    type = serializers.CharField()


class MethodSerializer(serializers.Serializer):
    inputs = InputSerializer(many=True)
    name = serializers.CharField()
    outputs = OutputSerializer(many=True)
    stateMutability = serializers.CharField()
    type = serializers.CharField()


class ABIObjectSerializer(serializers.Serializer):
    compiler = serializers.DictField()
    language = serializers.CharField()
    output = serializers.DictField(child=MethodSerializer())
    devdoc = serializers.DictField()
    userdoc = serializers.DictField()


class ABISerializer(serializers.Serializer):
    version = serializers.IntegerField()
    abi = serializers.ListField(child=ABIObjectSerializer())
    settings = serializers.DictField()
    sources = serializers.DictField()


class SmartContractSerializer(serializers.ModelSerializer):
    def smart_contract_validator(value):
        pattern = re.compile(r"^0x[a-fA-F0-9]{40}$")
        if not pattern.match(value):
            raise serializers.ValidationError("Invalid smart contract address")

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
        fields = ("id", "name", "address", "chain", "network", "owner_organization")
        read_only_fields = ("id",)

    def validate(self, data):
        if data["chain"] == "ETH":
            if data["network"] not in ["MAINNET", "SEPOLIA", "GOERLI"]:
                raise serializers.ValidationError("Invalid network for ETH chain")
        return data
