import { ReactNode, useEffect, useState } from "react";
import AppShellLayout from "@/layouts/AppShellLayout";
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

import Contract from "@/models/contract";
import { deleteContract, fetchContracts } from "@/services/contracts";
import AddContractForm from "@/components/contracts/AddContractForm";
import ContractCard from "@/components/contracts/ContractCard";
import { useRouter } from "next/router";

export default function Contracts() {
  const router = useRouter();

  const [contracts, setContracts] = useState<Array<Contract>>([]);
  const [isAddModalOpened, { open: openAddModal, close: closeAddModal }] =
    useDisclosure(false);

  const organizationId = router.query.id as string;

  const assignContracts = async (organizationId: string) => {
    const contracts = await fetchContracts(organizationId);

    setContracts(contracts);
  };

  useEffect(() => {
    if (!organizationId) return;

    assignContracts(organizationId);
  }, [organizationId]);

  const onClickAdd = () => {
    openAddModal();
  };

  const handleContractDelete = async (contract: Contract) => {
    await deleteContract(contract.id, organizationId);

    notifications.show({
      title: "Success",
      message: "Contract deleted successfully",
      color: "green",
      icon: <AiFillCheckCircle />,
    });
    assignContracts(organizationId);
  };

  const afterFormSuccess = () => {
    closeAddModal();

    notifications.show({
      title: "Success",
      message: "Contract added successfully",
      color: "green",
      icon: <AiFillCheckCircle />,
    });
    assignContracts(organizationId);
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
          afterSuccess={afterFormSuccess}
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
              onClick={onClickAdd}
            >
              <AiOutlinePlus size="1.3rem" />
            </Button>
          </Tooltip>
        </Flex>

        <Paper radius="md" p="xl" mih="80vh" withBorder>
          {contracts.length === 0 ? (
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
              {contracts.map((contract, idx) => (
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
