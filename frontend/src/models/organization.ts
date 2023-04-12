import OrganizationMembership from "./membership";

export default interface Organization {
  id: string; // uuid
  name: string;
  is_member: boolean;
  created_at: string;
  updated_at: string;
  memberships: OrganizationMembership[];
}
