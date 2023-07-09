import axios from "@/axios";
import { OverviewData } from "@/models/overviewData";

export async function fetchOverviewData(orgId: string, timeMode: string): Promise<OverviewData> {
  const resp = await axios.get<OverviewData>("/monitoring/overview-data", {
    params: {
      owner_organization: orgId,
      time_mode: timeMode
    },
  });

  return resp.data;
}
