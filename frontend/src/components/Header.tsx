import {
  ActionIcon,
  Divider,
  Group,
  Header,
  Select,
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
        <Group>
          <Link href="/">
            <Logo />
          </Link>

          <Divider orientation="vertical" />
          <Select placeholder="Organization" data={["one", "two"]} w="40%" />
        </Group>

        <Group>
          <ActionIcon onClick={() => toggleColorScheme()}>
            {colorScheme === "dark" ? <FiSun /> : <FiMoon />}
          </ActionIcon>
        </Group>
      </Group>
    </Header>
  );
}
