import { ScatterChart } from "@mantine/charts";

import { OverviewContract, OverviewData } from "@/models/overviewData";
import useOverviewData from "@/hooks/use-overview-data";
import { Flex, Text, Box } from "@mantine/core";

const weekDays = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const mantineColors = ["blue.5", "green.5", "orange.5", "pink.5", "violet.5"];

export default function AlertGraph({ orgId }: { orgId: string | undefined }) {
  let { data, isLoading } = useOverviewData(orgId, "weekly");

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!data || data.length === 0) {
    return (
      <Flex h="100%" w="100%" justify="center" align="center">
        <Text size="1.5em" c="dimmed">
          Alert executions will appear here
        </Text>
      </Flex>
    );
  }

  const dataPatched = data.map((c, idx) => ({
    ...c,
    data: c.entries.map((e) => ({
      day: weekDays.indexOf(e.day),
      executions: e.executions,
    })),
    color: mantineColors[idx % mantineColors.length],
  }));

  return (
    <ScatterChart
      h="100%"
      data={dataPatched}
      dataKey={{ x: "day", y: "executions" }}
      xAxisLabel="Week Day"
      yAxisLabel="Alert Executions"
      xAxisProps={{
        allowDuplicatedCategory: false,
        domain: [0, 6],
        type: "time",
      }}
      scatterProps={{ line: true }}
      valueFormatter={{
        x: (value) => weekDays[value],
        y: (value) => value,
      }}
      withLegend
    />
  );
}
