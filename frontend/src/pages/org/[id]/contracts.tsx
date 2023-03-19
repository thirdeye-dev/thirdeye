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
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useDisclosure } from "@mantine/hooks";
import { AiFillCheckCircle, AiOutlinePlus } from "react-icons/ai";

import Contract from "@/models/contract";
import { fetchContracts } from "@/services/contracts";
import AddContractForm from "@/components/contracts/AddContractForm";
import ContractCard from "@/components/contracts/ContractCard";

export default function Contracts() {
  const [contracts, setContracts] = useState<Array<Contract>>([]);
  const [isAddModalOpened, { open: openAddModal, close: closeAddModal }] =
    useDisclosure(false);

  const assignContracts = async () => {
    const contracts = await fetchContracts();

    setContracts(contracts);
  };

  useEffect(() => {
    assignContracts();
  }, []);

  const onClickAdd = () => {
    openAddModal();
  };

  const afterFormSuccess = () => {
    closeAddModal();

    notifications.show({
      title: "Success",
      message: "Contract added successfully",
      color: "green",
      icon: <AiFillCheckCircle />,
    });
    assignContracts();
  };

  return (
    <>
      <Modal
        opened={isAddModalOpened}
        onClose={closeAddModal}
        title="Add Contract"
        centered
      >
        <AddContractForm afterSuccess={afterFormSuccess} />
      </Modal>

      <Container size="xl">
        <Flex justify="space-between" align="center" mb="md">
          <Text size="2rem" weight={700}>
            CONTRACTS
          </Text>

          <Button
            color="orange.4"
            variant="light"
            p={"xs"}
            onClick={onClickAdd}
          >
            <AiOutlinePlus size="1.3rem" />
          </Button>
        </Flex>

        <Paper radius="md" p="xl" withBorder mih="80vh">
          <SimpleGrid cols={2}>
            {contracts.map((contract, idx) => (
              <ContractCard key={idx} contract={contract} />
            ))}
          </SimpleGrid>
        </Paper>
      </Container>
    </>
  );
}

Contracts.getLayout = (page: ReactNode) => {
  return <AppShellLayout activeLink="contracts">{page}</AppShellLayout>;
};
