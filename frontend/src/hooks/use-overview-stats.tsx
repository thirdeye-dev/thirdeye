import useSWR from "swr";

import { fetchOverviewStats } from "@/services/overview";
import { TimeMode } from "@/models/common";
import OverviewStats from "@/models/OverviewStats";

export default function useOverviewStats(
  orgId: string | undefined,
  timeMode: TimeMode | undefined
) {
  const swr = useSWR<OverviewStats>(
    ["/monitoring/overview-stats", orgId, timeMode],
    ([_, orgId, timeMode]: string[]) => fetchOverviewStats(orgId, timeMode),
    {}
  );

  return swr;
}
