import { ReactNode } from "react";
import { useRouter } from "next/router";

import {
  Button,
  Container,
  Flex,
  Modal,
  Paper,
  SimpleGrid,
  Text,
  Tooltip,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useDisclosure } from "@mantine/hooks";
import { AiFillCheckCircle, AiOutlinePlus } from "react-icons/ai";

import AppShellLayout from "@/layouts/AppShellLayout";
import Contract from "@/models/contract";
import { deleteContract } from "@/services/contracts";
import AddContractForm from "@/components/contracts/AddContractForm";
import ContractCard from "@/components/contracts/ContractCard";
import useContracts from "@/hooks/use-contracts";

export default function Contracts() {
  const router = useRouter();

  const organizationId = router.query.orgId as string;
  const { contracts, isLoading, mutate } = useContracts(organizationId); // FIXME: sometimes organizationId is undefined, causing a failed request

  const [isAddModalOpened, { open: openAddModal, close: closeAddModal }] =
    useDisclosure(false);

  const handleContractDelete = async (contract: Contract) => {
    await deleteContract(contract.id, organizationId);
    mutate();

    notifications.show({
      title: "Success",
      message: "Contract deleted successfully",
      color: "green",
      icon: <AiFillCheckCircle />,
    });
  };

  const afterAddContract = () => {
    closeAddModal();
    mutate();

    notifications.show({
      title: "Success",
      message: "Contract added successfully",
      color: "green",
      icon: <AiFillCheckCircle />,
    });
  };

  return (
    <>
      <Modal
        opened={isAddModalOpened}
        onClose={closeAddModal}
        title="Add Contract"
        centered
      >
        <AddContractForm
          organizationId={organizationId}
          afterSuccess={afterAddContract}
        />
      </Modal>

      <Container size="xl">
        <Flex justify="space-between" align="center" mb="md">
          <Text size="2rem" weight={700}>
            CONTRACTS
          </Text>

          <Tooltip label="Add New" position="right">
            <Button
              color="orange.4"
              variant="light"
              p={"xs"}
              onClick={() => openAddModal()}
            >
              <AiOutlinePlus size="1.3rem" />
            </Button>
          </Tooltip>
        </Flex>

        <Paper radius="md" p="xl" mih="80vh" withBorder>
          {isLoading && (
            <Flex direction="column" justify="center" align="center" h="70vh">
              <Text color="gray.7" size="2.5em" weight="bold" align="center">
                Loading...
              </Text>
            </Flex>
          )}

          {contracts?.length === 0 ? (
            // FIXME: improve the feedback
            <Flex direction="column" justify="center" align="center" h="70vh">
              <Text color="gray.7" size="2.5em" weight="bold" align="center">
                No contracts found
              </Text>
              <Text size="1.5em" weight="lighter" align="center">
                Add or import contracts to get started.
              </Text>
            </Flex>
          ) : (
            <SimpleGrid cols={2}>
              {contracts?.map((contract, idx) => (
                <ContractCard
                  key={idx}
                  contract={contract}
                  handleDelete={() => handleContractDelete(contract)}
                />
              ))}
            </SimpleGrid>
          )}
        </Paper>
      </Container>
    </>
  );
}

Contracts.getLayout = (page: ReactNode) => {
  return <AppShellLayout activeLink="contracts">{page}</AppShellLayout>;
};
