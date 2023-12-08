import Organization from "@/models/organization";
import axios from "@/axios";

export async function createOrganization(organization: { name: string }) {
  const response = await axios.post(
    "/organizations/my",
    JSON.stringify(organization)
  );

  return response.data;
}

export async function fetchOrganizations(): Promise<Organization[]> {
  const resp = await axios.get<Organization[]>("/organizations/my");

  return resp.data;
}
