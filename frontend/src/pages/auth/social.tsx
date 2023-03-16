import { useRouter } from "next/router";
import { setCookie } from "cookies-next";
import { useEffect } from "react";

export default function Social() {
  const router = useRouter();
  const query = router.query;
  const access_token = query.access;
  const refresh_token = query.refresh;

  useEffect(() => {
    const to_forward = "/dashboard/status";

    const user = {
      access_token,
      refresh_token,
    };

    setCookie("user", JSON.stringify(user), {
      path: "/",
      maxAge: 3600, // Expires after 1hr
      sameSite: true,
    });

    router.push(to_forward);
  }, [access_token, refresh_token, router]);

  return (
    <div>
      <h1>Redirecting...</h1>
    </div>
  );
}
