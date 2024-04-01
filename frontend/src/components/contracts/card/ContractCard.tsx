import { useRouter } from "next/router";

import {
  Avatar,
  Button,
  Card,
  Flex,
  Group,
  Stack,
  Text,
  Tooltip,
} from "@mantine/core";
import { FaTrash } from "react-icons/fa";

import { getColorByChain } from "@/utils";
import ChainIcon from "@/components/ChainIcon";
import Contract from "@/models/contract";
import CopyToClipboard from "../../CopyToClipboard";

import classes from "./ContractCard.module.css";

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
    <Card className={classes.main} shadow="sm" radius="md" p="lg" withBorder>
      <Stack justify="flex-start" gap={0}>
        <Flex justify="space-between">
          <Text size="1.4rem" fw={800} c="yellow">
            {contract.name}
          </Text>

          <Group gap={8}>
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
