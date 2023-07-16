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
export default function AlertHeatmap({ orgId }: { orgId: string | undefined }) {
  const CalendarHeatmap = dynamic(() => import("@antv/calendar-heatmap"), {
    ssr: false,
  });

  // const { data, isLoading } = useOverviewData(orgId, "yearly");

  const startDate = dayjs("2023-01-01");
  const data = [
    ...Array.from({ length: 365 }).map((_, i) => {
      const today = startDate.add(i, "day"); 
      
      let executions = 0;
      if (today.month() == 6) {
        executions = Math.floor(Math.random() * 10);
      }

      return ({
      date: today.format("YYYY-MM-DD"),
      executions: executions,
      })
    }),
  ];

  // const mergeEntries = (data: OverviewData) => {
  //   let result = [];

  //   // FIXME: this could get buggy when dates would conflict between multiple contracts
  //   // the graphing library may or may not handle that
  //   for (const contract of data) {
  //     for (const entry of contract.entries) {
  //       result.push(entry);
  //     }
  //   }

  //   return result;
  // };

  // const dataMerged: { date: string; executions: number }[] = mergeEntries(
  //   data ?? []
  // );

  const chartCfg = {
    autoFit: true,
    data: data,
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
