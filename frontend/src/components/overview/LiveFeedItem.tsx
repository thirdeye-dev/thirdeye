import Contract from "@/models/contract";
import { fetchContract } from "@/services/contracts";
import { Box, Code, Flex, HoverCard, Stack, Text } from "@mantine/core";
import dayjs from "dayjs";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { BsRecordCircle } from "react-icons/bs";

const getColorByTag = (tag: string) => {
  switch (tag) {
    case "success":
      return "green";
    case "warn":
      return "yellow";
    case "error":
      return "red";
    default:
      return "gray";
  }
};

function ContractInfoHoverCard({
  contract,
  organizationId,
}: {
  contract: Contract;
  organizationId: string;
}) {
  return (
    <Box p="sm">
      <Stack>
        <Link href={`/org/${organizationId}/contracts/${contract.id}`}>
          <Text weight="bold">{contract.name}</Text>
        </Link>

        <Code>{contract.address}</Code>
      </Stack>
    </Box>
  );
}

// TODO: add more info about the alert
function AlertInfoHoverCard({
  alert_name,
  alert_type,
  type_description,
  organizationId,
}: {
  alert_name: string;
  alert_type: string;
  type_description: string;
  organizationId: string;
}) {
  return (
    <Box p="sm">
      <Stack>
        <Flex direction="row" align="center" gap="xs">
          {/* TODO: modify href to point to detailed alert page */}
          <Link href={`/org/${organizationId}/alerts`}>
            <Text weight="bold">{alert_name}</Text>
          </Link>
          <Text size="sm">({alert_type})</Text>
        </Flex>

        <Text>{type_description}</Text>
      </Stack>
    </Box>
  );
}

// FIXME: construct a type for this
export default function LiveFeedItem({ alert }: any) {
  const router = useRouter();

  const organizationId = router.query.id as string;

  const [contract, setContract] = useState<Contract | null>(null);

  const assignContract = async () => {
    // FIXME: uncomment this when the API is ready, and remove the dummy data
    // const contract = await fetchContract(alert.contract_id, organizationId);

    setContract({
      id: 1,
      name: "My Contract",
      address: "0x1234567890",
      chain: "eth",
      network: "mainnet",
    });
  };

  useEffect(() => {
    assignContract();
  }, [alert]);

  return (
    <Box
      p="md"
      sx={(theme) => ({
        "&:hover": {
          backgroundColor:
            theme.colorScheme === "dark"
              ? theme.colors.dark[5]
              : theme.colors.gray[0],
          transition: "background-color 0.2s ease-in-out",
        },
        borderBottom: `1px solid ${
          theme.colorScheme === "dark"
            ? theme.colors.dark[4]
            : theme.colors.gray[2]
        }`,
      })}
    >
      <Stack>
        <Flex direction="row" justify="flex-start" gap="md">
          <BsRecordCircle size="1.5em" color={getColorByTag(alert.tag)} />

          <HoverCard withArrow shadow="md">
            <HoverCard.Target>
              <Code>{alert.contract_name}</Code>
            </HoverCard.Target>

            <HoverCard.Dropdown>
              <ContractInfoHoverCard
                contract={contract!}
                organizationId={organizationId}
              />
            </HoverCard.Dropdown>
          </HoverCard>

          <Text size="sm" weight="bold" color="gray">
            triggered alert
          </Text>

          <HoverCard withArrow shadow="md">
            <HoverCard.Target>
              <Code>{alert.alert_name}</Code>
            </HoverCard.Target>

            <HoverCard.Dropdown>
              <AlertInfoHoverCard
                alert_name={alert.alert_name}
                alert_type={alert.type}
                type_description={alert.type_description}
                organizationId={organizationId}
              />
            </HoverCard.Dropdown>
          </HoverCard>
        </Flex>

        <Text>{alert.body}</Text>

        <Text size="sm" color="gray">
          {dayjs(alert.executed_at).fromNow()}
        </Text>
      </Stack>
    </Box>
  );
}
