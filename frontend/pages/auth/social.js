/* eslint-disable no-unused-vars */
/* eslint-disable camelcase */
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useCookies } from "react-cookie";

export default function Social() {
  const router = useRouter();
  const [cookie, setCookie] = useCookies(["user"]);
  const query = router.query
  const access_token = query.access;
  const refresh_token = query.refresh;

  console.log(access_token, refresh_token);

  useEffect(() => {
      const to_forward = "/dashboard/status";

      const user = {
        access_token,
        refresh_token,
      };
      console.log("user --> ", user)
    
      setCookie("user", JSON.stringify(user), {
        path: "/",
        maxAge: 3600, // Expires after 1hr
        sameSite: true,
      });

      router.push(to_forward);
    }, [access_token && refresh_token]);

  return (
    <div>
      <h1>Redirecting...</h1>
    </div>
  );
}
