import Organization from "./organization";

export default interface User {
  id: number;
  email: string;
  username: string;
  created_at: string;
  updated_at: string;
  avatar: string;
  is_staff: boolean;
  organizations: Array<Organization>;
}
