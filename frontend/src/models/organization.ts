import { OrganizationMembership } from "./organization_membership";

export class Organization {
  id: string; // uuid
  name: string;
  is_member: boolean;
  created_at: string;
  updated_at: string;
  memberships: OrganizationMembership[];

  constructor(
    id: string,
    name: string,
    is_member: boolean,
    created_at: string,
    updated_at: string,
    memberships: OrganizationMembership[]
  ) {
    this.id = id;
    this.name = name;
    this.is_member = is_member;
    this.created_at = created_at;
    this.updated_at = updated_at;
    this.memberships = memberships;
  }
}
