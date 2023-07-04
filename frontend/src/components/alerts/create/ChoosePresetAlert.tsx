import { useEffect, useState } from "react";

import { SimpleGrid } from "@mantine/core";

import AlertCreateStepLayout from "@/layouts/AlertCreateStepLayout";
import PresetAlert from "@/models/presetAlert";
import { fetchPresetAlerts } from "@/services/presetAlerts";
import PresetCard from "./PresetCard";
import usePresetAlerts from "@/hooks/use-preset-alerts";

export default function ChoosePresetAlert({
  presetAlert,
  setPresetAlert,
}: {
  presetAlert: PresetAlert | null;
  setPresetAlert: (presetAlert: PresetAlert) => void;
}) {
  const { presets } = usePresetAlerts();

  return (
    <AlertCreateStepLayout title="Choose Preset">
      <SimpleGrid cols={2} spacing={20}>
        {presets?.map((preset, idx) => (
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
