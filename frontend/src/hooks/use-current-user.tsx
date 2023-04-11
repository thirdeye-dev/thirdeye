import User from "@/models/user";
import { fetchCurrentUser } from "@/services/user";
import { useEffect, useState } from "react";

export default function useCurrentUser() {
  const [user, setUser] = useState<User | null>(null);

  const fetchUser = async () => {
    const user = await fetchCurrentUser();

    setUser(user);
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return user;
}
