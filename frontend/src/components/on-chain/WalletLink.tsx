import { useEffect, useState } from "react";

import { Anchor, Button, Flex, Loader, Paper, Progress, Space, Stack, Stepper, Text, ThemeIcon } from "@mantine/core";

import WalletConnector from "@/components/WalletConnector";
import { useWeb3Context } from "@/hooks/use-web3";
import { IWeb3Context } from "@/context/Web3";
import { AiOutlineArrowRight, AiOutlineCheckCircle, AiOutlineLoading } from "react-icons/ai";

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

function MintNFTStep({ web3, done }: { web3: IWeb3Context, done: () => void;}) {
  const [minting, setMinting] = useState(false);
  const [alreadyMinted, setAlreadyMinted] = useState(false);

  const onNftSuccess = () => {
    console.log("NFT Mint successful");
    setAlreadyMinted(true);
  }

  useEffect(() => {
    if (web3.transaction.status == 4 && web3.transaction.errorMessage == '') {
      setMinting(false);
      onNftSuccess()
    }
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
    );

    setMinting(true);
  }

  return (
    <Stack h="100%">
      <Text weight="lighter">{alreadyMinted ? "Already Minted" : "This NFT will come in handy for you and us to verify the FLOW account which owns the ThirdEye account."}</Text>
      {minting ? <Progress value={(web3.transaction.status ?? 0) * 100 / 4} /> : null}

      <Button loading={minting} variant="outline" color="teal" onClick={() => {
        if (alreadyMinted) return done();

        mint("pretend-this-is-a-hash")
      }}>
        {alreadyMinted ? "Continue with validation": "Mint an NFT now"}
      </Button>
    </Stack>
  );
}

function ValidateOwnershipStep({ web3, done }: { web3: IWeb3Context, done: () => void; }) {
  const [checking, setChecking] = useState(true);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setChecking(false);
      setSuccess(true);
    }, 3000)
  }, [])

  if (success) {
    return (
      <Stack h="100%" justify="center" align="center">
        <AiOutlineCheckCircle size="6rem" />
        <Text>Your ownership has been verified!</Text>
        
        <Button variant="light" onClick={done}>Continue</Button>
      </Stack>
    );
  }

  return (
    <Stack h="100%" justify="center" align="center">
      <Loader size="xl" />
      <Text weight="lighter">We are validating your ownership - Hang Tight!</Text>
    </Stack>
  );
}

function FullAccessStep({ done }: { done: () => void; }) {
  return (
    <Stack h="100%" justify="space-between">
      <Text weight="bold" size="xl">Welcome to ThirdEye Automations</Text>
      <Space />

      <Text weight="lighter">
        You can now implement custom on chain logic using our <Anchor>Cadence SDK</Anchor> for use cases like Multi-Sig, Single-Sig, etc.
      </Text>

      <Space />
      <Button w="100%" variant="gradient" rightIcon={<AiOutlineArrowRight />} onClick={done}>Start Building</Button>
    </Stack>
  );
}

export default function WalletLink({ onSuccess }: { onSuccess: () => void; }) {
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
      children: <MintNFTStep web3={web3} done={() => incStep()} />,
    },
    {
      label: "Step 3",
      description: "Validate your ownership",
      children: <ValidateOwnershipStep web3={web3} done={() => incStep()} />
    },
    {
      label: "Step 4",
      description: "Get full access",
      children: <FullAccessStep done={() => onSuccess()} />,
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
