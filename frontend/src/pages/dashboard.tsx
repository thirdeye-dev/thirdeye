import { User } from "@/models/user";
import { fetchCurrentUser } from "@/services/user";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);

  const assignUser = async () => {
    const user = await fetchCurrentUser();

    setUser(user);
  };

  useEffect(() => {
    assignUser();
  }, []);

  return (
    <div>
      <h1>Dashboard</h1>
      <em>{user?.email ?? "none"}</em>
    </div>
  );
}
