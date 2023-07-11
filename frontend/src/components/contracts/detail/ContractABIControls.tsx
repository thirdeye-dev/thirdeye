import { useSWRConfig } from "swr";

import { Text, Button, Flex } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { AiFillCheckCircle, AiOutlineClose } from "react-icons/ai";

import { deleteContractABI } from "@/services/contracts";
import useContractABI from "@/hooks/use-contract-abi";

export default function ContractABIControls({
  contractId,
}: {
  contractId: string | undefined;
}) {
  const { mutate } = useSWRConfig();
  const { abi } = useContractABI(contractId);

  const handleDelete = async () => {
    await deleteContractABI(parseInt(contractId!));
    mutate(["/smartcontract/get_abi", contractId]); // for revalidation of data

    notifications.show({
      title: "Success",
      message: "Contract ABI deleted successfully",
      color: "green",
      icon: <AiFillCheckCircle />,
    });
  };

  return (
    <Flex p="md" direction="row" justify="space-between">
      <Text size="2em" color="yellow" weight="bold">
        ABI
      </Text>
      {abi ? (
        <Button
          color="gray"
          variant="outline"
          leftIcon={<AiOutlineClose />}
          onClick={handleDelete}
        >
          Remove
        </Button>
      ) : (
        <></>
      )}{" "}
      {/* NOTE: for some unknown reason, the ?? doesn't seem to be working */}
    </Flex>
  );
}
