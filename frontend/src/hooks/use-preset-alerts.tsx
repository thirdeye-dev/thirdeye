import useSWR from "swr";

import { fetchPresetAlerts } from "@/services/presetAlerts";
import PresetAlert from "@/models/presetAlert";

export default function usePresetAlerts() {
  // FIXME: technically no need for a custom fetcher here
  // but keeping it for consistency, until we have more generic fetchers
  const { data, ...swr } = useSWR<PresetAlert[]>(
    "/monitoring/pre-written-alerts",
    fetchPresetAlerts
  );

  return {
    presets: data,
    ...swr,
  };
}
