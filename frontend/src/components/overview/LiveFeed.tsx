import { Divider, Flex, Paper, ScrollArea, Stack, Text } from "@mantine/core";
import { useState } from "react";
import { BsFillCircleFill } from "react-icons/bs";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import LiveFeedItem from "./LiveFeedItem";

dayjs.extend(relativeTime);

export default function LiveFeed() {
  const [alerts, setAlerts] = useState([
    {
      contract_name: "My Contract",
      alert_name: "Gas Threshold Exceed",
      type: "gas_threshold_reached",
      tag: "success",
      body: "Gas threshold of 1000 was reached",
      executed_at: dayjs(),
    },
    {
      contract_name: "My Contract",
      alert_name: "Change in balance",
      type: "owner_balance_changed",
      tag: "warn",
      body: "Owner balance changed by 1 ETH",
      executed_at: dayjs().subtract(1, "hour"),
    },
    {
      contract_name: "My Contract",
      alert_name: "Too many Failed Transactions",
      tag: "error",
      type: "too_many_failed_transactions",
      body: "Too many failed transactions in the last 24 hours",
      executed_at: dayjs().subtract(3, "day"),
    },
  ]);

  return (
    <Stack p="md" h="100%" align="center">
      <Paper p="md">
        <Flex direction="row" justify="center" align="center" gap="sm">
          <BsFillCircleFill size="1.5em" color="red" />

          <Text size="2em" weight="bold" align="center">
            Live Alerts
          </Text>
        </Flex>
      </Paper>
      <Divider w="100%" />

      <ScrollArea mah="100%" w="100%">
        {alerts.map((alert, i) => (
          <LiveFeedItem alert={alert} key={i} />
        ))}
      </ScrollArea>
    </Stack>
  );
}
