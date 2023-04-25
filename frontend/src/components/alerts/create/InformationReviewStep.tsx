import AlertCreateStepLayout from "@/layouts/AlertCreateStepLayout";
import { AlertType } from "@/models/alertType";
import Contract from "@/models/contract";
import PresetAlert from "@/models/presetAlert";
import { Stack, Table, Text } from "@mantine/core";

export default function InformationReviewStep({
  alertType,
  presetAlert,
  presetParams,
  customName,
  customDescription,
  customYaml,
  contract,
}: {
  alertType: AlertType;
  presetAlert: PresetAlert;
  presetParams: Record<string, any>;
  customName: string;
  customDescription: string;
  customYaml: string;
  contract: Contract;
}) {
  const rows = [
    {
      key: "Alert Type",
      value: alertType,
    },
    {
      key: "Preset Name",
      value: presetAlert?.name,
      condition: alertType === AlertType.Preset,
    },
    {
      key: "Preset Description",
      value: presetAlert?.description,
      condition: alertType === AlertType.Preset,
    },
    {
      key: "Preset Params",
      value: JSON.stringify(presetParams),
      condition: alertType === AlertType.Preset,
    },
    {
      key: "Custom Name",
      value: customName,
      condition: alertType === AlertType.Custom,
    },
    {
      key: "Custom Description",
      value: customDescription,
      condition: alertType === AlertType.Custom,
    },
    {
      key: "Custom YAML",
      value: customYaml,
      condition: alertType === AlertType.Custom,
    },
    {
      key: "Contract Name",
      value: contract?.name,
    },
    {
      key: "Contract Address",
      value: contract?.address,
    },
    {
      key: "Contract Chain",
      value: contract?.chain,
    },
    {
      key: "Contract Network",
      value: contract?.network,
    },
  ];

  return (
    <AlertCreateStepLayout title="Review Information">
      <Table>
        <thead>
          <tr>
            <th>Key</th>
            <th>Value</th>
          </tr>
        </thead>

        <tbody>
          {rows.map((row) => {
            if (row.condition === false) return;

            return (
              <tr key={row.key}>
                <td>{row.key}</td>
                <td>{row.value}</td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </AlertCreateStepLayout>
  );
}
