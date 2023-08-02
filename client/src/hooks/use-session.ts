import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function useSession() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const storedToken = localStorage.getItem("token");
    const storedUserId = localStorage.getItem("userId");
    setToken(storedToken);
    setUserId(storedUserId);
    if (storedToken === null || storedUserId === null) {
      router.replace("/login");
    }
  }, [router]);

  if (token === null || userId === null) {
    return null;
  }
  return { token, userId };
}
