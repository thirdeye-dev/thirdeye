import { User } from "@/models/user";
import { Router } from "next/router";

export default function maybeOnboarding(user: User, router: Router) {
  console.log(user);

  if (user.organizations.length > 0) {
    return router.push("/dashboard");
  }

  router.push("/onboarding");
}
