import CopyToClipboard from "@/components/CopyToClipboard";
import Contract, { Chain } from "@/models/contract";
import { gradientByChain } from "@/utils";
import { Text, Flex, Stack, Divider, Paper, Group, Button, Badge } from "@mantine/core";
import { AiFillLock, AiFillUnlock } from "react-icons/ai";

export default function ContractInfo({
  contract,
  numAlerts, // FIXME: give this a place :p
}: {
  contract: Contract | undefined;
  numAlerts: number;
}) {
  if (!contract) return null;

  return (
    <Paper
      h="100%"
      p="lg"
      sx={(theme) => ({
        backgroundColor:
          theme.colorScheme === "dark"
            ? theme.colors.dark[5]
            : theme.colors.gray[0],
        borderRadius: theme.radius.md,
      })}
    >
      <Stack>
        <Flex direction="row" justify="space-between">
          <Group>
            <Text size="2.5em" weight="bold" color="yellow">
              {contract.name}
            </Text>

            <Badge variant="gradient" gradient={gradientByChain(contract.chain)}>{contract.chain}</Badge>
            <Badge variant="dot">{contract.network}</Badge>
          </Group>
        </Flex>

        <Divider />

        <CopyToClipboard textToCopy={contract.address} />
      </Stack>
    </Paper>
  );
}
