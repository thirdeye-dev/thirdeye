import json
from datetime import datetime

import requests
import websocket
from celery.utils.log import get_task_logger
from django.conf import settings
from web3 import Web3
from web3.middleware import geth_poa_middleware

from api_app.monitoring.models import Alerts, MonitoringTasks, Notification
from backend.celery import app

from .serializers import BlockchainAlertRunner

logger = get_task_logger(__name__)

CHAINS_AND_NETWORKS = settings.CHAINS_AND_NETWORKS


@app.task(bind=True, max_retries=3)
def send_webhook(self, notification_id):
    notification = Notification.objects.filter(id=notification_id).first()

    if not notification:
        error_msg = f"Notification with id {notification_id} not found"
        logger.error(error_msg)
        raise Exception(error_msg)

    # just in case, we don't
    # want to send the same notification twice
    if notification.status == Notification.Status.SENT:
        return

    webhook_url = notification.notification_target
    webhook_body = notification.notification_body

    try:
        response = requests.post(webhook_url, data=webhook_body)
        notification.meta_logs = {
            "timestamp": datetime.now().isoformat(),
            "response": response.text,
            "response_code": response.status_code,
        }

    except Exception as e:
        notification.status = Notification.Status.FAILED
        notification.meta_logs = {
            "timestamp": datetime.now().isoformat(),
            "response": response.text,
            "response_code": response.status_code,
        }
        error_msg = f"Webhook failed with error {e}"
        logger.error(error_msg)
        raise Exception(error_msg)

    notification.save()


"""
The main monitior task!

Future plans:

Eventually, When we move to post PoC stage, i want us to move to a batch
processing model. This will help us reduce the number of requests we make
and also reduce the number of tasks we have to run.
"""


@app.task(bind=True, max_retries=3)
def monitor_contract(self, monitoring_task_id):
    monitoring_task = MonitoringTasks.objects.filter(id=monitoring_task_id).first()

    contract_address = monitoring_task.SmartContract.address
    network = monitoring_task.SmartContract.network.lower()
    chain = monitoring_task.SmartContract.chain.lower()

    rpc_url = CHAINS_AND_NETWORKS.get(chain, {}).get(network, None)
    if not rpc_url:
        error_msg = f"Chain {chain} or network {network} not supported"
        logger.error(error_msg)
        raise Exception(error_msg)

    # fix the chain. it should be number.
    network_id = int(chain) if chain.isdigit() else 1
    w3 = Web3(Web3.WebsocketProvider(rpc_url))
    w3.middleware_onion.inject(geth_poa_middleware, layer=0)

    if network_id != int(w3.net.version):
        raise ValueError("Connected to the wrong Ethereum network")

    ws = websocket.create_connection(rpc_url)

    # Subscribe to new transactions for a specific smart contract
    # look into the eth_subscribe method
    subscribe_data = {
        "id": 1,
        "jsonrpc": "2.0",
        "method": "eth_subscribe",
        "params": ["logs", {"address": contract_address, "fromBlock": "latest"}],
    }
    ws.send(json.dumps(subscribe_data))
    subscription_id = None

    def fetch_transaction_details(transaction_hash):
        request_data = {
            "id": 2,
            "jsonrpc": "2.0",
            "method": "eth_getTransactionByHash",
            "params": [transaction_hash],
        }
        ws.send(json.dumps(request_data))
        response = json.loads(ws.recv())
        transaction_data = response["result"]

        # converting most things into integers
        transaction_data["timestamp"] = datetime.now().timestamp()
        transaction_data["value"] = int(transaction_data["value"], 16)
        transaction_data["gasPrice"] = int(transaction_data["gasPrice"], 16)
        transaction_data["gas"] = int(transaction_data["gas"], 16)
        transaction_data["chainId"] = int(transaction_data["chainId"], 16)
        transaction_data["nonce"] = int(transaction_data["nonce"], 16)

        return transaction_data

    while True:
        try:
            # collect data
            message = ws.recv()
            response = json.loads(message)
            if "result" in response and response.get("id") == 1:
                subscription_id = response["result"]
            elif (
                subscription_id
                and "params" in response
                and response["params"]["subscription"] == subscription_id
            ):
                transaction_hash = response["params"]["result"]["transactionHash"]
                transaction = fetch_transaction_details(transaction_hash)
                # fetch alerts from the database
                # run the alerts
                alerts = Alerts.objects.filter(
                    smart_contract=monitoring_task.SmartContract
                )
                for alert in alerts:
                    # TODO: I want to check later in the YAML
                    # if the alert is checked every_transaction
                    # or every x amount of time.
                    alert_runner = BlockchainAlertRunner(alert.alert_yaml, transaction)
                    alert_runner.run()

        except websocket.WebSocketConnectionClosedException:
            break
        except Exception:
            break

    ws.close()
