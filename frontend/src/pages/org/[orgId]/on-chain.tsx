import WalletLink from "@/components/on-chain/WalletLink";
import useCurrentUser from "@/hooks/use-current-user";
import AppShellLayout from "@/layouts/AppShellLayout"
import { Text, Flex, Paper, Stack, Table, Modal } from "@mantine/core"
import { useDisclosure } from "@mantine/hooks";
import { ReactNode, useEffect } from "react"

function OnChainMonitoring() {
  return (
    <Stack>
      <Text 
        size="2.5em"
        weight="bold"
        color="yellow"
      >
        Monitoring
      </Text>

      <Table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Address</th>
            <th>Type</th>
            <th>Chain</th>
          </tr>
        </thead>
      </Table>
    </Stack>
  );
}

function OnChainAutomation() {
  return (
    <Stack>
      <Text 
        size="2.5em"
        weight="bold"
        color="yellow"
      >
        Automation
      </Text>
    </Stack>
  );
}

export default function OnChain() {
  const { user } = useCurrentUser();
  const hasLinkedWallet = user?.wallet_address !== null

  const [walletLinkingModalOpen, { open: openWalletLinkingModal, close: closeWalletLinkingModal }] = useDisclosure(false);

  useEffect(() => {
    if (!hasLinkedWallet) {
      openWalletLinkingModal();
    }
  }, [hasLinkedWallet])

  return (
    <>
    <Modal
      title={<Text size="1.5em">Wallet Linking</Text>}
      size="xl"
      opened={walletLinkingModalOpen}  
      onClose={closeWalletLinkingModal}
      withCloseButton={false}
      closeOnEscape={false}
      closeOnClickOutside={false}
      centered
    >
      <WalletLink /> 
    </Modal>
    <Flex direction="row" gap="md" h="88vh">
      <Paper withBorder w="100%" h="100%" p="md">
        <OnChainMonitoring />
      </Paper>

      <Paper withBorder w="100%" h="100%" p="md">
        <OnChainAutomation />
      </Paper>
    </Flex>
    </>
  );
}

OnChain.getLayout = (page: ReactNode) => {
  return <AppShellLayout activeLink="on-chain">{page}</AppShellLayout>
}
