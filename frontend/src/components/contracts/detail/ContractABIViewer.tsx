import { Text, Button, Flex, Modal } from "@mantine/core";
import { CodeHighlight } from "@mantine/code-highlight";
import { notifications } from "@mantine/notifications";
import { useDisclosure } from "@mantine/hooks";
import { AiFillCheckCircle } from "react-icons/ai";

import useContractABI from "@/hooks/use-contract-abi";
import AddContractABIForm from "@/components/contracts/detail/AddContractABIForm";

export default function ContractABIViewer({
  contractId,
}: {
  contractId: string | undefined;
}) {
  const { abi, mutate } = useContractABI(contractId);

  const [isAddModalOpened, { open: openAddModal, close: closeAddModal }] =
    useDisclosure(false);

  const afterAddABI = () => {
    closeAddModal();
    mutate();

    notifications.show({
      title: "Success",
      message: "Contract ABI added successfully",
      color: "green",
      icon: <AiFillCheckCircle />,
    });
  };

  if (!abi) {
    return (
      <>
        <Modal
          opened={isAddModalOpened}
          onClose={closeAddModal}
          title="Add Contract ABI"
          centered
        >
          <AddContractABIForm
            contractId={contractId}
            afterSuccess={afterAddABI}
          />
        </Modal>
        <Flex
          h="100%"
          direction="column"
          justify="center"
          align="center"
          gap="md"
        >
          <Text color="gray.7" size="2em" fw="bold" ta="center">
            No ABI added yet
          </Text>

          <Button
            size="md"
            variant="light"
            color="green"
            onClick={openAddModal}
          >
            Add Now
          </Button>
        </Flex>
      </>
    );
  }

  return (
    <CodeHighlight
      h="100%"
      language="json"
      code={JSON.stringify(abi)}
      copyLabel="Copy ABI"
    />
  );
}
