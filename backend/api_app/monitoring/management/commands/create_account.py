from django.core.management.base import BaseCommand
from eth_account import Account


class Command(BaseCommand):
    help = "Creates a smart contract wallet and prints the keys"

    def handle(self, *args, **options):
        # Generate a new Ethereum account (private key and public address)
        account = Account.create()
        private_key = account.key.hex()
        public_address = account.address

        # Print the private key and public address
        self.stdout.write(self.style.SUCCESS(f"Private key: {private_key}"))
        self.stdout.write(self.style.SUCCESS(f"Public address: {public_address}"))
