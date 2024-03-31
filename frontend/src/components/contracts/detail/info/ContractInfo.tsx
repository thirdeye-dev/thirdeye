import { Text, Flex, Stack, Divider, Paper, Group, Badge } from "@mantine/core";

import CopyToClipboard from "@/components/CopyToClipboard";
import Contract from "@/models/contract";
import { gradientByChain } from "@/utils";

import classes from "./ContractInfo.module.css";

export default function ContractInfo({
  contract,
  numAlerts, // FIXME: give this a place :p
}: {
  contract: Contract | undefined;
  numAlerts: number;
}) {
  if (!contract) return null;

  return (
    <Paper className={classes.main} h="100%" p="lg">
      <Stack>
        <Flex direction="row" justify="space-between">
          <Group>
            <Text size="2.5em" fw="bold" color="yellow">
              {contract.name}
            </Text>

            <Badge
              variant="gradient"
              gradient={gradientByChain(contract.chain)}
            >
              {contract.chain}
            </Badge>
            <Badge variant="dot">{contract.network}</Badge>
          </Group>
        </Flex>

        <Divider />

        <CopyToClipboard textToCopy={contract.address} />
      </Stack>
    </Paper>
  );
}
