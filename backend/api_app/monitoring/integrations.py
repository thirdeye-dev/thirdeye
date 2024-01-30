import os
import requests

# move this to a separate file later
def airstack_identities(self, wallet: str) -> dict:
    url = "https://api.airstack.xyz/gql"

    headers = {
        "authorization": os.environ.get("AIRSTACK_API_KEY"),
        "content-type": "application/json",
        "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",
    }

    query = f'{{"query":"query MyQuery {{ Wallet(input: {{identity: \\"{wallet}\\", blockchain: ethereum}}) {{ identity socials {{ dappName profileName }} }} }}","operationName":"MyQuery"}}'

    response = requests.post(url, headers=headers, data=query)

    if response.status_code == 200:
        data = response.json()
        wallet_data = data.get("data", {}).get("Wallet", {})

        identity = wallet_data.get("identity", "")
        socials = wallet_data.get("socials", [])

        result = {"identity": identity, "socials": socials}

        return result
    else:
        return {"error": f"Error: {response.status_code} - {response.text}"}
