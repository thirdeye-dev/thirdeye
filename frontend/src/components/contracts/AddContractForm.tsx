import { Chain, Network } from "@/models/contract";
import { createContract } from "@/services/contracts";
import { Button, SegmentedControl, Select, Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";

const ethContractAddressRegex = new RegExp(/^0x([A-Fa-f0-9]{40})$/);

export default function AddContractForm({
  organizationId,
  afterSuccess,
}: {
  organizationId: string;
  afterSuccess: () => void;
}) {
  const form = useForm({
    initialValues: {
      name: "",
      address: "",
      chain: Chain.ETH,
      network: Network.MAINNET,
    },
    validate: (vals) => {
      const validateEthAddress = () => {
        if (vals.address.length === 0) return "address is required";

        if (!ethContractAddressRegex.test(vals.address)) {
          return "invalid eth contract address";
        }

        return null;
      }

      return {
        name: vals.name.length > 0 ? null : "name can't be empty",
        address: validateEthAddress(), // NOTE: validate other chains if added
      }
    }
  });

  const handleOnSubmit = async (values: Record<string, unknown>) => {
    if (!form.isValid()) return;

    const response = await createContract(values, organizationId);

    if (response) {
      afterSuccess();
    }
  };

  return (
    <form onSubmit={form.onSubmit((values) => handleOnSubmit(values))}>
      <Stack spacing="lg">
        <SegmentedControl
          style={{
            alignSelf: "center",
          }}
          data={Object.entries(Chain).map(([k, v]) => ({
            label: k,
            value: v
          }))}
          {...form.getInputProps("chain")}
        />

        <TextInput
          placeholder="Contract Name"
          name="name"
          type="text"
          {...form.getInputProps("name")}
        />
        <TextInput
          placeholder="Contract Address"
          name="address"
          type="text"
          {...form.getInputProps("address")}
        />
        
        <Select
          placeholder="Select a network"
          name="network"
          data={Object.entries(Network).map(([k, v]) => ({
            label: k,
            value: v
          }))}
          {...form.getInputProps("network")}
        />

        <Button type="submit" variant={"gradient"}>
          Add
        </Button>
      </Stack>
    </form>
  );
}
