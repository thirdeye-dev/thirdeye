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
      executions: Math.floor(Math.random() * 30) / 20,
    })),
  ];

  const chartCfg = {
    autoFit: true,
    start: "2022-01",
    end: "2023-01",
    data,
    height: 180,
    size: 10,
    dateField: "date",
    valueField: "executions",
    condition: (val: number) => {
      if (val === 0) {
        return "#F2F3F5";
      }

      if (val > 0 && val <= 1) {
        return "#BAE7FF";
      }

      if (val > 1 && val <= 10) {
        return "#1890FF";
      }

      if (val > 10) {
        return "#0050B3";
      }
    },
  };

  // @ts-ignore
  return (
    <Stack justify="center" h="100%" p="md">
      <CalendarHeatmap {...chartCfg} />

      <HeatmapControls />
    </Stack>
  );
}
