import { Organization } from "@/models/organization";
import axios from "@/axios";

export function createOrganization(organization: {
  name: string;
  slug: string;
}) {
  return axios.post("/org/create", organization);
}
