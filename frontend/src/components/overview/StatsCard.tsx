import { Flex, Group, Text, ThemeIcon } from "@mantine/core";

import classes from "./StatsCard.module.css";

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
      className={classes.card}
    >
      <Group>
        <ThemeIcon size="xl" color={color} variant="outline">
          {icon}
        </ThemeIcon>
        <Text size="lg" fw="bold">
          {title}
        </Text>
      </Group>

      <Text size={typeof value === "string" ? "lg" : "1.8em"} fw="bold">
        {value}
      </Text>
    </Flex>
  );
}
