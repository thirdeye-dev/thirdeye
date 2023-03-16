export class Organization {
  id: number;
  name: string;
  is_admin: boolean;

  constructor(id: number, name: string, is_admin: boolean) {
    this.id = id;
    this.name = name;
    this.is_admin = is_admin;
  }
}
