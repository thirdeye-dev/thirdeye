export const FLOW_ENV = process.env.NEXT_PUBLIC_FLOW_ENV || 'testnet';

const NETWORKS = {
  emulator: {
    flowNetwork: 'local',
    accessApi: process.env.NEXT_PUBLIC_EMULATOR_API || 'http://localhost:8888',
    walletDiscovery: 'https://fcl-discovery.onflow.org/local/authn',
    walletDiscoveryApi: 'https://fcl-discovery.onflow.org/api/local/authn',
    walletDiscoveryInclude: [],
    addresses: {},
  },
  testnet: {
    flowNetwork: 'testnet',
    accessApi: 'https://rest-testnet.onflow.org',
    walletDiscovery: 'https://fcl-discovery.onflow.org/testnet/authn',
    walletDiscoveryApi: 'https://fcl-discovery.onflow.org/api/testnet/authn',
    walletDiscoveryInclude: [
      '0x82ec283f88a62e65', // Dapper Wallet
    ],
    addresses: {},
  },
  mainnet: {
    flowNetwork: 'mainnet',
    accessApi: 'https://rest-mainnet.onflow.org',
    walletDiscovery: 'https://fcl-discovery.onflow.org/authn',
    walletDiscoveryApi: 'https://fcl-discovery.onflow.org/api/authn',
    walletDiscoveryInclude: [
      '0xead892083b3e2c6c', // Dapper Wallet
    ],
    addresses: {},
  },
} as const;

type NetworksKey = keyof typeof NETWORKS;

export const NETWORK = NETWORKS[FLOW_ENV as NetworksKey];

export const getFlowNetwork = (flowEnv = 'testnet') =>
  NETWORKS[flowEnv as NetworksKey];
