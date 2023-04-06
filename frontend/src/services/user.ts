import { User } from "@/models/user";
import axios from "@/axios";

export async function fetchCurrentUser(): Promise<User | null> {
  try {
    const response = await axios.get<User>("/authentication/me");

    return response.data;
  } catch (error) {
    return null;
  }
}
