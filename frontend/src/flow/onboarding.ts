import User from "@/models/user";
import { Router } from "next/router";

export default function maybeOnboarding(user: User, router: Router) {
  if (user.organizations.length > 0) {
    return router.push("/org");
  }

  router.push("/onboarding");
}
