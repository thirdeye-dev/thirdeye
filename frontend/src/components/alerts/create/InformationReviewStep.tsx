import AlertCreateStepLayout from "@/layouts/AlertCreateStepLayout";
import { AlertType } from "@/models/alertType";
import Contract from "@/models/contract";
import PresetAlert from "@/models/presetAlert";
import { Stack, Table, Text } from "@mantine/core";

export default function InformationReviewStep({
  alertType,
  presetAlert,
  presetParams,
  contract,
}: {
  alertType: AlertType;
  presetAlert: PresetAlert;
  presetParams: Record<string, any>;
  contract: Contract;
}) {
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
          <tr>
            <td>Alert Type</td>
            <td>{alertType}</td>
          </tr>
          <tr>
            <td>Preset Name</td>
            <td>{presetAlert?.name}</td>
          </tr>
          <tr>
            <td>Preset Description</td>
            <td>{presetAlert?.description}</td>
          </tr>
          <tr>
            <td>Preset Params</td>
            <td>{JSON.stringify(presetParams)}</td>
          </tr>
          <tr>
            <td>Contract Name</td>
            <td>{contract?.name}</td>
          </tr>
          <tr>
            <td>Contract Address</td>
            <td>{contract?.address}</td>
          </tr>
          <tr>
            <td>Contract Chain</td>
            <td>{contract?.chain}</td>
          </tr>
          <tr>
            <td>Contract Network</td>
            <td>{contract?.network}</td>
          </tr>
        </tbody>
      </Table>
    </AlertCreateStepLayout>
  );
}
