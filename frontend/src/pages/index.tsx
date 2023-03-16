import { useEffect } from "react";
import { useRouter } from "next/navigation";
import maybeLogin from "@/flow/maybeLogin";
import { Router } from "next/router";

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    maybeLogin(router as any as Router);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
