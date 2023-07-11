export enum ObjectType {
  CONTRACT = "contract",
  ACCOUNT = "account",
}

export enum Chain {
  FLOW = "flow",
  ETH = "eth",
}

export enum Network {
  MAINNET = "mainnet",
  TESTNET = "testnet",
  SEPOLIA = "sepolia",
  GOERLI = "goerli",
}

export default interface Contract {
  id: number;
  object_type: ObjectType;
  name: string;
  address: string;
  chain: Chain;
  network: Network;
}
