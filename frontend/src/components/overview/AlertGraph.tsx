import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const data = [
  {
    name: "Contract 1",
    color: "#8884d8",
    entries: [
      { day: "monday", executions: 30 },
      { day: "tuesday", executions: 200 },
      { day: "wednesday", executions: 100 },
      { day: "thursday", executions: 400 },
      { day: "friday", executions: 150 },
      { day: "saturday", executions: 250 },
      { day: "sunday", executions: 220 },
    ],
  },
  {
    name: "Contract 2",
    color: "#82ca9d",
    entries: [
      { day: "monday", executions: 20 },
      { day: "tuesday", executions: 100 },
      { day: "wednesday", executions: 200 },
      { day: "thursday", executions: 300 },
      { day: "friday", executions: 250 },
      { day: "saturday", executions: 150 },
      { day: "sunday", executions: 120 },
    ],
  },
];

export default function AlertGraph() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <ScatterChart
        margin={{
          top: 8,
          right: 36,
        }}
      >
        <XAxis
          type="category"
          dataKey="day"
          name="day"
          allowDuplicatedCategory={false}
        />
        <YAxis
          type="number"
          dataKey="executions"
          name="executions"
          label={{
            value: "number of alerts",
            angle: -90,
            position: "insideLeft",
          }}
        />
        <ZAxis type="number" range={[100]} />

        <Tooltip cursor={{ strokeDasharray: "3 3" }} />
        <Legend />

        {data.map((contract) => (
          <Scatter
            key={contract.name}
            name={contract.name}
            data={contract.entries}
            fill={contract.color}
            line
          />
        ))}
      </ScatterChart>
    </ResponsiveContainer>
  );
}
