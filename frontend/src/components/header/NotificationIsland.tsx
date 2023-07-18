import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import {
  Accordion,
  ActionIcon,
  Badge,
  Code,
  Flex,
  Group,
  HoverCard,
  Indicator,
  Paper,
  ScrollArea,
  Text,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { BsRecordCircle, BsThreeDots } from "react-icons/bs";

import { getColorByTag } from "@/utils";
import NotificationListItem from "./NotificationListItem";
import useNotificationsWS from "@/hooks/use-notifications-ws";
import Notification from "@/models/notification";

dayjs.extend(relativeTime);

export default function NotificationIsland() {
  const router = useRouter();
  const organizationId = router.query.orgId as string;

  const { notification, ...swr } = useNotificationsWS(organizationId);

  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Detect a new notification
  useEffect(() => {
    if (!notification) return;

    setNotifications((notifs) => [...notifs, notification]);
  }, [notification]);

  const [
    isListDropdownOpen,
    { close: closeListDropdown, open: openListDropdown },
  ] = useDisclosure(false);

  var latestNotification = notifications.at(-1);

  const NotificationListHover = () => {
    return (
      <ScrollArea h="50vh">
        <Accordion>
          {notifications
            .filter((notif) => notif !== latestNotification)
            .map((notif, idx) => {
              return (
                <Accordion.Item value={notif.id.toString()} key={idx}>
                  <NotificationListItem notif={notif} />
                </Accordion.Item>
              );
            })}
        </Accordion>
      </ScrollArea>
    );
  };

  const LatestNotification = () => {
    return (
      <Group
        pl="xs"
        sx={{
          "&:hover": {
            opacity: 0.8,
          },
        }}
      >
        <BsRecordCircle
          size="1.2em"
          color={getColorByTag("success")} // FIXME: not supplied by backend yet
        />

        <Badge>{latestNotification!.contract_name}</Badge>
        <Text size="sm" weight="bold" color="gray">
          triggered alert
        </Text>

        <Code>{latestNotification!.alert_name}</Code>

        <Text size="xs" color="gray">
          •
        </Text>
        <Text size="xs" color="gray">
          {dayjs(latestNotification!.created_at).fromNow()}
        </Text>
      </Group>
    );
  };

  return (
    <Paper
      withBorder
      radius="lg"
      h="100%"
      w="42%"
      shadow="lg"
      sx={(theme) => ({
        backgroundColor:
          theme.colorScheme === "dark"
            ? theme.colors.dark[8]
            : theme.colors.gray[1],
      })}
    >
      {!notifications || notifications.length === 0 ? (
        <Flex direction="column" align="center" justify="center" h="100%">
          <Text size="lg" weight="bold" color="gray">
            Notifications will appear here
          </Text>
        </Flex>
      ) : (
        <HoverCard width="41%" position="bottom-start" radius="lg" offset={20}>
          <HoverCard.Target>
            <Flex
              direction="row"
              gap="xs"
              align="center"
              justify="space-between"
              h="100%"
              onMouseLeave={closeListDropdown}
            >
              <LatestNotification />

              <Group pr="sm">
                <Indicator size="lg" processing label={notifications.length}>
                  <ActionIcon onClick={openListDropdown}>
                    <BsThreeDots
                      size="1.2em"
                      color="gray"
                      style={{
                        flex: "1",
                      }}
                    />
                  </ActionIcon>
                </Indicator>
              </Group>
            </Flex>
          </HoverCard.Target>

          <HoverCard.Dropdown>
            <NotificationListHover />
          </HoverCard.Dropdown>
        </HoverCard>
      )}
    </Paper>
  );
}
