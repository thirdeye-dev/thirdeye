import { useRouter } from "next/router";
import { useEffect } from "react";

import { DEFAULT_ACTIVE_DASHBOARD_TAB } from "@/constants";

export default function Organization() {
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    router.push(`/org/${id}/${DEFAULT_ACTIVE_DASHBOARD_TAB}`);
  }, [id, router]);

  return null;
}
