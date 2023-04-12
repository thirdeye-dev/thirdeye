import Organization from "@/models/organization";

export default function chooseDefaultOrganization(orgs: Array<Organization>) {
  // TODO: choose this based on the user's preferences
  // For now, just choose the first one

  return orgs[0];
}
