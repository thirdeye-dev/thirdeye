import { IWeb3Context } from "@/context/Web3";
import { Button, Stack } from "@mantine/core";
import { useEffect, useState } from "react";

export default function WalletConnector({
  web3,
  onSuccess,
}: {
  web3: IWeb3Context;
  onSuccess: () => void;
}) {
  const user = web3.user;

  const [connecting, setConnecting] = useState(false);

  useEffect(() => {
    if (user.loggedIn) {
      setConnecting(false);
    }
  }, [user.loggedIn]);

  const start = () => {
    if (user.loggedIn) {
      onSuccess();
      return;
    }

    setConnecting(true);

    try {
      web3.connect();
    } catch {
      console.log("erorr ocurred");
    }
  };

  return (
    <Stack>
      <Button
        loading={connecting}
        variant="outline"
        color="teal"
        onClick={start}
      >
        {user.loggedIn ? `Continue as ${user.addr}` : "Connect Wallet"}
      </Button>
      {user.loggedIn ? (
        <Button variant="light" size="sm" onClick={() => web3.logout()}>
          Logout
        </Button>
      ) : null}
    </Stack>
  );
}
