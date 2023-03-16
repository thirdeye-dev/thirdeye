import maybeOnboarding from "@/flow/onboarding";
import { fetchCurrentUser } from "@/services/user";
import { useRouter } from "next/navigation";
import { Router } from "next/router";
import { useEffect } from "react";

export default function PostLogin() {
  const router = useRouter();

  const check = async () => {
    const user = await fetchCurrentUser();
    console.log(user);

    maybeOnboarding(user!, router as unknown as Router);
  };

  useEffect(() => {
    check();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  return null;
}
