import { Flex, Paper, Space, Stack, Stepper, Text } from "@mantine/core";
import { useState } from "react";

import WalletConnector from "@/components/WalletConnector";

function ConnectWalletStep() {
  return (
    <Stack>
      <Text weight="lighter">
        Connect your FCL supported Flow Wallet by clicking the button below:
      </Text>

      <WalletConnector />
    </Stack>
  );
}

function MintNFTStep() {
  return <></>
}

function FullAccessStep() {
  return <></>
}

export default function WalletLink() {
  const [activeStep, setActiveStep] = useState(1);

  const steps = [
    { label: "Step 1", description: "Connect your Flow wallet", children: <ConnectWalletStep /> },
    { label: "Step 2", description: "Mint a verification NFT", children: <MintNFTStep /> },
    { label: "Step 3", description: "Get full access", children: <FullAccessStep /> },
  ]

  return (
    <Stack>
      <Text>To proceed further, it is necessary to connect your wallet with ThirdEye and verify ownership over the contracts you own.</Text>

      <Space />

      <Flex direction="row">
        <Stepper w="100%" active={activeStep} onStepClick={setActiveStep} orientation="vertical"
          allowNextStepsSelect={false}
        >
          {steps.map(step => (
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
