import CopyToClipboard from "@/components/CopyToClipboard";
import Contract from "@/models/contract";
import { Text, Box, Flex, Stack, Divider } from "@mantine/core";

function Features({
  contract,
  numAlerts,
}: {
  contract: Contract;
  numAlerts: number;
}) {
  const features = [
    {
      name: "Total Alerts",
      value: numAlerts,
    },
    {
      name: "Chain",
      value: contract.chain,
    },
    {
      name: "Network",
      value: contract.network,
    },
  ];

  const FeatureItem = ({
    name,
    value,
    renderDivider,
  }: {
    name: string;
    value: string | number;
    renderDivider: boolean;
  }) => (
    <>
      <Stack align="center">
        <Text size="lg" weight="bold">
          {name}
        </Text>
        <Text size="md">{value}</Text>
      </Stack>

      {renderDivider && <Divider orientation="vertical" />}
    </>
  );

  return (
    <Flex justify="space-evenly">
      {features.map((feature, idx) => (
        <FeatureItem
          key={idx}
          name={feature.name}
          value={feature.value}
          renderDivider={idx !== features.length - 1}
        />
      ))}
    </Flex>
  );
}

export default function ContractInfo({
  contract,
  numAlerts,
}: {
  contract: Contract | undefined;
  numAlerts: number;
}) {
  if (!contract) return null;

  return (
    <Box
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
        <Text size="2.5em" weight="bold" color="yellow" align="center">
          {contract.name}
        </Text>

        <CopyToClipboard textToCopy={contract.address} />
        <Features contract={contract} numAlerts={numAlerts} />
      </Stack>
    </Box>
  );
}
