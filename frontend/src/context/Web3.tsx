import {
  createContext,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import { getFlowNetwork } from "@/flow-config";
import * as fcl from "@onflow/fcl";

export interface IWeb3Context {
  connect: () => void;
  logout: () => void;
  executeTransaction: (cadence: string, args?: any, options?: any) => void;
  executeScript: (cadence: string, args?: any) => any;
  user: {
    loggedIn: boolean | null;
    addr: string;
  };
  transaction: {
    id: string | null;
    inProgress: boolean;
    status: number | null;
    errorMessage: string;
  };
}

export const Web3Context = createContext<IWeb3Context>({} as IWeb3Context);

export const Web3ContextProvider = ({
  children,
}: {
  children: ReactNode;
  network?: string;
}) => {
  const [user, setUser] = useState({ loggedIn: null, addr: "" });
  const [transactionInProgress, setTransactionInProgress] = useState(false);
  const [transactionStatus, setTransactionStatus] = useState<number | null>(
    null
  );
  const [transactionError, setTransactionError] = useState("");
  const [txId, setTxId] = useState<string | null>(null);

  useEffect(() => {
    const {
      flowNetwork,
      accessApi,
      walletDiscovery,
      walletDiscoveryApi,
      walletDiscoveryInclude,
      addresses,
    } = getFlowNetwork();
    const iconUrl = window.location.origin + "/img/logo.jpeg";
    const appTitle = process.env.NEXT_PUBLIC_APP_NAME || "ThirdEye";

    fcl.config({
      "app.detail.title": appTitle,
      "app.detail.icon": iconUrl,
      "accessNode.api": accessApi, // connect to Flow
      "flow.network": flowNetwork,
      "discovery.wallet": walletDiscovery, // use wallets on public discovery
      "discovery.authn.endpoint": walletDiscoveryApi, // public discovery api endpoint
      "discovery.authn.include": walletDiscoveryInclude, // opt-in wallets

      // @ts-ignore
      "0xFungibleToken": addresses.FungibleToken,
      // @ts-ignore
      "0xFlowToken": addresses.FlowToken,
      // @ts-ignore
      "0xNonFungibleToken": addresses.NonFungibleToken,
      // @ts-ignore
      "0xMetadataViews": addresses.MetadataViews,
      // @ts-ignore
      "0xThirdEyeVerification": addresses.ThirdEyeVerification,
    });
  }, []);

  useEffect(() => {
    fcl.currentUser.subscribe(setUser);
  }, []);

  const connect = useCallback(() => {
    fcl.authenticate();
  }, []);

  const logout = useCallback(async () => {
    fcl.unauthenticate();
  }, []);

  const executeTransaction = useCallback(
    async (cadence: string, args: fcl.ArgFn, options: any = {}) => {
      setTransactionInProgress(true);
      setTransactionStatus(-1);

      const transactionId = await fcl
        .mutate({
          cadence,
          args,
          limit: options.limit || 50,
        })
        .catch((e: Error) => {
          setTransactionInProgress(false);
          setTransactionStatus(500);
          setTransactionError(String(e));
        });

      if (transactionId) {
        setTxId(transactionId);
        fcl.tx(transactionId).subscribe((res: any) => {
          setTransactionStatus(res.status);
          setTransactionInProgress(false);
        });
      }
    },
    []
  );

  const executeScript = useCallback(
    async (cadence: string, args: any = () => []) => {
      try {
        return await fcl.query({
          cadence: cadence,
          args,
        });
      } catch (error) {
        console.error(error);
      }
    },
    []
  );

  const providerProps = useMemo(
    () => ({
      connect,
      logout,
      user,
      executeTransaction,
      executeScript,
      transaction: {
        id: txId,
        inProgress: transactionInProgress,
        status: transactionStatus,
        errorMessage: transactionError,
      },
    }),
    [
      connect,
      logout,
      txId,
      transactionInProgress,
      transactionStatus,
      transactionError,
      executeTransaction,
      executeScript,
      user,
    ]
  );

  return (
    <Web3Context.Provider
      value={{
        ...providerProps,
      }}
    >
      {children}
    </Web3Context.Provider>
  );
};
