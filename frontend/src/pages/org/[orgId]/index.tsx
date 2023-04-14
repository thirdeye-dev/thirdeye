import { useRouter } from "next/router";
import { useEffect } from "react";

import { DEFAULT_ACTIVE_DASHBOARD_TAB } from "@/constants";

export default function Organization() {
  const router = useRouter();
  const organizationId = router.query.orgId;

  useEffect(() => {
    router.push(`/org/${organizationId}/${DEFAULT_ACTIVE_DASHBOARD_TAB}`);
  }, [organizationId, router]);

  return null;
}
