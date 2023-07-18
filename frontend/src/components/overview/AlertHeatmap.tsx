import dynamic from "next/dynamic";

import dayjs from "dayjs";
import { Button, Flex, Stack, Text, Tooltip } from "@mantine/core";

import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";
import useOverviewData from "@/hooks/use-overview-data";
import { OverviewData } from "@/models/overviewData";

interface ComposedExecutionDay {
  date: string;
  executions: number;
}

function composeOverviewData(inputData: OverviewData): ComposedExecutionDay[] {
  const output: { [date: string]: ComposedExecutionDay } = {};

  for (const item of inputData) {
    // @ts-ignore: entries is a field name, not a function
    for (const entry of item.entries) {
      // Add up executions, if the date already exists
      if (output.hasOwnProperty(entry.date)) {
        output[entry.date].executions += entry.executions;
        continue;
      }

      output[entry.date] = {
        date: entry.date,
        executions: entry.executions,
      };
    }
  }

  return Object.values(output);
}

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
export default function AlertHeatmap({ orgId }: { orgId: string | undefined }) {
  const CalendarHeatmap = dynamic(() => import("@antv/calendar-heatmap"), {
    ssr: false,
  });

  const { data } = useOverviewData(orgId, "yearly");

  const dataComposed: ComposedExecutionDay[] = composeOverviewData(data ?? []);

  const chartCfg = {
    autoFit: true,
    data: dataComposed,
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

  if (!data || data.length === 0) {
    return (
      <Flex h="100%" w="100%" justify="center" align="center">
        <Text size="1.5em" color="dimmed">
          Yearly / Monthly heatmap will show here
        </Text>
      </Flex>
    );
  }

  return (
    <Stack justify="center" h="100%" p="md">
      {/* @ts-ignore */}
      <CalendarHeatmap {...chartCfg} />
      <HeatmapControls />
    </Stack>
  );
}
