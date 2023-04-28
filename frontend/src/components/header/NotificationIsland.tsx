import { useState } from "react";

import {
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

dayjs.extend(relativeTime);

export function NotificationIsland() {
  const [notifications, setNotifications] = useState<Array<Record<any, any>>>([
    {
      contract_name: "My Contract",
      contract_id: 1,
      alert_name: "Gas Threshold Exceed",
      type: "gas_threshold_reached",
      type_description: "Occurs when the gas threshold is reached",
      tag: "success",
      body: "Gas threshold of 1000 was reached",
      executed_at: dayjs(),
    },
    {
      contract_name: "My Contract",
      contract_id: 1,
      alert_name: "Change in balance",
      type: "owner_balance_changed",
      type_description: "Occurs when the owner balance changes",
      tag: "warn",
      body: "Owner balance changed by 1 ETH",
      executed_at: dayjs().subtract(1, "hour"),
    },
    {
      contract_name: "My Contract",
      contract_id: 1,
      alert_name: "Too many Failed Transactions",
      type: "too_many_failed_transactions",
      type_description:
        "Occurs when there are too many failed transactions in the set duration",
      tag: "error",
      body: "Too many failed transactions in the last 24 hours",
      executed_at: dayjs().subtract(3, "day"),
    },
  ]);

  const [
    isListDropdownOpen,
    { close: closeListDropdown, open: openListDropdown },
  ] = useDisclosure(false);

  var latestNotification = notifications.at(0);

  const NotificationListHover = () => {
    return (
      <ScrollArea h="50vh">
        {notifications
          .filter((notif) => notif !== latestNotification)
          .map((notif) => {
            return <NotificationListItem key={notif.id} notif={notif} />;
          })}
      </ScrollArea>
    );
  };

  return (
    <Paper
      withBorder
      radius="lg"
      h="100%"
      w="40%"
      shadow="lg"
      sx={(theme) => ({
        backgroundColor:
          theme.colorScheme === "dark"
            ? theme.colors.dark[8]
            : theme.colors.gray[1],
      })}
    >
      {notifications.length === 0 ? (
        <Flex direction="column" align="center" justify="center" h="100%">
          <Text size="lg" weight="bold" color="gray">
            Notifications will appear here
          </Text>
        </Flex>
      ) : (
        <HoverCard width="39%" position="bottom-start" radius="lg" offset={20}>
          <HoverCard.Target>
            <Flex
              direction="row"
              gap="xs"
              align="center"
              justify="space-between"
              h="100%"
              onMouseLeave={closeListDropdown}
            >
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
                  color={getColorByTag(latestNotification!.tag)}
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
                  {dayjs(latestNotification!.executed_at).fromNow()}
                </Text>
              </Group>

              <Group pr="sm">
                <Indicator processing>
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
