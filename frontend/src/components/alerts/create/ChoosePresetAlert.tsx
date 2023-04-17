import { useEffect, useState } from "react";

import { SimpleGrid } from "@mantine/core";

import AlertCreateStepLayout from "@/layouts/AlertCreateStepLayout";
import PresetAlert from "@/models/presetAlert";
import { fetchPresetAlerts } from "@/services/presetAlerts";
import PresetCard from "./PresetCard";

export default function ChoosePresetAlert({
  presetAlert,
  setPresetAlert,
}: {
  presetAlert: PresetAlert | null;
  setPresetAlert: (presetAlert: PresetAlert) => void;
}) {
  const [presets, setPresets] = useState<PresetAlert[]>([]);

  const assignPresets = async () => {
    const presets = await fetchPresetAlerts();

    setPresets(presets);
  };

  useEffect(() => {
    assignPresets();
  }, []);

  return (
    <AlertCreateStepLayout title="Choose Preset">
      <SimpleGrid cols={2} spacing={20}>
        {presets.map((preset, idx) => (
          <PresetCard
            key={idx}
            preset={preset}
            isSelected={preset === presetAlert}
            onClick={() => setPresetAlert(preset)}
          />
        ))}
      </SimpleGrid>
    </AlertCreateStepLayout>
  );
}
