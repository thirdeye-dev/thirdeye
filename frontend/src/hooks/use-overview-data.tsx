import useSWR from "swr";

import { OverviewData } from "@/models/overviewData";
import { fetchOverviewData } from "@/services/overview";
import { TimeMode } from "@/models/common";

export default function useOverviewData(
  orgId: string | undefined,
  timeMode: TimeMode | undefined
) {
  const swr = useSWR<OverviewData>(
    ["/monitoring/overview-data", orgId, timeMode],
    ([_, orgId, timeMode]: string[]) => fetchOverviewData(orgId, timeMode),
    {}
  );

  return swr;
}
