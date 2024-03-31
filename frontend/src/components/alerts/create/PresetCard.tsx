import {
  ActionIcon,
  Card,
  Collapse,
  Flex,
  Stack,
  Transition,
  Text,
} from "@mantine/core";
import { CodeHighlight } from "@mantine/code-highlight";
import { useDisclosure } from "@mantine/hooks";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import clsx from "clsx";

import PresetAlert from "@/models/presetAlert";
import { toSentenceCase } from "@/utils";

import classes from "./PresetCard.module.css";

export default function PresetCard({
  preset,
  isSelected,
  onClick,
}: {
  preset: PresetAlert;
  isSelected: boolean;
  onClick: () => void;
}) {
  const [collapsed, { toggle: toggleCollapse }] = useDisclosure(false);

  const items = preset.params.map((param, idx) => (
    <Stack gap="xs" key={idx}>
      <Text size="xs" color="dimmed">
        {param.name}
      </Text>
      <Text fw={500} size="sm">
        {param.type}
      </Text>
    </Stack>
  ));

  return (
    <Card
      onClick={onClick}
      withBorder
      w="30vw"
      padding="lg"
      className={clsx(classes.card, isSelected && classes.cardSelected)}
    >
      <Card.Section></Card.Section>

      <Flex mt="xl" direction="row" justify="space-between" align="center">
        <Text c="yellow" size="xl" fw={700} lh={1}>
          {toSentenceCase(preset.name)}
        </Text>

        <ActionIcon bg="none" onClick={toggleCollapse}>
          <Transition transition="scale-y" mounted={collapsed}>
            {(styles) => <FiChevronUp style={styles} direction="down" />}
          </Transition>

          <Transition transition="scale" mounted={!collapsed}>
            {(styles) => <FiChevronDown style={styles} />}
          </Transition>
        </ActionIcon>
      </Flex>

      <Text my="sm" c="dimmed">
        {preset.description}
      </Text>

      <Card.Section className={classes.params}>{items}</Card.Section>

      <Card.Section>
        <Collapse in={collapsed} p="xs">
          <CodeHighlight language="yaml" code={preset.alert_yaml} />
        </Collapse>
      </Card.Section>
    </Card>
  );
}
