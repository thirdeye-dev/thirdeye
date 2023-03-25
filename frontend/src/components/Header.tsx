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
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { fetchOrganizations } from "@/services/organizations";
import { Organization } from "@/models/organization";

export default function HeaderComponent() {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const router = useRouter();

  const shouldShowOrganizationSelector =
    router.pathname.includes("/org") ?? false;

  const orgs = useRef<Array<Organization>>([]);
  const [orgEntries, setOrgEntries] = useState<Array<string>>([]);

  const assignOrgs = async () => {
    orgs.current = await fetchOrganizations();

    const orgNames = orgs.current.map((org) => org.name);

    setOrgEntries(orgNames);
  };

  useEffect(() => {
    if (!shouldShowOrganizationSelector) return;

    assignOrgs();
  }, [shouldShowOrganizationSelector]);

  const onOrganizationChange = (orgName: string) => {
    if (!orgName) return;

    const org = orgs.current.find((org) => org.name === orgName);

    router.push(`/org/${org?.id}`);
  };

  return (
    <Header height={"5rem"} fixed>
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
          {shouldShowOrganizationSelector && (
            <Select
              placeholder="Organization"
              data={orgEntries}
              w="40%"
              onSelect={(e) => onOrganizationChange(e.target.value)}
            />
          )}
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
