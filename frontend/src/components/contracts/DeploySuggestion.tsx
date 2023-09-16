import { validateEthereumAddress } from "@/utils";
import { Text, Flex, TextInput, Divider, Group, Button } from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { AiOutlineCheck } from "react-icons/ai";

const addCatchAllAlert = async (address: string) => {
  notifications.show({
    id: "alert-for-sample-contract",
    title: "Setup Alert",
    message: "Added a catch-all alert for sample contract",
    icon: <AiOutlineCheck />
  });
}

const saveContract = async (address: string) => {
  notifications.show({
    id: "save-sample-contract",
    title: "Add Contract",
    message: "Added Contract to ThirdEye",
    icon: <AiOutlineCheck />
  });
}

const deploySampleContract = async () => { 
  const address = "0x0000000000000000000000000000000000000000";

  notifications.show({
    id: "deploy-sample-contract",
    loading: true,
    title: "Deploying Contract",
    message: "This might take a while",
    autoClose: false,
    withCloseButton: false
  });

  await new Promise(r => setTimeout(r, 2000));

  notifications.update({
    id: "deploy-sample-contract",
    loading: false,
    title: "Deployed Contract",
    message: "Your sample contract has been deployed",
    icon: <AiOutlineCheck />
  });

  return address;
}

export default function DeploySuggestion({ close }: { close: () => void; }) {
  const form = useForm({
    initialValues: {
      ownerAddress: "",
    },
    validate: {
      ownerAddress: (val) => {
        if (!val) return "address is required";

        if (!validateEthereumAddress(val)) return "invalid address";
      }
    }
  });

  const handleContinue = async () => {
    if (!form.isValid()) {
      form.validate();
      return;
    };

    const ownerAddress = form.values.ownerAddress;
    
    // Close the modal
    close();

    // Deploy the contract
    const address = await deploySampleContract();

    // Save as a contract to thirdeye
    await saveContract(address);

    // Setup a catch-all alert on contract
    await addCatchAllAlert(address);

    // Finalise notifs
    notifications.show({
      id: "finalise-sample-contract",
      title: "All done",
      message: `Deployed contract address: ${address}`,
      icon: <AiOutlineCheck />,
      autoClose: false
    });
  }

  return (
    <Flex direction="column" gap="sm">
      <Flex direction="column">
        <Text mb="md">To quickly try out ThirdEye — Let's have a contract deployed for you to monitor?</Text>

        <form onSubmit={form.onSubmit(_ => handleContinue())}>
          <TextInput label="Owner Address" placeholder="0x"
            {...form.getInputProps("ownerAddress")}
          />
        </form>
      </Flex>

      <Text
        variant="gradient"
        sx={{
          alignSelf: "end"
        }}
      >Powered by Bunzz</Text>

      <Divider />

      <Group
        sx={{
          alignSelf: "end"
        }}
      >
        <Button variant="gradient" onClick={handleContinue}>Continue</Button>
        <Button color="gray" onClick={close}>Skip</Button>
      </Group>
    </Flex>
  )
}
