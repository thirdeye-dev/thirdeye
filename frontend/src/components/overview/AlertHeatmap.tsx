import dynamic from "next/dynamic";

import dayjs from "dayjs";
import { Button, Flex, Stack, Text, Tooltip } from "@mantine/core";

import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";

function HeatmapControls() {
  return (
    <Flex justify="space-evenly" align="center">
      <Tooltip label="Previous year" color="gray">
        <Button variant="light">
          <AiOutlineLeft />
        </Button>
      </Tooltip>

      <Text color="dimmed">
        {dayjs("2022-01-01").format("MMM")} -{" "}
        {dayjs("2022-12-01").add(365, "day").format("MMM")} (2022)
      </Text>

      <Tooltip label="Next year" color="gray">
        <Button variant="light">
          <AiOutlineRight />
        </Button>
      </Tooltip>
    </Flex>
  );
}

// TODO: Find a better heatmap library, temporary solution right now
export default function AlertHeatmap() {
  const CalendarHeatmap = dynamic(() => import("@antv/calendar-heatmap"), {
    ssr: false,
  });

  const data = [
    ...Array.from({ length: 365 }).map((_, i) => ({
      date: dayjs("2022-01-01").add(i, "day").format("YYYY-MM-DD"),
      executions: Math.floor(Math.random() * 10),
    })),
  ];

  const chartCfg = {
    autoFit: true,
    start: "2022-01",
    end: "2022-12",
    data,
    height: 180,
    size: 10,
    dateField: "date",
    valueField: "executions",
    condition: (val: number) => {
      // Get heatmap color based on value (number of executions) from github (expect 0-30)
      const colors = ["#ebedf0", "#c6e48b", "#7bc96f", "#239a3b", "#196127"];

      if (val === 0) {
        return colors[0];
      } else if (val > 0 && val <= 5) {
        return colors[1];
      } else if (val > 5 && val <= 10) {
        return colors[2];
      } else if (val > 10 && val <= 15) {
        return colors[3];
      } else if (val > 15 && val <= 20) {
        return colors[4];
      } else {
        return colors[4];
      }
    },
  };

  return (
    <Stack justify="center" h="100%" p="md">
      {/* @ts-ignore */}
      <CalendarHeatmap {...chartCfg} />
      <HeatmapControls />
    </Stack>
  );
}
