export default interface OrganizationMembership {
  id: number;
  user: number;
  organization: string;
  is_admin: boolean;
  is_owner: boolean;
  created_at: string;
  updated_at: string;
}
