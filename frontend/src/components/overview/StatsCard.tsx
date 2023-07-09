import { Flex, Group, Text, ThemeIcon } from "@mantine/core";

export default function StatsCard({
  title,
  value,
  icon,
  color,
}: {
  title: string;
  value: number | string;
  icon: any;
  color: string;
}) {
  return (
    <Flex
      p="xl"
      align="center"
      justify="space-between"
      sx={(theme) => ({
        borderBottom: `0.5px solid ${
          theme.colorScheme === "dark"
            ? theme.colors.dark[4]
            : theme.colors.gray[2]
        }`,
        "&:hover": {
          backgroundColor:
            theme.colorScheme === "dark"
              ? theme.colors.dark[6]
              : theme.colors.gray[0],
        },
      })}
    >
      <Group>
        <ThemeIcon size="xl" color={color} variant="outline">
          {icon}
        </ThemeIcon>
        <Text size="lg" weight="bold">
          {title}
        </Text>
      </Group>

      <Text size={typeof value === "string" ? "lg" : "1.8em"} weight="bold">
        {value}
      </Text>
    </Flex>
  );
}
