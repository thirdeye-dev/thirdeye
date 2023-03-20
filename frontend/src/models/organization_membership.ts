export class OrganizationMembership {
  id: number;
  user: number;
  organization: string;
  is_admin: boolean;
  is_owner: boolean;
  created_at: string;
  updated_at: string;

  constructor(
    id: number,
    user: number,
    organization: string,
    is_admin: boolean,
    is_owner: boolean,
    created_at: string,
    updated_at: string
  ) {
    this.id = id;
    this.user = user;
    this.organization = organization;
    this.is_admin = is_admin;
    this.is_owner = is_owner;
    this.created_at = created_at;
    this.updated_at = updated_at;
  }
}
