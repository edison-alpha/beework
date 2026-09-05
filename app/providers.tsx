"use client";

import type { ReactNode } from "react";
import { MotionConfig } from "motion/react";
import { AuthProvider } from "@/modules/auth/context/auth-context";
import { PlatformProvider } from "@/modules/platform/context/platform-context";

export function Providers({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user"><AuthProvider><PlatformProvider>{children}</PlatformProvider></AuthProvider></MotionConfig>;
}
