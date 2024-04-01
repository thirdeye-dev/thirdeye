import { ReactNode } from "react";

import { Stack, Text } from "@mantine/core";

export default function AlertCreateStepLayout({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <Stack w="100%" align="center">
      <Text size="2.2em" weight="bold" my="4%">
        {title}
      </Text>

      {children}
    </Stack>
  );
}
