import { useRouter } from "next/router";
import { setCookie } from "cookies-next";
import { useEffect } from "react";
import maybeOnboarding from "@/flow/onboarding";
import { fetchCurrentUser } from "@/services/user";
import { setUserCookie } from "@/cookies";

export default function Social() {
  const router = useRouter();

  const query = router.query;
  const access_token = query.access as string;
  const refresh_token = query.refresh as string;

  useEffect(() => {
    if (!access_token || !refresh_token) return;

    setUserCookie(access_token, refresh_token);

    router.push("/flow/post-login");
  }, [access_token, refresh_token, router]);

  return (
    <div>
      <h1>Redirecting...</h1>
    </div>
  );
}
