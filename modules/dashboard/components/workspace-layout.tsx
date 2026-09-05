"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BriefcaseBusiness, LayoutDashboard, Send, Settings } from "lucide-react";
import { useAuth } from "@/modules/auth/context/auth-context";
import { Button } from "@/components/base/buttons/button";
import { cx } from "@/utils/cx";

const items = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/bounties", label: "Your bounties", icon: BriefcaseBusiness },
  { href: "/dashboard/submissions", label: "Submissions", icon: Send },
  { href: "/settings/profile", label: "Settings", icon: Settings },
];

export function WorkspaceLayout({ title, description, children, action }: { title: string; description: string; children: React.ReactNode; action?: React.ReactNode }) {
  const pathname = usePathname();
  const { authenticated, login } = useAuth();
  if (!authenticated) return <div className="mx-auto max-w-lg px-4 py-24 text-center"><h1 className="text-title-2-medium">Your workspace is one login away</h1><p className="mt-3 text-body-regular text-text-secondary">Track bounties, submissions, and awards from one place.</p><Button className="mt-6" onClick={login}>Continue with Privy</Button></div>;
  return <div className="mx-auto grid max-w-[1120px] gap-8 px-4 py-8 md:grid-cols-[190px_minmax(0,1fr)] lg:px-6"><aside className="hidden md:block"><p className="px-3 text-caption-1-semibold uppercase tracking-[.12em] text-text-tertiary">Workspace</p><nav className="mt-3 grid gap-1">{items.map(({ href, label, icon: Icon }) => <Link key={href} href={href} className={cx("focus-ring flex items-center gap-2.5 rounded-xl px-3 py-2 text-body-2-medium", pathname === href ? "bg-background-secondary-hover text-text-primary" : "text-text-secondary hover:text-text-primary")}><Icon className="size-4"/>{label}</Link>)}</nav></aside><div className="min-w-0"><header className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><h1 className="text-title-3-semibold">{title}</h1><p className="mt-1 text-body-regular text-text-secondary">{description}</p></div>{action}</header><nav className="mb-5 flex gap-2 overflow-x-auto md:hidden">{items.slice(0, 3).map(({ href, label }) => <Link key={href} href={href} className={cx("shrink-0 rounded-full border px-3 py-1.5 text-body-2-medium", pathname === href ? "border-accent-500 bg-accent-50 text-accent-700" : "border-border-button-default text-text-secondary")}>{label}</Link>)}</nav>{children}</div></div>;
}
