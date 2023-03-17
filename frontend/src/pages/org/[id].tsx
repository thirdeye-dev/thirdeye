import { useRouter } from "next/router";

export default function Organization() {
  const router = useRouter();
  const { id } = router.query;

  return (
    <div>
      <h1>Organization: {id}</h1>
    </div>
  );
}
