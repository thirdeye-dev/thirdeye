import { Elysia, t } from "elysia";

import { createWalletClient, http, publicActions } from "viem";
import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts'
import { polygonMumbai } from 'viem/chains'

const abi = [
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "initMessage",
				"type": "string"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"constant": false,
		"inputs": [
			{
				"internalType": "string",
				"name": "newMessage",
				"type": "string"
			}
		],
		"name": "update",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "message",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	}
] as const;


const handleCreateAccount = () => {
  // Generate a private key
  const privateKey = generatePrivateKey();

  // Generate an account using the private key
  const account = privateKeyToAccount(privateKey);

  return {
    privateKey,
    publicKey: account.publicKey,
    walletAddress: account.address,
  }
}

const handleTransact = async ({ body }) => {
  // Initialize the account using the private key
  const account = privateKeyToAccount(body.privateKey);

  // Create a viem client
  const client = createWalletClient({
    account,
    chain: polygonMumbai,
    transport: http()
  }).extend(publicActions);

  const message = await client.readContract({
    account,
    address: body.contractAddress,
    functionName: "message",
    abi
  });

  console.log(`currently the message is: ${message}`)
  console.log("updating value...")
  
  // TODO: Flatten args by type
  const args = body.args.flatMap(arg => arg.value);

  // Prepare
  const { request } = await client.simulateContract({
    account,
    address: body.contractAddress,
    functionName: body.functionName,
    abi,
    args: args
  });

  // Send the write call
  const hash = await client.writeContract(request);

  // // Wait for the the transaction to finish
  const receipt = await client.waitForTransactionReceipt({ hash });
  
  console.log(receipt);

  return {
    txHash: receipt.transactionHash,
    status: receipt.status
  };
}

const app = new Elysia()
  .get("/create_account", handleCreateAccount)
  .post("/transact", handleTransact, {
    body: t.Object({
      network: t.String(),
      privateKey: t.String(),
      walletAddress: t.String(),
      contractAddress: t.String(),
      functionName: t.String(),
      args: t.Array(t.Object({
        type: t.String(),
        value: t.String()
      }))
    })
  })
  .listen(process.env.PORT || 8001);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
