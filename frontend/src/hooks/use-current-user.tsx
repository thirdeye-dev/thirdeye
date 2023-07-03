import User from "@/models/user";
import { fetchCurrentUser } from "@/services/user";
import useSWR from "swr";

export default function useCurrentUser() {
  const { data, ...swr } = useSWR<User>("/authentication/me", fetchCurrentUser);

  return {
    user: data,
    ...swr,
  };
}
