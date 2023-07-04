import maybeOnboarding from "@/flow/onboarding";
import useCurrentUser from "@/hooks/use-current-user";
import { useRouter } from "next/navigation";
import { Router } from "next/router";
import { useEffect } from "react";

export default function PostLogin() {
  const router = useRouter();
  const { user } = useCurrentUser();

  useEffect(() => {
    if (user) {
      maybeOnboarding(user, router as unknown as Router);
    }
  }, [user, router]);

  return null;
}
