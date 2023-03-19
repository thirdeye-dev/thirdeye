import { ReactNode, useEffect, useState } from "react";
import AppShellLayout from "@/layouts/AppShellLayout";
import {
  Button,
  Card,
  Container,
  Flex,
  Modal,
  Paper,
  SimpleGrid,
  Stack,
  Text,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { AiOutlinePlus } from "react-icons/ai";

import Contract from "@/models/contract";
import { fetchContracts } from "@/services/contracts";
import AddContractForm from "@/components/contracts/AddContractForm";

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
              <Card key={idx} shadow="sm" radius="md" p="xl" withBorder>
                <Stack justify={"flex-start"} spacing="none">
                  <Text size="lg" weight={700} color="cyan">
                    {contract.name}
                  </Text>

                  <Text size="sm" weight={500} color="gray">
                    {contract.address}
                  </Text>

                  <Flex
                    justify="space-evenly"
                    align="center"
                    mt="md"
                    mb="md"
                    w="100%"
                  >
                    <Text size="sm" weight={500}>
                      {contract.chain}
                    </Text>

                    <Text size="sm" weight={500}>
                      {contract.network}
                    </Text>
                  </Flex>
                </Stack>
              </Card>
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
