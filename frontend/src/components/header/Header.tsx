import {
  ActionIcon,
  Divider,
  Flex,
  Group,
  Header,
  Space,
  useMantineColorScheme,
} from "@mantine/core";
import { FiMoon, FiSun } from "react-icons/fi";
import Link from "next/link";
import { useRouter } from "next/router";

import Logo from "../Logo";
import OrganizationSelector from "./OrganizationSelector";
import NotificationIsland from "./NotificationIsland";

export default function HeaderComponent() {
  const router = useRouter();

  const { colorScheme, toggleColorScheme } = useMantineColorScheme();

  const shouldShowOrganizationSelector = router.pathname.includes("/org");
  const shouldShowNotificationsIsland = router.pathname.includes("/org");

  return (
    <Header height={"5rem"} fixed>
      <Flex
        direction="row"
        justify="space-between"
        align="center"
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

          {shouldShowOrganizationSelector && <OrganizationSelector />}
        </Group>

        {shouldShowNotificationsIsland && (
          <>
            <NotificationIsland />
            <Space w="4rem" />
          </>
        )}

        <Group>
          <ActionIcon onClick={() => toggleColorScheme()}>
            {colorScheme === "dark" ? <FiSun /> : <FiMoon />}
          </ActionIcon>
        </Group>
      </Flex>
    </Header>
  );
}
