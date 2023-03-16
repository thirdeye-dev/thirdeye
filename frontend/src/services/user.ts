import { User } from "@/models/user";
import axios from "@/axios";

// TODO: Ideally we should get a single object back, instead of an array with a single child.
export async function fetchCurrentUser(): Promise<User> {
  const response = await axios.get<Array<User>>("/authentication/me");

  return response.data[0];
}
