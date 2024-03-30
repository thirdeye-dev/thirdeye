import Contract from "@/models/contract";
import {
  Avatar,
  Box,
  Button,
  Card,
  Flex,
  Group,
  Stack,
  Text,
  Tooltip,
} from "@mantine/core";
import { useRouter } from "next/router";
import { FaTrash } from "react-icons/fa";
import CopyToClipboard from "../CopyToClipboard";
import { getColorByChain } from "@/utils";
import ChainIcon from "@/components/ChainIcon";

export default function ContractCard({
  contract,
  handleDelete: handleDelete,
}: {
  contract: Contract;
  handleDelete: () => void;
}) {
  const router = useRouter();
  const organizationId = router.query.orgId as string;

  const onClickAddAlert = () => {
    router.push(`/org/${organizationId}/alerts/create`);
  };
  const onClickManage = () => {
    router.push(`/org/${organizationId}/contracts/${contract.id}`);
  };

  return (
    <Card
      shadow="sm"
      radius="md"
      p="xl"
      withBorder
      sx={(theme) => ({
        "&:hover": {
          backgroundColor:
            theme.colorScheme === "dark"
              ? theme.colors.dark[5]
              : theme.colors.gray[0],
          transition: "background-color 0.2s ease-in-out",
        },
      })}
    >
      <Stack justify={"flex-start"} spacing="none">
        <Flex justify={"space-between"}>
          <Text size="1.4rem" weight={800} color="yellow">
            {contract.name}
          </Text>

          <Group gap={18}>
            <Tooltip label={contract.chain.toUpperCase()} color="gray">
              <Avatar
                color={getColorByChain(contract.chain)}
                radius="sm"
                size="sm"
              >
                <ChainIcon chain={contract.chain} />
              </Avatar>
            </Tooltip>

            <Tooltip label={contract.network.toUpperCase()} color="gray">
              <Avatar color="blue" radius="sm" size="sm">
                {contract.network.at(0)?.toUpperCase()}
              </Avatar>
            </Tooltip>
          </Group>
        </Flex>

        <CopyToClipboard textToCopy={contract.address} />

        <Flex justify={"space-between"}>
          <Group>
            <Button
              variant="light"
              color="green"
              size="sm"
              onClick={onClickAddAlert}
            >
              Create Alert
            </Button>
            <Button
              variant="light"
              color="blue"
              size="sm"
              onClick={onClickManage}
            >
              Manage
            </Button>
          </Group>

          <Tooltip label="Delete" color="gray">
            <Button
              variant="subtle"
              color="red"
              size="sm"
              p="xs"
              onClick={handleDelete}
            >
              <FaTrash />
            </Button>
          </Tooltip>
        </Flex>
      </Stack>
    </Card>
  );
}
