import {
  ActionIcon,
  Group,
  Header,
  useMantineColorScheme,
} from "@mantine/core";
import Logo from "./Logo";
import { FiMoon, FiSun } from "react-icons/fi";
import Link from "next/link";

export default function HeaderComponent() {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();

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
        <Link href="/">
          <Logo />
        </Link>

        <ActionIcon onClick={() => toggleColorScheme()}>
          {colorScheme === "dark" ? <FiSun /> : <FiMoon />}
        </ActionIcon>
      </Group>
    </Header>
  );
}
