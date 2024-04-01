import useOverviewData from "@/hooks/use-overview-data";
import { Flex, Stack, Text } from "@mantine/core";
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

export default function ExecutionPieCharts({
  orgId,
}: {
  orgId: string | undefined;
}) {
  const { data } = useOverviewData(orgId, "weekly");

  const contractNames = data?.flatMap((contract) => contract.name) ?? [];

  const alertTriggers = data?.flatMap((contract) => ({
    name: contract.name,
    value: contract.entries
      .flatMap((entry) => entry.executions)
      .reduce((p, v) => p + v),
  }));

  // TODO: plug in on chain triggers
  const onChainTriggers = contractNames.map((name) => ({
    name: name,
    value: 0,
  }));

  const colors = ["#FF9830", "#B877D9", "#73BF69", "#5794F2"];
  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    index,
  }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  if (!alertTriggers || alertTriggers.length === 0) {
    return (
      <Flex h="100%" w="100%" justify="center" align="center">
        <Text size="1.5em" color="dimmed" align="center">
          Alerts / Executions PieCharts will appear here
        </Text>
      </Flex>
    );
  }

  return (
    <Stack h="100%">
      <Text size="1.8em" weight="bold" color="yellow">
        Executions / Triggers weekly
      </Text>

      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={alertTriggers}
            dataKey="value"
            cx="25%"
            label={renderCustomizedLabel}
            fill="#8884d8"
          >
            {alertTriggers?.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={colors[index % colors.length]}
              />
            ))}
          </Pie>

          <Pie
            data={onChainTriggers}
            dataKey="value"
            cx="75%"
            label={renderCustomizedLabel}
            fill="#8884d8"
          >
            {onChainTriggers.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={colors[index % colors.length]}
              />
            ))}
          </Pie>

          <Tooltip />
          <Legend payloadUniqBy />
        </PieChart>
      </ResponsiveContainer>
    </Stack>
  );
}
