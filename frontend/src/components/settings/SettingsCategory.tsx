import { Text, Flex, Paper } from "@mantine/core";

export default function SettingsCategory({ title, children, subtitle }: { title: string, children: React.ReactNode, subtitle?: string }) {
  return (
    <Paper withBorder p="xl" radius="md"
        sx={(theme) => ({
          backgroundColor: theme.colorScheme === "dark"
              ? theme.colors.dark[6]
              : theme.colors.gray[0]
        })}
      >
      <Flex direction="column">
        <Flex direction="column" mb="sm" >
          <Text color="yellow" size="1.6rem" weight="bold">{title}</Text>
          <Text color="dimmed" size="sm">{subtitle}</Text>
        </Flex>

        {children}
      </Flex>
    </Paper>
  );
}
