import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";

import { Select } from "@mantine/core";

import Organization from "@/models/organization";
import { fetchOrganizations } from "@/services/organizations";

export default function OrganizationSelector() {
  const router = useRouter();

  const currentOrgId = router.query.orgId;
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
