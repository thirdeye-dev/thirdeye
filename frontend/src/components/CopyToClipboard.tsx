import { Button, Flex, Paper, Tooltip, Text } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { AiFillCopy } from "react-icons/ai";

export default function CopyToClipboard({
  textToCopy,
}: {
  textToCopy: string;
}) {
  const copy = (text: string) => {
    navigator.clipboard.writeText(text);

    notifications.show({
      title: "Copied",
      message: "Address copied to clipboard",
      color: "green",
      icon: <AiFillCopy />,
    });
  };

  return (
    <Paper withBorder radius="md" shadow="sm" p="md" my="md" w="100%">
      <Flex justify={"space-between"} align="center">
        <Text size="sm" weight={500} ff="monospace">
          {textToCopy}
        </Text>

        <Tooltip label="Add to clipboard" color="gray">
          <Button
            size="xs"
            variant="subtle"
            color="green"
            onClick={() => copy(textToCopy)}
          >
            <AiFillCopy size={"1rem"} />
          </Button>
        </Tooltip>
      </Flex>
    </Paper>
  );
}
