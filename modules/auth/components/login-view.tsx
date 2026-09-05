"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/auth-context";

export function LoginView() {
  const router = useRouter();
  const { ready, authenticated, login } = useAuth();
  const opened = useRef(false);

  useEffect(() => {
    if (!ready) return;
    if (authenticated) {
      router.replace("/dashboard");
      return;
    }
    if (!opened.current) {
      opened.current = true;
      router.replace("/");
      login();
    }
  }, [authenticated, login, ready, router]);

  return null;
}
