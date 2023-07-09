import useSWR from "swr";

import { OverviewData } from "@/models/overviewData";
import { fetchOverviewData } from "@/services/overview";

export default function useOverviewData(orgId: string | undefined, timeMode: "weekly" | "yearly" | undefined) {
  const swr = useSWR<OverviewData>(
    ["/monitoring/overview-data", orgId, timeMode],
    ([_, orgId, timeMode]: string[]) => fetchOverviewData(orgId, timeMode)
  );

  return swr;
}
