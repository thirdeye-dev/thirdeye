import axios from "@/axios";
import Alert from "@/models/alert";

export async function fetchAlertsByContract(contractId: number) {
  const response = await axios.get<Alert[]>(
    `monitoring/contract/${contractId}/alerts`
  );

  return response.data;
}
