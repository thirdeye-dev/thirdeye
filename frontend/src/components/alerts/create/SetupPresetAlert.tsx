import { NumberInput, Select, Stack, Switch, TextInput } from "@mantine/core";

import AlertCreateStepLayout from "@/layouts/AlertCreateStepLayout";
import PresetAlert, {
  PresetAlertParam,
  PresetAlertParamType,
} from "@/models/presetAlert";
import { toSentenceCase } from "@/utils";
import { useForm } from "@mantine/form";
import { useEffect, useState } from "react";
import Contract from "@/models/contract";
import { fetchContracts } from "@/services/contracts";

const labelStyling = {
  marginBottom: "0.5rem",
};

function ParamField({ param, ...props }: { param: PresetAlertParam }) {
  const name = toSentenceCase(param.name);

  switch (param.type) {
    case PresetAlertParamType.Integer:
      return (
        <NumberInput
          size="lg"
          label={name}
          required
          styles={{ label: labelStyling }}
          {...props}
        />
      );
    case PresetAlertParamType.Float:
      return (
        <NumberInput
          size="lg"
          label={name}
          precision={2}
          step={0.5}
          required
          styles={{ label: labelStyling }}
          {...props}
        />
      );
    case PresetAlertParamType.String:
      return (
        <TextInput
          size="lg"
          label={name}
          required
          styles={{ label: labelStyling }}
          {...props}
        />
      );
    case PresetAlertParamType.Boolean:
      return <Switch label={name} required styles={{ label: labelStyling }} />;
    case PresetAlertParamType.Date:
      return (
        <TextInput
          size="lg"
          label={name}
          type="date"
          required
          styles={{ label: labelStyling }}
          {...props}
        />
      );
    default:
      return <>unknown param type</>;
  }
}

export default function SetupPresetAlert({
  presetAlert,
  setParams,
  contracts,
  setContract,
}: {
  presetAlert: PresetAlert;
  setParams: (params: Record<string, any>) => void;
  contracts: Contract[];
  setContract: (contract: Contract) => void;
}) {
  const form = useForm({
    initialValues: presetAlert.params.reduce(
      (acc, param) => ({ ...acc, [param.name]: param.default }),
      {}
    ),
  });

  useEffect(() => {
    setParams(form.values);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form, form.values]);

  const onChangeContract = (contractName: string) => {
    const contract = contracts.find(
      (contract) => contract.name === contractName
    );

    if (contract) {
      setContract(contract);
    }
  };

  return (
    <AlertCreateStepLayout title="Setup Preset">
      <form>
        <Stack miw="40vw">
          <Select
            size="lg"
            placeholder="Select a smart contract"
            label="Smart Contract"
            required
            data={contracts.map((contract) => contract.name)}
            onChange={onChangeContract}
            styles={{
              label: labelStyling,
            }}
          />
          {presetAlert.params.map((param, idx) => (
            <ParamField
              key={idx}
              param={param}
              {...form.getInputProps(param.name)}
            />
          ))}
        </Stack>
      </form>
    </AlertCreateStepLayout>
  );
}
