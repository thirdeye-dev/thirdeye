import { useRouter } from "next/router";
import { setCookie } from "cookies-next";
import { useEffect } from "react";
import maybeOnboarding from "@/flow/onboarding";
import { fetchCurrentUser } from "@/services/user";

export default function Social() {
  const router = useRouter();

  const query = router.query;
  const access_token = query.access;
  const refresh_token = query.refresh;

  useEffect(() => {
    const to_forward = "/dashboard/status";

    const user_cookie = {
      access_token,
      refresh_token,
    };

    setCookie("user", JSON.stringify(user_cookie), {
      path: "/",
      maxAge: 3600, // Expires after 1hr
      sameSite: true,
    });

    router.push("/flow/post-login");
  }, [access_token, refresh_token, router]);

  return (
    <div>
      <h1>Redirecting...</h1>
    </div>
  );
}
