import Organization from "@/models/organization";
import { fetchOrganizations } from "@/services/organizations";
import useSWR from "swr";

export default function useOrgs() {
  const { data, ...swr } = useSWR<Organization[]>(
    "/organizations/my",
    fetchOrganizations
  );

  return {
    orgs: data,
    ...swr,
  };
}
