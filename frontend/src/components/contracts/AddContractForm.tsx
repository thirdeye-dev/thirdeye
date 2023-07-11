import { Chain, Network, ObjectType } from "@/models/contract";
import { createContract } from "@/services/contracts";
import { Button, SegmentedControl, Select, Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";

const flowAccountAddressRegex = new RegExp(/^0x{0,1}[0-9a-fA-F]{16}/);
const flowContractAddressRegex = new RegExp(/^[A-Z]\.[0-9a-fA-F]{16}\..*$/);

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
      object_type: ObjectType.CONTRACT,
      name: "",
      address: "",
      chain: Chain.FLOW,
      network: Network.MAINNET,
    },
    validate: (vals) => {
      const validateObjectType = () => {
        if (vals.chain === Chain.ETH && vals.object_type === ObjectType.ACCOUNT) {
          return "account type not supported on chain eth"
        }

        return null;
      }

      const validateEthAddress = () => {
        if (vals.address.length === 0) return "address is required";

        if (!ethContractAddressRegex.test(vals.address)) {
          return "invalid eth contract address";
        }

        return null;
      }

      const validateFlowAddress = () => {
        if (vals.address.length === 0) return "address is required";

        switch (vals.object_type) {
          case ObjectType.CONTRACT:
            if (!flowContractAddressRegex.test(vals.address)) {
              return "invalid flow contract address";
            }
            break;
          case ObjectType.ACCOUNT:
            if (!flowAccountAddressRegex.test(vals.address)) {
              return "invalid flow account address";
            }
            break;
        }

        return null;
      }

      const validateNetwork = () => {
        if (vals.chain === Chain.FLOW && vals.network !== Network.MAINNET && vals.network !== Network.TESTNET) {
          return "unsupported network for chain flow";
        }

        return null;
      }

      return {
        object_type: validateObjectType(),
        name: vals.name.length > 0 ? null : "name can't be empty",
        address: vals.chain === Chain.FLOW ? validateFlowAddress() : validateEthAddress(),
        network: validateNetwork()
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

        <Select
          placeholder="Select object type"
          name="object_type"
          data={Object.entries(ObjectType).map(([k, v]) => ({
            label: k,
            value: v
          }))}
          {...form.getInputProps("object_type")}
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
