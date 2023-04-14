import Contract from "@/models/contract";
import { deleteContract } from "@/services/contracts";
import {
  Avatar,
  Button,
  Card,
  Flex,
  Group,
  Paper,
  Stack,
  Text,
  Tooltip,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useRouter } from "next/router";
import { AiFillCopy } from "react-icons/ai";
import { FaEthereum, FaTrash } from "react-icons/fa";
import { TbPolygon } from "react-icons/tb";

export default function ContractCard({
  contract,
  handleDelete: handleDelete,
}: {
  contract: Contract;
  handleDelete: () => void;
}) {
  const router = useRouter();
  const organizationId = router.query.orgId as string;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);

    notifications.show({
      title: "Copied",
      message: "Address copied to clipboard",
      color: "green",
      icon: <AiFillCopy />,
    });
  };

  const onClickAddAlert = () => {
    router.push(`/org/${organizationId}/contracts/${contract.id}#add-alert`);
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

          <Group spacing={"0.2rem"}>
            <Tooltip label={contract.chain} color="gray">
              <Avatar
                color={contract.chain === "ETH" ? "blue" : "violet"}
                size="sm"
              >
                {contract.chain === "ETH" ? <FaEthereum /> : <TbPolygon />}
              </Avatar>
            </Tooltip>

            <Tooltip label={contract.network} color="gray">
              <Avatar color="blue" size="sm">
                {contract.network.at(0)}
              </Avatar>
            </Tooltip>
          </Group>
        </Flex>

        <Paper withBorder radius="md" shadow="sm" p="md" my="md" w="100%">
          <Flex justify={"space-between"} align="center">
            <Text size="sm" weight={500} ff="monospace">
              {contract.address}
            </Text>

            <Tooltip label="Add to clipboard" color="gray">
              <Button
                size="xs"
                variant="subtle"
                color="green"
                onClick={() => copyToClipboard(contract.address)}
              >
                <AiFillCopy size={"1rem"} />
              </Button>
            </Tooltip>
          </Flex>
        </Paper>

        <Flex justify={"space-between"}>
          <Group position="center">
            <Button
              variant="light"
              color="green"
              size="sm"
              onClick={onClickAddAlert}
            >
              Add Alert
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
