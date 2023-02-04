/* eslint-disable no-unused-vars */
/* eslint-disable camelcase */
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useCookies } from "react-cookie";

export default function Social() {
  const router = useRouter();
  const { query } = router;

  console.log(query);

  const access_token = query.access;
  const refresh_token = query.refresh;

  const user = {
    access_token,
    refresh_token,
  };

  const [cookie, setCookie] = useCookies(["user"]);

  useEffect(() => {
    const to_forward = "/dashboard/status";

    console.log("user --> ", user)

    if (access_token && refresh_token) {
      setCookie("user", JSON.stringify(user), {
        path: "/",
        maxAge: 3600, // Expires after 1hr
        sameSite: true,
      });
      router.push(to_forward);
    }

    }, []);

  return (
    <div>
      <h1>Redirecting...</h1>
    </div>
  );
}
