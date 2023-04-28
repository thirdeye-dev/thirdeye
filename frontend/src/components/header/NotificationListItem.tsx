import { Box, Code, Flex, Stack, Text } from "@mantine/core";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import { BsRecordCircle } from "react-icons/bs";

import { getColorByTag } from "@/utils";

// FIXME: construct a type for this
export default function NotificationListItem({ notif }: Record<string, any>) {
  const router = useRouter();

  if (!notif) return null;

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
          <BsRecordCircle size="1.5em" color={getColorByTag(notif.tag)} />

          <Code>{notif.contract_name}</Code>
          <Text size="sm" weight="bold" color="gray">
            triggered alert
          </Text>

          <Code>{notif.alert_name}</Code>
        </Flex>

        <Text>{notif.body}</Text>

        <Text size="sm" color="gray">
          {dayjs(notif.executed_at).fromNow()}
        </Text>
      </Stack>
    </Box>
  );
}
