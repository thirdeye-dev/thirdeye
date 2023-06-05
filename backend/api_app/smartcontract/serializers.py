import re

from rest_framework import serializers

from authentication.organizations.models import Organization

from .models import SmartContract


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


class FunctionSerializer(serializers.Serializer):
    inputs = InputSerializer(many=True)
    name = serializers.CharField()
    outputs = OutputSerializer(many=True)
    stateMutability = serializers.CharField()
    type = serializers.CharField()


class DevdocSerializer(serializers.Serializer):
    kind = serializers.CharField()
    methods = serializers.DictField()
    version = serializers.IntegerField()


class UserdocSerializer(serializers.Serializer):
    kind = serializers.CharField()
    methods = serializers.DictField()
    version = serializers.IntegerField()


class OutputSerializer(serializers.Serializer):
    abi = FunctionSerializer(many=True)
    devdoc = DevdocSerializer()
    userdoc = UserdocSerializer()


class MetadataSerializer(serializers.Serializer):
    bytecodeHash = serializers.CharField()


class OptimizerSerializer(serializers.Serializer):
    enabled = serializers.BooleanField()
    runs = serializers.IntegerField()


class SettingsSerializer(serializers.Serializer):
    compilationTarget = serializers.DictField()
    evmVersion = serializers.CharField()
    libraries = serializers.DictField()
    metadata = MetadataSerializer()
    optimizer = OptimizerSerializer()
    remappings = serializers.ListField()


class SourceSerializer(serializers.Serializer):
    keccak256 = serializers.CharField()
    urls = serializers.ListField(child=serializers.CharField())


class ABIJSONSerializer(serializers.Serializer):
    compiler = CompilerSerializer()
    language = serializers.CharField()
    output = OutputSerializer()
    settings = SettingsSerializer()
    sources = serializers.DictField(child=SourceSerializer())
    version = serializers.IntegerField()


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
        fields = ("id", "address", "chain", "network", "owner_organization")
        read_only_fields = ("id",)

    def validate(self, data):
        if data["chain"] == "ETH":
            if data["network"] not in ["MAINNET", "SEPOLIA", "GOERLI"]:
                raise serializers.ValidationError("Invalid network for ETH chain")
        return data
