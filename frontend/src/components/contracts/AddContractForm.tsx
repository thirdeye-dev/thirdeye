import { createContract } from "@/services/contracts";
import { Button, Input, Select, Stack } from "@mantine/core";
import { useForm } from "@mantine/form";

export default function AddContractForm({
  afterSuccess,
}: {
  afterSuccess: () => void;
}) {
  const chains = ["ETH", "POLYGON"];
  const networks = ["MAINNET", "SEPOLIA", "GOERLI"];

  const form = useForm({
    initialValues: {
      name: "",
      address: "",
      chain: "",
      network: "",
    },
  });

  const handleOnSubmit = async (values: Record<string, unknown>) => {
    const response = await createContract(values);

    if (response) {
      afterSuccess();
    }
  };

  return (
    <form onSubmit={form.onSubmit((values) => handleOnSubmit(values))}>
      <Stack spacing="lg">
        <Stack>
          <Input
            placeholder="Contract Name"
            name="name"
            type="text"
            {...form.getInputProps("name")}
          />
          <Input
            placeholder="Contract Address"
            name="address"
            type="text"
            {...form.getInputProps("address")}
          />
          <Select
            placeholder="Select a chain"
            name="chain"
            data={chains}
            {...form.getInputProps("chain")}
          />
          <Select
            placeholder="Select a network"
            name="network"
            data={networks}
            {...form.getInputProps("network")}
          />
        </Stack>

        <Button type="submit" variant={"gradient"}>
          Add
        </Button>
      </Stack>
    </form>
  );
}
