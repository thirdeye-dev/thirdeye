import { fetchCurrentUser } from "@/services/user";
import { Router } from "next/router";

export default async function maybeLogin(router: Router) {
  const user = await fetchCurrentUser();

  if (user === null) {
    return router.push("/login");
  }

  router.push("/org");
}
