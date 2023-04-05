import json

import requests
import websocket
from celery.utils.log import get_task_logger
from django.conf import settings
from web3 import Web3
from web3.middleware import geth_poa_middleware

from api_app.monitoring.models import MonitoringTasks
from backend.celery import app

logger = get_task_logger(__name__)

CHAINS_AND_NETWORKS = settings.CHAINS_AND_NETWORKS

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

    # contract_address = w3.toChecksumAddress(contract_address)

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

    def handle_event(data):
        requests.post(
            "https://eot0jnzvvvbvr8j.m.pipedream.net",
            json=data
        )

    while True:
        try:
            # collect data
            message = ws.recv()
            response = json.loads(message)
            if 'result' in response and response.get('id') == 1:
                subscription_id = response['result']
            elif subscription_id and 'params' in response and response['params']['subscription'] == subscription_id:
                transaction_hash = response['params']['result']['transactionHash']
                handle_event(response)

        except websocket.WebSocketConnectionClosedException:
            handle_event(data={"error": "WebSocket connection closed unexpectedly"})
            break
        except Exception as e:
            handle_event(data={"error": f"WebSocket connection closed unexpectedly {e}"})
            break

    ws.close()
