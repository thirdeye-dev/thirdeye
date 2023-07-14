import { useEffect, useState } from "react";

import { Button, Flex, Paper, Space, Stack, Stepper, Text } from "@mantine/core";
import * as fcl from "@onflow/fcl"

import WalletConnector from "@/components/WalletConnector";
import { useWeb3Context } from "@/hooks/use-web3";
import { IWeb3Context } from "@/context/Web3";

function ConnectWalletStep({
  web3,
  done,
}: {
  web3: IWeb3Context;
  done: () => void;
}) {
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

function MintNFTStep({ web3 }: { web3: IWeb3Context }) {
  useEffect(() => {
    console.log(web3.transaction)
    console.log(web3.transaction.id)
  }, [web3.transaction])

  const mint = (unique_hash: string) => {
    web3.executeTransaction(
      `import ThirdEyeVerification from 0xThirdEyeVerification
        import NonFungibleToken from 0xNonFungibleToken
        import MetadataViews from 0xMetadataViews

        transaction(unique_hash: String, image_url: String) {
          let recipientCollection: &ThirdEyeVerification.Collection{NonFungibleToken.CollectionPublic}

          prepare(signer: AuthAccount) {
            if signer.borrow<&ThirdEyeVerification.Collection>(from: ThirdEyeVerification.CollectionStoragePath) == nil {
              signer.save(<- ThirdEyeVerification.createEmptyCollection(), to: ThirdEyeVerification.CollectionStoragePath)
              signer.link<&ThirdEyeVerification.Collection{NonFungibleToken.CollectionPublic, MetadataViews.ResolverCollection}>(ThirdEyeVerification.CollectionPublicPath, target: ThirdEyeVerification.CollectionStoragePath)
            }

            self.recipientCollection = signer.getCapability(ThirdEyeVerification.CollectionPublicPath)
                                  .borrow<&ThirdEyeVerification.Collection{NonFungibleToken.CollectionPublic}>()!
          }

          execute {
            ThirdEyeVerification.mintNFT(recipient: self.recipientCollection, unique_hash: unique_hash, image_url: image_url)

            log("Successfully Minted Verification Token")
          }
      }`,
      (arg: any, t: any) => [
        arg(unique_hash, t.String),
        arg(`${window.location.origin}/img/logo.jpeg`, t.String)
      ],
    )
  }

  return <Button onClick={() => mint("pretend-this-is-a-hash")}>Mint an NFT now</Button>;
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
      children: <MintNFTStep web3={web3} />,
    },
    {
      label: "Step 3",
      description: "Validate your ownership",
      children: <></>
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
          {steps.map((step, idx) => (
            <Stepper.Step
              key={idx}
              label={step.label}
              description={step.description}
            />
          ))}
        </Stepper>

        <Paper w="100%" p="md" withBorder>
          {steps[activeStep].children}
        </Paper>
      </Flex>
    </Stack>
  );
}
