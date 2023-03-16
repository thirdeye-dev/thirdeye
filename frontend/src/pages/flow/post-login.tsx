import maybeOnboarding from "@/flow/onboarding";
import { fetchCurrentUser } from "@/services/user";
import { useRouter } from "next/navigation";
import { Router } from "next/router";
import { useEffect } from "react";

export default function PostLogin() {
  const router = useRouter();

  useEffect(() => {
    const user = fetchCurrentUser();

    maybeOnboarding(user, router as unknown as Router);
  }, [router]);

  return null;
}
