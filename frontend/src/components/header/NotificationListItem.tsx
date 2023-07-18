import { Box, Code, Flex, Stack, Text } from "@mantine/core";
import dayjs from "dayjs";
import { BsRecordCircle } from "react-icons/bs";

import { getColorByTag } from "@/utils";
import Notification from "@/models/notification";

export default function NotificationListItem({ notif }: { notif: Notification }) {
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
          <BsRecordCircle size="1.5em" color={getColorByTag("success")} /> {/* hardcoded tag right now */}

          <Code>{notif.contract_name}</Code>
          <Text size="sm" weight="bold" color="gray">
            triggered alert
          </Text>

          <Code>{notif.alert_name}</Code>
        </Flex>

        <Text>{!notif.alert_description ? "No alert description" : notif.alert_description}</Text>

        <Text size="sm" color="gray">
          {dayjs(notif.created_at).fromNow()}
        </Text>
      </Stack>
    </Box>
  );
}
