import { User } from "@/models/user";
import { Router } from "next/router";

export default function maybeOnboarding(user: User, router: Router) {
  router.push("/onboarding");
}
