import { Flex, Paper, Space, Stack, Stepper, Text } from "@mantine/core";
import { useState } from "react";

import WalletConnector from "@/components/WalletConnector";
import { useWeb3Context } from "@/hooks/use-web3";
import { IWeb3Context } from "@/context/Web3";

function ConnectWalletStep({ web3, done }: { web3: IWeb3Context, done: () => void; }) {
  return (
    <Stack>
      <Text weight="lighter">
        {!web3.user.loggedIn
          ? "Connect your FCL supported Flow Wallet by clicking the button below:"
          : "Seems you're already connected!"}
      </Text>

      <WalletConnector onSuccess={done} web3={web3} />
    </Stack>
  );
}

function MintNFTStep() {
  return <>Mint an NFT now</>;
}

function FullAccessStep() {
  return <></>;
}

export default function WalletLink() {
  const web3 = useWeb3Context();

  const [activeStep, setActiveStep] = useState(0);

  const incStep = () => setActiveStep((active) => active + 1);

  const steps = [
    {
      label: "Step 1",
      description: "Connect your Flow wallet",
      children: <ConnectWalletStep web3={web3} done={() => incStep()} />,
    },
    {
      label: "Step 2",
      description: "Mint a verification NFT",
      children: <MintNFTStep />,
    },
    {
      label: "Step 3",
      description: "Get full access",
      children: <FullAccessStep />,
    },
  ];

  return (
    <Stack>
      <Text>
        To proceed further, it is necessary to connect your wallet with ThirdEye
        and verify ownership over the contracts you own.
      </Text>

      <Space />

      <Flex direction="row">
        <Stepper
          w="100%"
          active={activeStep}
          onStepClick={setActiveStep}
          orientation="vertical"
          allowNextStepsSelect={false}
        >
          {steps.map((step) => (
            <Stepper.Step label={step.label} description={step.description} />
          ))}
        </Stepper>

        <Paper w="100%" p="md" withBorder>
          {steps[activeStep].children}
        </Paper>
      </Flex>
    </Stack>
  );
}
