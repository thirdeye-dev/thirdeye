import { forwardRef, useEffect, useState } from "react";
import { useRouter } from "next/router";

import { Avatar, Group, Select, SelectItemProps, Text } from "@mantine/core";

import useOrgs from "@/hooks/use-orgs";

function SelectItem({ label, ...others }: SelectItemProps) {
  return (
    <div {...others}>
      <Group noWrap>
        <Avatar variant="outline" color="green" alt={label?.toString()}>
          {label?.toString().at(0)}
        </Avatar>

        <Text size="sm">{label}</Text>
      </Group>
    </div>
  );
}

export default function OrganizationSelector() {
  const router = useRouter();

  const currentOrgId = router.query.orgId as string;
  const { orgs } = useOrgs();

  const [selectValue, setSelectValue] = useState<string | null>(null);

  useEffect(() => {
    if (!currentOrgId) return;

    setSelectValue(currentOrgId); // whenever the orgId changes in the URL, we want to update the selectValue
  }, [currentOrgId]);

  const onOrganizationChange = (orgId: string) => {
    if (!orgId) return;

    if (orgId === selectValue) return; // don't do anything if the org is the same

    setSelectValue(orgId);
    router.push(`/org/${selectValue}`); // update the URL to match the selected org
  };

  const data = orgs?.map((org) => ({ value: org.id, label: org.name })) ?? [];

  return (
    <Select
      w="50%"
      placeholder="Organization"
      nothingFound="No organizations"
      itemComponent={SelectItem}
      value={selectValue}
      data={data}
      onChange={(orgId) => onOrganizationChange(orgId!)}
    />
  );
}
