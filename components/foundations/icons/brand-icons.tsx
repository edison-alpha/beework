"use client";

import { Icon } from "@iconify/react";
import { cx } from "@/utils/cx";

export function UsdcIcon({ className }: { className?: string }) {
  return <Icon icon="thesvg-color:usdc" className={cx("size-5 shrink-0", className)} aria-hidden />;
}

export function VerifiedIcon({ className }: { className?: string }) {
  return <Icon icon="solar:verified-check-bold" className={cx("size-4 shrink-0 text-accent-600", className)} aria-hidden />;
}
