export enum Chain {
  ETH = "eth"
}

export enum Network {
  MAINNET = "mainnet",
  SEPOLIA = "sepolia",
  GOERLI = "goerli"
}

export default interface Contract {
  id: number;
  name: string;
  address: string;
  chain: Chain;
  network: Network;
}
