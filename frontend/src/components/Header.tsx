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

function OrganizationSelector() {
  const router = useRouter();

  const currentOrgId = router.query.id;
  const selectRef = useRef<HTMLInputElement>(null);

  const orgs = useRef<Array<Organization>>([]);
  const [orgEntries, setOrgEntries] = useState<Array<string>>([]);

  const assignOrgs = async () => {
    orgs.current = await fetchOrganizations();

    const orgNames = orgs.current.map((org) => org.name);

    setOrgEntries(orgNames);
  };

  useEffect(() => {
    assignOrgs();
  }, []);

  useEffect(() => {
    if (!currentOrgId) return;

    const currentOrgName = orgs.current.find((org) => org.id === currentOrgId);

    selectRef.current!.value = currentOrgName?.name ?? "";
  }, [currentOrgId]);

  const onOrganizationChange = (orgName: string) => {
    if (!orgName) return;

    const org = orgs.current.find((org) => org.name === orgName);
    if (!org || org.id === currentOrgId) return; // don't do anything if the org is the same or doesn't exist

    router.push(`/org/${org?.id}`);
  };

  return (
    <Select
      ref={selectRef}
      placeholder="Organization"
      data={orgEntries}
      w="40%"
      // @ts-ignore
      onSelect={(e) => onOrganizationChange(e.target.value)}
    />
  );
}

export default function HeaderComponent() {
  const router = useRouter();

  const { colorScheme, toggleColorScheme } = useMantineColorScheme();

  const shouldShowOrganizationSelector =
    router.pathname.includes("/org") ?? false;

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
          {shouldShowOrganizationSelector && <OrganizationSelector />}
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
