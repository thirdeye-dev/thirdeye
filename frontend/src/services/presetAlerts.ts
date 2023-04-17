import axios from "@/axios";
import PresetAlert from "@/models/presetAlert";

export async function fetchPresetAlerts() {
  const res = await axios.get<PresetAlert[]>("/monitoring/pre-written-alerts");

  return res.data;
}

export async function createPresetAlert(
  presetAlert: Record<string, string>,
  contractId: number
) {
  // Add the contract Id to body
  // @ts-ignore
  presetAlert.smart_contract = contractId;

  const res = await axios.post<PresetAlert>(
    "/monitoring/set-pre-written-alerts",
    JSON.stringify(presetAlert)
  );

  return res.data;
}
