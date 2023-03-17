import chooseDefaultOrganization from "@/flow/chooseDefaultOrganization";
import { fetchOrganizations } from "@/services/organizations";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function OrganizationIndex() {
  const router = useRouter();

  const chooseAndRedirect = async () => {
    const orgs = await fetchOrganizations();

    const chosen = chooseDefaultOrganization(orgs);
    router.push(`/org/${chosen.id}`);
  };

  useEffect(() => {
    chooseAndRedirect();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
