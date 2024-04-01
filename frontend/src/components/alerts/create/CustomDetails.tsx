import AlertCreateStepLayout from "@/layouts/AlertCreateStepLayout";
import Contract from "@/models/contract";
import { Select, Stack, TextInput, Textarea } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useEffect } from "react";

// FIXME: find a way to make this global to all inputs
const labelStyling = {
  marginBottom: "0.5rem",
};

export default function CustomDetails({
  setName,
  setDescription,
  contracts,
  setContract,
}: {
  setName: (name: string) => void;
  setDescription: (description: string) => void;
  contracts: Contract[];
  setContract: (contract: Contract) => void;
}) {
  const form = useForm({
    initialValues: {
      name: "",
      description: "",
    },
  });

  useEffect(() => {
    setName(form.values.name);
    setDescription(form.values.description);

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
    <AlertCreateStepLayout title="Setup Details">
      <form>
        <Stack miw="40vw">
          <TextInput
            size="lg"
            label="Alert Name"
            required
            styles={{
              label: labelStyling,
            }}
            {...form.getInputProps("name")}
          />
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
          <Textarea
            minRows={5}
            size="lg"
            label="Description"
            styles={{
              label: labelStyling,
            }}
            {...form.getInputProps("description")}
          />
        </Stack>
      </form>
    </AlertCreateStepLayout>
  );
}
