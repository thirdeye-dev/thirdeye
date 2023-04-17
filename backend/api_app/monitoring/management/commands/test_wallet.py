import os

from django.conf import settings
from django.core.management.base import BaseCommand
from eth_account import Account
from web3 import Web3


class Command(BaseCommand):
    help = "Tests Ethereum wallet functionality"

    def add_arguments(self, parser):
        parser.add_argument(
            "--send", action="store_true", help="Send Ether to another address"
        )

    def handle(self, *args, **options):
        # Load private key and public address from environment variables
        private_key = os.environ.get("ETH_PRIVATE_KEY", None)
        public_address = os.environ.get("ETH_PUBLIC_ADDRESS", None)

        if not private_key or not public_address:
            self.stdout.write(
                self.style.ERROR(
                    "Missing ETH_PRIVATE_KEY or ETH_PUBLIC_ADDRESS environment variable"
                )
            )
            return

        account = Account.from_key(private_key)

        INFURA_HTTP_ENDPOINT = settings.INFURA_HTTP_ENDPOINT

        # Connect to Ethereum provider
        eth_provider_url = INFURA_HTTP_ENDPOINT
        w3 = Web3(Web3.HTTPProvider(eth_provider_url))

        if options["send"]:
            self.send_ether(account, w3)
        else:
            self.get_balance(public_address, w3)

    def get_balance(self, address, w3):
        balance = w3.eth.get_balance(address)
        ether_balance = w3.from_wei(balance, "ether")
        self.stdout.write(self.style.SUCCESS(f"Balance: {ether_balance} Ether"))

    def send_ether(self, account, w3):
        # Replace the 'to_address' with the recipient's Ethereum address
        to_address = settings.DEBUGGING_WALLET
        value = w3.to_wei(0.001, "ether")
        gas = 21000
        gas_price = w3.eth.gas_price

        # Build the transaction
        transaction = {
            "to": to_address,
            "value": value,
            "gas": gas,
            "gasPrice": gas_price,
            "nonce": w3.eth.get_transaction_count(account.address),
        }

        # Sign and send the transaction
        signed_transaction = account.sign_transaction(transaction)
        transaction_hash = w3.eth.send_raw_transaction(
            signed_transaction.rawTransaction
        )
        self.stdout.write(
            self.style.SUCCESS(f"Transaction sent: {transaction_hash.hex()}")
        )
