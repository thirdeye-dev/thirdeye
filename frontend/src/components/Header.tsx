import {
  ActionIcon,
  Group,
  Header,
  useMantineColorScheme,
} from "@mantine/core";
import Logo from "./Logo";
import { FiMoon, FiSun } from "react-icons/fi";

export default function HeaderComponent() {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const dark = colorScheme === "dark";

  return (
    <Header height={"5rem"}>
      <Group
        position="apart"
        sx={(theme) => ({
          height: "100%",
          width: "100%",
          padding: theme.spacing.md,
        })}
      >
        <Logo />

        <ActionIcon onClick={() => toggleColorScheme()}>
          {colorScheme === "dark" ? <FiSun /> : <FiMoon />}
        </ActionIcon>
      </Group>
    </Header>
  );
}
