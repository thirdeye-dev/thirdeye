import { Box, Code, Flex, Stack, Text } from "@mantine/core";
import dayjs from "dayjs";
import { BsRecordCircle } from "react-icons/bs";

// FIXME: construct a type for this
export default function LiveFeedItem({ alert }: any) {
  const getColorByTag = (tag: string) => {
    switch (tag) {
      case "success":
        return "green";
      case "warn":
        return "yellow";
      case "error":
        return "red";
      default:
        return "gray";
    }
  };

  return (
    <Box
      p="md"
      sx={(theme) => ({
        "&:hover": {
          backgroundColor:
            theme.colorScheme === "dark"
              ? theme.colors.dark[5]
              : theme.colors.gray[0],
          transition: "background-color 0.2s ease-in-out",
        },
        borderBottom: `1px solid ${
          theme.colorScheme === "dark"
            ? theme.colors.dark[4]
            : theme.colors.gray[2]
        }`,
      })}
    >
      <Stack>
        <Flex direction="row" justify="flex-start" gap="md">
          <BsRecordCircle size="1.5em" color={getColorByTag(alert.tag)} />

          <Code>{alert.contract_name}</Code>
          <Text size="sm" weight="bold" color="gray">
            triggered alert
          </Text>
          <Code>{alert.alert_name}</Code>
        </Flex>

        <Text>{alert.body}</Text>

        <Text size="sm" color="gray">
          {dayjs(alert.executed_at).fromNow()}
        </Text>
      </Stack>
    </Box>
  );
}
