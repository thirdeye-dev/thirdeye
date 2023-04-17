import {
  ActionIcon,
  Card,
  Collapse,
  Flex,
  Stack,
  Transition,
  Text,
  createStyles,
  rem,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Prism } from "@mantine/prism";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";

import PresetAlert from "@/models/presetAlert";
import { toSentenceCase } from "@/utils";

const useCardStyles = createStyles((theme) => ({
  card: {
    backgroundColor:
      theme.colorScheme === "dark" ? theme.colors.dark[7] : "white",

    "&:hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[6]
          : theme.colors.gray[0],
    },
  },

  cardSelected: {
    backgroundColor:
      theme.colorScheme === "dark"
        ? theme.colors.dark[6]
        : theme.colors.gray[0],
    border: `2px solid ${theme.colors.blue[6]}`,
  },

  params: {
    display: "flex",
    justifyContent: "space-between",
    padding: `${theme.spacing.sm} ${theme.spacing.lg}`,
    borderTop: `${rem(1)} solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[5] : theme.colors.gray[2]
    }`,
  },

  title: {
    lineHeight: 1,
  },
}));

export default function PresetCard({
  preset,
  isSelected,
  onClick,
}: {
  preset: PresetAlert;
  isSelected: boolean;
  onClick: () => void;
}) {
  const { classes, cx } = useCardStyles();

  const [collapsed, { toggle: toggleCollapse }] = useDisclosure(false);

  const items = preset.params.map((param, idx) => (
    <Stack spacing="xs" key={idx}>
      <Text size="xs" color="dimmed">
        {param.name}
      </Text>
      <Text weight={500} size="sm">
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
      className={cx(classes.card, isSelected && classes.cardSelected)}
    >
      <Card.Section></Card.Section>

      <Flex mt="xl" direction="row" justify="space-between" align="center">
        <Text color="yellow" size="xl" weight={700} className={classes.title}>
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

      <Text my="sm" color="dimmed">
        {preset.description}
      </Text>

      <Card.Section className={classes.params}>{items}</Card.Section>

      <Card.Section>
        <Collapse in={collapsed} p="xs">
          <Prism language="yaml">{preset.alert_yaml}</Prism>
        </Collapse>
      </Card.Section>
    </Card>
  );
}
