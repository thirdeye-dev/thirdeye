import chooseDefaultOrganization from "@/flow/chooseDefaultOrganization";
import useOrgs from "@/hooks/use-orgs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function OrganizationIndex() {
  const router = useRouter();
  const { orgs } = useOrgs();

  useEffect(() => {
    if (!orgs) return;

    const defaultOrg = chooseDefaultOrganization(orgs);

    router.push(`/org/${defaultOrg.id}`);
  }, [orgs, router]);

  return null;
}
