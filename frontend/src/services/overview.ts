import axios from "@/axios";
import { OverviewData } from "@/models/overviewData";
import OverviewStats from "@/models/OverviewStats";

export async function fetchOverviewData(
  orgId: string,
  timeMode: string
): Promise<OverviewData> {
  const resp = await axios.get<OverviewData>("/monitoring/overview-data", {
    params: {
      owner_organization: orgId,
      time_mode: timeMode,
    },
  });

  return resp.data;
}

export async function fetchOverviewStats(
  orgId: string,
  timeMode: string
): Promise<OverviewStats> {
  const resp = await axios.get<OverviewStats>("/monitoring/overview-stats", {
    params: {
      owner_organization: orgId,
      time_mode: timeMode,
    },
  });

  return resp.data;
}
