import { Organization } from "./organization";

export class User {
  id: number;
  email: string;
  username: string;
  created_at: string;
  updated_at: string;
  avatar: string;
  is_staff: boolean;
  organizations: Array<Organization>;

  constructor(
    id: number,
    email: string,
    username: string,
    created_at: string,
    updated_at: string,
    avatar: string,
    is_staff: boolean,
    organizations: Array<Organization>
  ) {
    this.id = id;
    this.email = email;
    this.username = username;
    this.created_at = created_at;
    this.updated_at = updated_at;
    this.avatar = avatar;
    this.is_staff = is_staff;
    this.organizations = organizations;
  }
}
