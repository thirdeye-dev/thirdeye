import User from "@/models/user";
import axios from "@/axios";

export async function fetchCurrentUser(): Promise<User> {
  const resp = await axios.get<User>("/authentication/me");

  return resp.data;
}

export async function setWalletAddress(walletAddress: string) {
  const resp = await axios.get("/authentication/set_wallet_address", {
    params: {
      wallet_address: walletAddress
    }
  })

  return resp.data
}
