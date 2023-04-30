import { Stack, Text } from "@mantine/core";
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

export default function ExecutionPieCharts() {
  const alertTriggers = [
    { name: "Contract 1", value: 1350 },
    { name: "Contract 2", value: 1140 },
  ];

  const onChainTriggers = [
    { name: "Contract 1", value: 224 },
    { name: "Contract 2", value: 892 },
  ];

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
            {alertTriggers.map((entry, index) => (
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
