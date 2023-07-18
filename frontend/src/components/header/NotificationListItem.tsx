import {
  Accordion,
  Box,
  Code,
  Flex,
  Group,
  HoverCard,
  Stack,
  Text,
  Tooltip,
} from "@mantine/core";
import dayjs from "dayjs";
import { BsRecordCircle } from "react-icons/bs";

import { getColorByTag } from "@/utils";
import Notification from "@/models/notification";
import { Prism } from "@mantine/prism";

export default function NotificationListItem({
  notif,
}: {
  notif: Notification;
}) {
  return (
    <>
      <Accordion.Control>
        <Flex justify="space-between">
          <Group>
            <BsRecordCircle size="1.5em" color={getColorByTag("success")} />{" "}
            {/* hardcoded tag right now */}
            <Code>{notif.contract_name}</Code>
            <Text size="sm" weight="bold" color="dimmed">
              ➔
            </Text>
            <Tooltip
              color="gray"
              label={notif.alert_description || "No description"}
            >
              <Code>{notif.alert_name}</Code>
            </Tooltip>
          </Group>

          <Group>
            <Text size="sm" color="dimmed">
              {dayjs(notif.created_at).fromNow()}
            </Text>
          </Group>
        </Flex>
      </Accordion.Control>

      <Accordion.Panel>
        <Prism language="javascript">
          {JSON.stringify(notif.notification_body, null, 2)}
        </Prism>
      </Accordion.Panel>
    </>
  );
}
