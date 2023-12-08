import useSWR from "swr";

import Alert from "@/models/alert";
import { fetchAlertsByContract } from "@/services/alerts";

export default function useAlerts(contractId: string) {
  // FIXME: technically no need for a custom fetcher here
  // but keeping it for consistency, until we have more generic fetchers
  const { data, ...swr } = useSWR<Alert[]>(
    [`/monitoring/contract/${contractId}`, contractId],
    ([_key, contractId]: string[]) =>
      fetchAlertsByContract(parseInt(contractId)),
    {}
  );

  return {
    alerts: data,
    ...swr,
  };
}
