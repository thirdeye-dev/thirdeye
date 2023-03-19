import { ReactNode } from "react";
import AppShellLayout from "@/layouts/AppShellLayout";
import {
  Button,
  Card,
  Container,
  Flex,
  Grid,
  Paper,
  SimpleGrid,
  Stack,
  Text,
} from "@mantine/core";
import { AiOutlinePlus } from "react-icons/ai";

export default function Contracts() {
  const data = [
    {
      id: 1,
      name: "Hotkeys",
      address:
        "0xc0193ba0f6029a028e7f4f7802b8a59fb434a2a69b64a0035974f492a7997ff0",
      chain: "eth",
      network: "mainnet",
      owner: "32",
    },
  ];

  return (
    <Container size="xl">
      <Flex justify="space-between" align="center" mb="md">
        <Text size="2rem" weight={700}>
          CONTRACTS
        </Text>

        <Button color="orange.4" variant="light" p={"xs"}>
          <AiOutlinePlus size="1.3rem" />
        </Button>
      </Flex>

      <Paper radius="md" p="xl" withBorder mih="80vh">
        <SimpleGrid cols={2}>
          {data.map((contract, idx) => (
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
  );
}

Contracts.getLayout = (page: ReactNode) => {
  return <AppShellLayout activeLink="contracts">{page}</AppShellLayout>;
};
