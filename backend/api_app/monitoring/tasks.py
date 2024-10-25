import json
import os
import time
from datetime import datetime

import requests
import websocket
from celery.utils.log import get_task_logger
from django.conf import settings
from web3 import Web3
# from web3.middleware import geth_poa_middleware
# from web3.middleware.geth import geth_poa_middleware
from web3.middleware import geth_poa_middleware

from api_app.monitoring.models import (
    Alerts,
    MonitoringTasks,
    Notification,
    SmartContract,
)
from backend.celery import app

from .serializers import BlockchainAlertRunner

logger = get_task_logger(__name__)

CHAINS_AND_NETWORKS = settings.CHAINS_AND_NETWORKS


@app.task(bind=True)
def call_smart_contract_function(self, monitoring_task_id):
    # proper logging is required here.
    public_key, private_key = os.environ.get("ETH_PUBLIC_KEY", None), os.environ.get(
        "ETH_PRIVATE_KEY", None
    )

    if not public_key or not private_key:
        error_msg = "Missing ETH_PUBLIC_KEY or ETH_PRIVATE_KEY environment variable"
        logger.error(error_msg)
        raise Exception(error_msg)

    # continue from here


@app.task(bind=True, max_retries=3)
def send_webhook(self, notification_id):
    logger.info(f"Sending webhook for notification {notification_id}")

    notification = Notification.objects.filter(id=notification_id).first()

    if (not notification) and (notification.alert.active is False):
        error_msg = f"Active notification with id {notification_id} not found"
        logger.info(error_msg)
        raise Exception(error_msg)

    # just in case, we don't
    # want to send the same notification twice
    if notification.alert and notification.alert.active != True:
        logger.info(
            f"Alert {notification.alert.id} is not active for notification {notification.id}"
        )
        return

    elif not notification.alert:
        logger.info(
            f"Alert {notification.alert.id} is not active. Seems like it got deleted"
        )
        return

    if notification.status == Notification.Status.SENT:
        return

    webhook_url = notification.notification_target
    webhook_body = notification.notification_body

    headers = {"Content-Length": str(len(webhook_body))}

    logger.info(f"Sending webhook to -- {webhook_url}")

    try:
        response = requests.post(webhook_url, json=webhook_body, headers=headers)
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
    logger.info(f"Webhook notification saved: {notification_id}")


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

    if not monitoring_task:
        error_msg = f"Monitoring task with id {monitoring_task_id} not found"
        logger.error(error_msg)

        return

    contract_address = monitoring_task.SmartContract.address
    network = monitoring_task.SmartContract.network.lower()
    chain = monitoring_task.SmartContract.chain.lower()

    # if chain == "sol":
    #     logger.info(f"[DEBUG] Chain is sol. Skipping")
    #     return

    rpc_url = CHAINS_AND_NETWORKS.get(chain, {}).get(network, None)
    if not rpc_url:
        error_msg = f"Chain {chain} or network {network} not supported"
        logger.error(error_msg)
        raise Exception(error_msg)

    # network_id = settings.ETH_NETWORK_IDS.get(network)
    # if not network_id:
    #     error_msg = f"Network {network} not supported"
    #     logger.error(error_msg)
    #     raise Exception(error_msg)

    logger.info(f"[DEBUG] the chain URL is: {rpc_url}")

    w3 = Web3(Web3.WebsocketProvider(rpc_url))
    w3.middleware_stack.inject(geth_poa_middleware, layer=0)

    # if network_id != int(w3.net.version):
    #     raise ValueError("Connected to the wrong Ethereum network")

    ws = websocket.create_connection(rpc_url)

    if chain == "eth":
        subscribe_data = {
            "id": 1,
            "jsonrpc": "2.0",
            "method": "eth_subscribe",
            "params": [
                "alchemy_pendingTransactions",
                {"address": contract_address, "fromBlock": "latest"},
            ],
        }
    elif chain == "arb":
        subscribe_data = {
            "id": 1,
            "jsonrpc": "2.0",
            "method": "eth_subscribe",
            "params": [
                "alchemy_minedTransactions",
                {"address": contract_address, "fromBlock": "latest"},
            ],
        }

    elif chain == "sol":
        subscribe_data = {
            "jsonrpc": "2.0",
            "id": "3106",
            "method": "blockSubscribe",
            "params": [
                {"mentionsAccountOrProgram": contract_address},
                {
                    "commitment": "finalized",
                    "encoding": "jsonParsed",
                    # "showRewards": True,
                    "transactionDetails": "full",
                },
            ],
        }

    ws.send(json.dumps(subscribe_data))

    def fetch_transaction_details(transaction_hash):
        logger.info(f"[DEBUG] Fetching transaction details for {transaction_hash}")

        request_data = {
            "id": 2,
            "jsonrpc": "2.0",
            "method": "eth_getTransactionByHash",
            "params": [transaction_hash],
        }
        ws.send(json.dumps(request_data))

        logger.info(
            f"[DEBUG] Sent request to get transaction details for {transaction_hash}"
        )
        response = json.loads(ws.recv())

        # arb is retiring
        if chain == "arb":
            logger.info(f"[DEBUG] Received response: {response}")
            response = response.get("params").get("result").get("transaction")

        # logger.info(f"[DEBUG] Received response while fetching txn details: {response}")
        response["transaction_hash"] = transaction_hash

        transaction_data = response.get("params")
        if not transaction_data:
            transaction_data = response.get("result")
        else:
            # one of those weird edge cases
            transaction_data = transaction_data.get("result")

        # converting most things into integers
        transaction_data["timestamp"] = datetime.now().timestamp()
        transaction_data["value"] = int(transaction_data["value"], 16)
        transaction_data["gasPrice"] = int(transaction_data["gasPrice"], 16)
        transaction_data["gas"] = int(transaction_data["gas"], 16)
        transaction_data["chainId"] = int(transaction_data["chainId"], 16)
        transaction_data["nonce"] = int(transaction_data["nonce"], 16)

        # logger.info(f"[DEBUG] Overwrote transaction data: {transaction_data}")

        return transaction_data

    def decode_input(transaction_data):
        abi = monitoring_task.SmartContract.abi
        if not abi:
            error_msg = f"ABI not found for contract {contract_address}"
            logger.error(error_msg)
            return "", transaction_data.get("input")
        contract = w3.eth.contract(address=contract_address, abi=abi)

        # decode the input
        try:
            fn_name, decoded_input = contract.decode_function_input(
                transaction_data["input"]
            )
            fn_name = fn_name.fn_name
        except Exception as e:
            logger.error(f"Error decoding input: {e}")
            decoded_input = transaction_data["input"]
            fn_name = ""

        return fn_name, decoded_input

    def trace_transaction(transaction_hash):
        request_data = {
            "id": 2,
            "jsonrpc": "2.0",
            "method": "debug_traceTransaction",  # probably disable by provider
            "params": [transaction_hash],
        }
        ws.send(json.dumps(request_data))
        response = json.loads(ws.recv())

        data = response["result"]

        input_ = data["input"]
        output = data.get("result").get("output")

        abi = monitoring_task.SmartContract.abi
        str_abi = json.dumps(abi)
        contract = w3.eth.contract(address=contract_address, abi=str_abi)

        # decode the input
        decoded_input = contract.decode_function_input(input_)

        # decode the output
        decoded_output = contract.decode_function_result(decoded_input["name"], output)

        return decoded_input, decoded_output

    while True:
        try:
            # collect data
            message = ws.recv()
            response = json.loads(message)

            # logger.info(response)
            logger.info(f"[DEBUG] response for chain {chain} found")
            # logger.info(f"[DEBUG] response: {response}")

            # if (
            #     subscription_id
            #     and "params" in response
            #     and response["params"]["subscription"] == subscription_id
            # ) or (
            #     chain == "arb" or chain == "sol"
            # ):  # this is for the arb chain
            #     # transaction_hash = response.get("hash")

            logger.info(response)

            if "eth" == chain:
                transaction_hash = response["params"]["result"]["hash"]
                transaction = fetch_transaction_details(transaction_hash)

                logger.info(f"[DEBUG] Got overwritten transaction: {transaction_hash}")

            # "arb" is retired for now
            elif "arb" == chain:
                transaction_hash = response.get("result")
                if transaction_hash is None:
                    logger.info(
                        f"[DEBUG] Transaction hash is none. Trying to see if it's in the params"
                    )
                    transaction = (
                        response.get("params").get("result").get("transaction")
                    )
                else:
                    transaction = fetch_transaction_details(transaction_hash)

            elif "sol" == chain:
                sol_block = response.get("params").get("result").get("value")

                # not exactly transaction, but instead a block here. who cares about code?
                # we haven't shipped shit yet. I started out wanting to write a business
                # from scratch. but this all bullshit. all of it is.
                transaction = sol_block.get("block")
                transaction["slot"] = sol_block.get("slot")

            if transaction is None and chain != "sol":
                # logger.info(f"[DEBUG] Transaction is none. Response is {response}")
                pass

            # fetch alerts from the database
            # run the alerts
            # decoded_input, decoded_output = trace_transaction(transaction_hash)

            if chain != "sol":
                # to be added later in sol
                fn_name, decoded_input = decode_input(transaction)
                transaction["input"] = decoded_input
                transaction["output"] = ""
                transaction["fn_name"] = fn_name

            alerts = Alerts.objects.filter(
                active=True, smart_contract=monitoring_task.SmartContract
            )

            # check if smart contract still exists
            smart_contract_search = SmartContract.objects.filter(
                address=contract_address
            ).first()

            if not smart_contract_search:
                logger.info(f"[DEBUG] Smart contract {contract_address} not found")
                break

            if len(alerts) == 0:
                # logger.log(f"[DEBUG] No alerts found for contract {contract_address}")
                time.sleep(2)
                continue

            for alert in alerts:
                notifications = Notification.objects.filter(
                    alert__smart_contract__owner_organization=monitoring_task.SmartContract.owner_organization,
                ).count()

                if (
                    notifications
                    >= monitoring_task.SmartContract.owner_organization.notification_limit
                ):
                    logger.info(
                        f"[DEBUG] Notification limit reached for organization {monitoring_task.SmartContract.owner_organization}"
                    )
                    return  # we don't want to run more alerts

                logger.info(f"[DEBUG] Running alert {alert.id}")
                alert_runner = BlockchainAlertRunner(alert, transaction)
                alert_runner.run()

        except websocket.WebSocketConnectionClosedException as e:
            data = {
                "timestamp": datetime.now().timestamp(),
                "message": "Websocket connection closed",
                "error": str(e),
            }
            break
        except Exception as e:
            data = {
                "timestamp": datetime.now().timestamp(),
                "error": str(e),
                "response": response,
                "message": message,
                "rpc_url": rpc_url,
            }

            # this exception is an edge case that i need to handle
            logger.error(data)

    ws.close()
