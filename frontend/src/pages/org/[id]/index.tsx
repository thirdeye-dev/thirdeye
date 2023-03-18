import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Organization() {
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    router.push(`/org/${id}/overview`);
  }, [id, router]);

  return null;
}
