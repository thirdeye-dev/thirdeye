/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { IconPower } from "@tabler/icons";
import { UnstyledButton, Group, Text, Box, useMantineTheme } from "@mantine/core";

export function User() {
  const theme = useMantineTheme();
  const [loginState, setLoginStateRole] = useState("Log Out");

  return (
    <Box
      sx={{
        borderTop: `1px solid ${theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[2]}`,
      }}
    >
      <UnstyledButton
        sx={{
          display: "block",
          width: "100%",
          padding: theme.spacing.md,
          borderRadius: theme.radius.sm,
          color: theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,

          "&:hover": {
            backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.colors.gray[0],
          },
        }}
      >
        <Group>
          <Box sx={{ flex: 1 }}>
            <Text color="dimmed" size="xs">
              {loginState}
            </Text>
          </Box>

          {theme.dir === "ltr" ? <IconPower size={18} /> : <IconPower size={18} />}
        </Group>
      </UnstyledButton>
    </Box>
  );
}
