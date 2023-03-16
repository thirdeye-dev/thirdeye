import { User } from "@/models/user";
import axios from "@/axios";

// TODO: Ideally we should get a single object back, instead of an array with a single child.
export async function fetchCurrentUser(): Promise<User | null> {
  try {
    const response = await axios.get<User>("/authentication/me");

    return response.data;
  } catch (error) {
    return null;
  }
}
