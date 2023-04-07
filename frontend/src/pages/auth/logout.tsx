import { removeUserCookie } from "@/cookies";
import { logoutUser } from "@/services/auth";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Logout() {
  const router = useRouter();

  const performLogout = async () => {
    await logoutUser();
    removeUserCookie();

    router.push("/login");
  };

  useEffect(() => {
    performLogout();
  }, []);

  return null;
}
