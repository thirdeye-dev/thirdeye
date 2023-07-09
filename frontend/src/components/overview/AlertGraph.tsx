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

import { OverviewContract, OverviewData } from "@/models/overviewData";
import useOverviewData from "@/hooks/use-overview-data";

export default function AlertGraph({ orgId }: { orgId: string | undefined }) {
  let { data, isLoading } = useOverviewData(orgId, "weekly");

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (data?.every(e => e.entries.length === 0)) {
    return <div>No entries found for contracts</div>
  }

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

        {data?.map((contract: OverviewContract) => (
          <Scatter
            key={contract.id}
            name={contract.name}
            data={contract.entries}
            fill={'#' + Math.floor(Math.random() * 16777215).toString(16)} // FIXME: Ideally, the color should come from backend. 
            line
          />
        ))}
      </ScatterChart>
    </ResponsiveContainer>
  );
}
