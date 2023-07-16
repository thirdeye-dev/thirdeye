import {
  Text,
  Flex,
  Stack,
  Divider,
  Paper,
  Group,
  Button,
  Badge,
} from "@mantine/core";
import { AiFillCheckCircle, AiFillLock, AiFillUnlock } from "react-icons/ai";
import * as fcl from "@onflow/fcl";

import CopyToClipboard from "@/components/CopyToClipboard";
import Contract, { Chain } from "@/models/contract";
import { gradientByChain } from "@/utils";
import { IWeb3Context } from "@/context/Web3";
import { useCallback, useEffect, useState } from "react";
import { notifications } from "@mantine/notifications";

const flowContractAddressRegexWithGroup = new RegExp(
  "^[A-Z].([0-9a-fA-F]{16})..*$"
);

function LockContractButton({
  web3,
  contract,
  done,
}: {
  web3: IWeb3Context;
  contract: Contract;
  done: () => void;
}) {
  const [locking, setLocking] = useState(false);

  const success = () => {
    setLocking(false);

    // To prevent infinite loop
    web3.transaction.errorMessage = "";

    notifications.show({
      title: "Success",
      message: "Contract locked successfully",
      color: "green",
      icon: <AiFillCheckCircle />,
    });

    done();
  };

  useEffect(() => {
    console.log(web3.transaction);

    if (web3.transaction.errorMessage && !web3.transaction.inProgress) {
      success();
    }
  }, [web3.transaction]);

  const lock = () => {
    const address =
      flowContractAddressRegexWithGroup.exec(contract.address)?.at(1) ??
      contract.address;

    web3.executeTransaction(
      `
        import ${contract.name} from 0x${address}
        
        transaction Lock {
          prepare(signer) {
            log(signer.address)
          }
          
          execute {
            ${contract.name}.lock()
          }
        }
      `
    );

    setLocking(true);
  };

  return (
    <Button
      loading={locking}
      variant="light"
      color="red"
      rightIcon={<AiFillLock />}
      onClick={lock}
    >
      Lock
    </Button>
  );
}

function UnlockContractButton({
  web3,
  contract,
  done,
}: {
  web3: IWeb3Context;
  contract: Contract;
  done: () => void;
}) {
  const [unlocking, setUnlocking] = useState(false);

  const success = () => {
    setUnlocking(false);

    // To prevent infinite loop
    web3.transaction.errorMessage = "";

    notifications.show({
      title: "Success",
      message: "Contract unlocked successfully",
      color: "green",
      icon: <AiFillCheckCircle />,
    });

    done();
  };

  useEffect(() => {
    console.log(web3.transaction);

    if (web3.transaction.errorMessage && !web3.transaction.inProgress) {
      success();
    }
  }, [web3.transaction]);

  const unlock = () => {
    const address =
      flowContractAddressRegexWithGroup.exec(contract.address)?.at(1) ??
      contract.address;

    web3.executeTransaction(
      `
        import ${contract.name} from 0x${address}
        
        transaction Unlock {
          prepare(signer) {
            log(signer.address)
          }
          
          execute {
            ${contract.name}.unlock()
          }
        }
      `
    );

    setUnlocking(true);
  };

  return (
    <Button
      variant="light"
      color="green"
      rightIcon={<AiFillUnlock />}
      onClick={unlock}
    >
      Unlock
    </Button>
  );
}

const ContractLockUnlock = ({
  web3,
  contract,
}: {
  web3: IWeb3Context;
  contract: Contract;
}) => {
  const [isContractLocked, setIsContractLocked] = useState(false);

  if (isContractLocked) {
    return (
      <UnlockContractButton
        web3={web3}
        contract={contract}
        done={() => setIsContractLocked(false)}
      />
    );
  }

  return (
    <LockContractButton
      web3={web3}
      contract={contract}
      done={() => setIsContractLocked(true)}
    />
  );
};

export default function ContractInfo({
  web3,
  contract,
  numAlerts, // FIXME: give this a place :p
}: {
  web3: IWeb3Context;
  contract: Contract | undefined;
  numAlerts: number;
}) {
  if (!contract) return null;

  // NOTE: only chain Flow is supported for lock / unlock
  const shouldShowLockUnlock = contract.chain == Chain.FLOW;

  return (
    <Paper
      h="100%"
      p="lg"
      sx={(theme) => ({
        backgroundColor:
          theme.colorScheme === "dark"
            ? theme.colors.dark[5]
            : theme.colors.gray[0],
        borderRadius: theme.radius.md,
      })}
    >
      <Stack>
        <Flex direction="row" justify="space-between">
          <Group>
            <Text size="2.5em" weight="bold" color="yellow">
              {contract.name}
            </Text>

            <Badge
              variant="gradient"
              gradient={gradientByChain(contract.chain)}
            >
              {contract.chain}
            </Badge>
            <Badge variant="dot">{contract.network}</Badge>
          </Group>

          {shouldShowLockUnlock ? (
            <ContractLockUnlock web3={web3} contract={contract} />
          ) : null}
        </Flex>

        <Divider />

        <CopyToClipboard textToCopy={contract.address} />
      </Stack>
    </Paper>
  );
}
