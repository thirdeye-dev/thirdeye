from django.contrib.auth import get_user_model
from django.db import models

from api_app.core.models import BaseMixin
from authentication.organizations.models import Organization

User = get_user_model()


# chain choices enum: "ETH", "BSC", "POLYGON"
class Chain(models.TextChoices):
    ETH = "ETH", "eth"


class Network(models.TextChoices):
    # eth network choices
    MAINNET = "MAINNET", "mainnet"
    SEPOLIA = "SEPOLIA", "sepolia"
    GOERLI = "GOERLI", "goerli"


class SmartContract(BaseMixin):
    address = models.CharField(max_length=42, unique=True)
    name = models.CharField(max_length=100)
    chain = models.CharField(max_length=16, choices=Chain.choices)
    network = models.CharField(
        max_length=100, choices=Network.choices, default=Network.MAINNET
    )

    # supposed to be a json field
    abi = models.JSONField(null=True, default=None)

    active = models.BooleanField(default=True)

    # support for organisational scoping coming soon
    owner_organization = models.ForeignKey(Organization, on_delete=models.CASCADE)

    def __str__(self):
        return self.name
