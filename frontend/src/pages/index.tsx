import { useEffect } from "react";
import { useRouter } from "next/router";

import maybeLogin from "@/flow/maybeLogin";
import useCurrentUser from "@/hooks/use-current-user";

export default function Index() {
  const router = useRouter();
  const { isLoading, error } = useCurrentUser();

  useEffect(() => {
    if (isLoading) return;

    maybeLogin(error, router);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, error]);

  return null;
}
