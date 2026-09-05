import Link from "next/link";
import { cx } from "@/utils/cx";

export function BeeworkMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" aria-hidden className={cx("size-9", className)}>
      <defs><linearGradient id="bee-blue" x1="7" y1="5" x2="34" y2="35" gradientUnits="userSpaceOnUse"><stop stopColor="#60a5fa"/><stop offset="1" stopColor="#1d4ed8"/></linearGradient></defs>
      <path d="M20 2.8 34.8 11.4v17.2L20 37.2 5.2 28.6V11.4L20 2.8Z" fill="url(#bee-blue)"/>
      <path d="M20 10.6c-4 0-6.8 2.5-6.8 6.1 0 1.6.6 3 1.7 4.1-1.4.8-2.3 2.3-2.3 4 0 2.7 2.2 4.9 5 4.9H20V10.6Zm0 0c4 0 6.8 2.5 6.8 6.1 0 1.6-.6 3-1.7 4.1 1.4.8 2.3 2.3 2.3 4 0 2.7-2.2 4.9-5 4.9H20V10.6Z" fill="white" fillOpacity=".96"/>
      <path d="M15 19.8h10M14.2 24.3h11.6" stroke="#2563eb" strokeWidth="2.2" strokeLinecap="round"/>
    </svg>
  );
}

export function BeeworkLogo({ compact = false, className }: { compact?: boolean; className?: string }) {
  return (
    <Link href="/" aria-label="Beework home" className={cx("focus-ring inline-flex items-center rounded-xl", className)}>
      {compact ? <BeeworkMark className="size-12" /> : <>
        <img src="/beework-dark.png" alt="Beework" className="h-14 w-auto dark:hidden" />
        <img src="/beework-light.png" alt="" aria-hidden="true" className="hidden h-14 w-auto dark:block" />
      </>}
    </Link>
  );
}
