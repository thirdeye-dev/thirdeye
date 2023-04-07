import axios from "@/axios";

export async function logoutUser() {
  const resp = await axios.post("/authentication/logout");

  return resp.data;
}
