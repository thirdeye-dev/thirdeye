import User from "@/models/user";
import axios from "@/axios";

export async function fetchCurrentUser(): Promise<User> {
  const resp = await axios.get<User>("/authentication/me");

  return resp.data;
}
