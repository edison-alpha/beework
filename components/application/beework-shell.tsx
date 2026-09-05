"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { Compass, LayoutDashboard, LogIn, LogOut, Plus, Settings, UserRound, UsersRound } from "lucide-react";
import { Avatar } from "@/components/base/avatar/avatar";
import { Button, ButtonLink } from "@/components/base/buttons/button";
import { ThemeToggle } from "@/components/application/theme/theme-toggle";
import { SettingsModal } from "@/components/application/settings/settings-modal";
import { BeeworkNotifications } from "@/components/application/notification-center/beework-notifications";
import { BeeworkLogo } from "@/components/foundations/brand/beework-logo";
import { useAuth } from "@/modules/auth/context/auth-context";
import { usePlatform } from "@/modules/platform/context/platform-context";
import { cx } from "@/utils/cx";
import { useDismissOnOutsidePress } from "@/utils/use-dismiss-on-outside-press";

const nav = [
  { href: "/", label: "Explore", icon: Compass },
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/referrals", label: "Referrals", icon: UsersRound },
];

export function BeeworkShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { authenticated, login, logout } = useAuth();
  const { profile } = usePlatform();
  const [profileOpen, setProfileOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const profileTriggerRef = useRef<HTMLButtonElement>(null);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const closeProfile = useCallback(() => setProfileOpen(false), []);

  useDismissOnOutsidePress(profileOpen, closeProfile, [profileTriggerRef, profileMenuRef]);

  useEffect(() => {
    if (!profileOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeProfile();
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [closeProfile, profileOpen]);

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-50 bg-background-full/95 backdrop-blur-xl">
        <div className="flex h-14 items-center gap-3 px-5 sm:px-8">
          <BeeworkLogo />
          <div className="ml-auto flex items-center gap-2">
            {authenticated && <>
              <ButtonLink 
                href="/create" size="small" leadingIcon={Plus} className="hidden sm:inline-flex">
                  Create bounty
              </ButtonLink>
              
              <ButtonLink href="/referrals" size="small" variant="secondary" className="hidden sm:inline-flex">Refer friends</ButtonLink>
              <BeeworkNotifications />
            </>}
            {authenticated ? (
              <div className="relative" onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) closeProfile(); }}>
                <button ref={profileTriggerRef} type="button" className="focus-ring rounded-full" aria-haspopup="menu" aria-expanded={profileOpen} aria-label="Open account menu" onClick={() => setProfileOpen((open) => !open)}><Avatar initials={profile.avatar} color="blue" size="lg" /></button>
                {profileOpen && <div ref={profileMenuRef} role="menu" className="absolute top-12 right-0 w-60 rounded-2xl border border-border-button-default bg-background-primary-default p-2 shadow-xl">
                  <div className="border-b border-separator-border px-3 py-2"><p className="text-body-medium">{profile.name}</p><p className="text-body-2-regular text-text-secondary">@{profile.username}</p></div>
                  <Link href={`/profile/${profile.username}`} onClick={closeProfile} className="mt-1 flex items-center gap-2 rounded-xl px-3 py-2 text-body-2-medium hover:bg-background-secondary-hover"><UserRound className="size-4"/>View profile</Link>
                  <Link href="/dashboard" onClick={closeProfile} className="flex items-center gap-2 rounded-xl px-3 py-2 text-body-2-medium hover:bg-background-secondary-hover"><LayoutDashboard className="size-4"/>Dashboard</Link>
                  <button type="button" onClick={() => { closeProfile(); setSettingsOpen(true); }} className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-body-2-medium hover:bg-background-secondary-hover"><Settings className="size-4"/>Settings</button>
                  <div className="px-1 py-1"><ThemeToggle appearance="sidebar" /></div>
                  <button onClick={() => { closeProfile(); void logout(); }} className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-body-2-medium hover:bg-background-secondary-hover"><LogOut className="size-4"/>Log out</button>
                </div>}
              </div>
            ) : <Button size="small" variant="secondary" leadingIcon={LogIn} onClick={login}>Log in</Button>}
          </div>
        </div>
      </header>
      <main className="pb-24 md:pb-10">{children}</main>
      {authenticated && <nav className="fixed right-3 bottom-3 left-3 z-50 grid grid-cols-5 rounded-2xl border border-border-button-default bg-background-primary-default/95 p-1.5 shadow-xl backdrop-blur-xl md:hidden">
        {[...nav, { href: "/create", label: "Create", icon: Plus }].map((item) => <Link key={item.href} href={item.href} className={cx("focus-ring grid place-items-center gap-1 rounded-xl py-2 text-[10px] font-medium", pathname === item.href ? "bg-accent-50 text-accent-700 dark:bg-accent-950 dark:text-accent-300" : "text-text-tertiary")}><item.icon className="size-4"/>{item.label}</Link>)}
        <button type="button" onClick={() => setSettingsOpen(true)} aria-haspopup="dialog" className="focus-ring grid place-items-center gap-1 rounded-xl py-2 text-[10px] font-medium text-text-tertiary"><UserRound className="size-4" />Account</button>
      </nav>}
      <SettingsModal isOpen={settingsOpen && authenticated} onClose={() => { setSettingsOpen(false); profileTriggerRef.current?.focus(); }} defaultPage="profile" />
    </div>
  );
}
