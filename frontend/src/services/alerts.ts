import axios from "@/axios";
import Alert from "@/models/alert";

export async function fetchAlertsByContract(contractId: number) {
  const resp = await axios.get<Alert[]>(
    `monitoring/contract/${contractId}/alerts`
  );

  return resp.data;
}

export async function createAlert(
  alert: Partial<Alert>,
  orgId: string,
  contractId: number
) {
  // FIXME: Figure out the typings
  // @ts-ignore
  alert.owner_organization = orgId;
  // @ts-ignore
  alert.smart_contract = contractId;

  const response = await axios.post("monitoring/alerts", JSON.stringify(alert));

  return response.data;
}
