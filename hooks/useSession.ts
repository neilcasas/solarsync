"use client";

import { useState, useEffect, useCallback } from "react";

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "employee" | "hr";
}

interface SessionState {
  user: User | null;
  status: "loading" | "authenticated" | "unauthenticated";
}

export function useSession() {
  const [session, setSession] = useState<SessionState>({
    user: null,
    status: "loading",
  });

  const fetchSession = useCallback(async () => {
    try {
      const res = await fetch("/api/session");
      const data = await res.json();

      if (res.ok && data.user) {
        setSession({ user: data.user, status: "authenticated" });
      } else {
        setSession({ user: null, status: "unauthenticated" });
      }
    } catch {
      setSession({ user: null, status: "unauthenticated" });
    }
  }, []);

  useEffect(() => {
    fetchSession();
  }, [fetchSession]);

  const logout = useCallback(async () => {
    await fetch("/api/logout", { method: "POST" });
    setSession({ user: null, status: "unauthenticated" });
  }, []);

  return { ...session, logout, refetch: fetchSession };
}
