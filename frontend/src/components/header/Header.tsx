import Link from "next/link";
import { useRouter } from "next/router";

import {
  ActionIcon,
  Divider,
  Flex,
  Group,
  Space,
  Tooltip,
  useMantineColorScheme,
} from "@mantine/core";
import { FiMoon, FiSun } from "react-icons/fi";

import OrganizationSelector from "./OrganizationSelector";
import NotificationIsland from "./NotificationIsland";
import Logo from "../Logo";

export default function HeaderComponent() {
  const router = useRouter();

  const { colorScheme, toggleColorScheme } = useMantineColorScheme();

  const shouldShowOrganizationSelector = router.pathname.includes("/org");
  const shouldShowNotificationsIsland = router.pathname.includes("/org");

  return (
    <Flex
      direction="row"
      justify="space-between"
      align="center"
      h="100%"
      w="100%"
      p="md"
    >
      <Group>
        <Link href="/">
          <Logo />
        </Link>

        {shouldShowOrganizationSelector && (
          <>
            <Divider orientation="vertical" />
            <OrganizationSelector />
          </>
        )}
      </Group>

      {shouldShowNotificationsIsland && (
        <>
          <NotificationIsland />
          <Space w="4rem" />
        </>
      )}

      <ActionIcon
        size="lg"
        variant="subtle"
        onClick={() => toggleColorScheme()}
      >
        {colorScheme === "dark" ? <FiSun /> : <FiMoon />}
      </ActionIcon>
    </Flex>
  );
}
