import json
import redis
import secrets
import requests
import websocket

from django.contrib.auth.models import User

from requests.exceptions import RequestException


from django.conf import settings
from celery.utils.log import get_task_logger

from backend.celery import app
from api_app.monitoring.models import IOCAlert, IoC

logger = get_task_logger(__name__)

CHAINS_AND_NETWORKS = settings.CHAINS_AND_NETWORKS


@app.task(bind=True)
def send_sms(self, to_phone, result):
    pass


@app.task(bind=True)
def send_email(self, to_email, result):
    pass


@app.task(bind=True, max_retries=3)
def send_webhook(self, url, msg, ioc_id):
    rds = redis.Redis(host="localhost", port=6379, db=0)

    ioc = IoC.objects.get(id=ioc_id)
    try:
        r = requests.post(
            url, data={"message": msg, "request_token": secrets.token_urlsafe(16)}
        )
        r.raise_for_status()
        alert_attempt = IOCAlert.objects.create(
            url=url,
            message=msg,
            status="SUCCESS",
            response=r.text,
            response_code=r.status_code,
            ioc=ioc,
        )

    except RequestException as exc:
        self.retry(exc=exc, countdown=60)
        alert_attempt = IOCAlert.objects.create(
            url=url, message=msg, status="FAILURE", response=exc, ioc=ioc
        )

    alert_attempt.save()

    # add to redis set with exp[iration of 1 hour
    # to prevent duplicate alerts
    key = f"{ioc.contract_address}:{ioc.user.id}"
    rds.sadd(key, msg)
    rds.expire(key, 3600)

    return r.json()


def check_threshold(response, threshold, contract_address, user_id):
    tx = response["params"]["result"]
    if "gasPrice" in tx:
        gas_price_wei = int(tx["gasPrice"], 16)
        gas_price_gwei = gas_price_wei // 10**9
        if gas_price_gwei > threshold:
            warning = (
                f"Gas price crossed the threshold of {threshold} "
                f"Gwei for contract {contract_address}."
                f" Current gas price: {gas_price_gwei} Gwei"
            )

            logger.warning(warning)
            # check if user has any alerts set up
            # if so, send alert
            # if not, do nothing
            iocs = IoC.objects.filter(
                smart_contract__address=contract_address, user__id=user_id
            )

            for ioc in iocs:
                if ioc.alert_types == "WEBHOOK":
                    send_webhook.delay(ioc.alert_url, warning)
                elif ioc.alert_types == "SMS":
                    send_sms.delay(ioc.alert_phone, warning)
                elif ioc.alert_types == "EMAIL":
                    user = User.objects.get(id=user_id)
                    send_email.delay(user.email, warning)


# main monitior task
@app.task(bind=True)
def monitor_contract(self, contract_address, user_id, network="mainnet", chain="eth"):
    # chains and networks supported
    # eth: mainnet, sepolia, goerli

    chain_url = CHAINS_AND_NETWORKS.get(chain, {}).get(network, None)
    if not chain_url:
        error_msg = f"Chain {chain} or network {network} not supported"
        logger.error(error_msg)
        raise Exception(error_msg)

    ws = websocket.create_connection(
        f"{chain_url}"
    )

    r = redis.Redis(host="localhost", port=6379, db=0)
    # Subscribe to new transactions for a specific smart contract
    subscribe_data = {
        "id": 1,
        "jsonrpc": "2.0",
        "method": "eth_subscribe",
        "params": [
            {"address": contract_address, "topics": ["0x"], "fromBlock": "latest"},
            "pendingTransactions",
        ],
    }
    ws.send(json.dumps(subscribe_data))

    while True:
        try:
            # collect data
            message = ws.recv()
            response = json.loads(message)
            print(response)
            if "params" in response and "result" in response["params"]:
                # result = response["params"]["result"]

                # check active IoCs on that smart contract
                # by that user; Later might implement caching.
                iocs = IoC.objects.filter(
                    SmartContract__address=contract_address,
                    SmartContract__owner_id=user_id,
                )

                key = f"{contract_address}:{user_id}"
                if r.get(key):
                    logger.info(f"Duplicate alert for {key}")
                    continue

                for ioc in iocs:
                    if ioc.ioc_type == "GAS_THRESHOLD":
                        check_threshold(
                            response, ioc.threshold, contract_address, user_id
                        )

        except websocket.WebSocketConnectionClosedException:
            logger.error("WebSocket connection closed unexpectedly")
            break
        except Exception as e:
            logger.error(f"Unexpected error: {e}")
            break

    ws.close()
