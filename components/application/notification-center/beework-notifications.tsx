"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Bell, Clock, Trophy, UsersRound, FileCheck } from "lucide-react";
import { Button } from "@/components/base/buttons/button";
import { usePlatform } from "@/modules/platform/context/platform-context";
import { useDismissOnOutsidePress } from "@/utils/use-dismiss-on-outside-press";
import { NotificationCenter, type NotificationCenterItem } from "./notification-center";

const destinations = {
  submission: { href: "/dashboard/submissions", label: "View submissions", icon: FileCheck },
  award: { href: "/dashboard", label: "View dashboard", icon: Trophy },
  deadline: { href: "/dashboard/bounties", label: "View bounties", icon: Clock },
  referral: { href: "/referrals", label: "View referrals", icon: UsersRound },
};

export function BeeworkNotifications() {
  const { notifications, markNotificationRead, markNotificationsRead } = usePlatform();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const panelId = useId();
  const close = useCallback(() => setOpen(false), []);
  useDismissOnOutsidePress(open, close, [triggerRef, panelRef]);

  useEffect(() => {
    if (!open) return;
    panelRef.current?.focus();
    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") { close(); triggerRef.current?.focus(); }
    };
    document.addEventListener("keydown", onEscape);
    return () => document.removeEventListener("keydown", onEscape);
  }, [open, close]);

  const unread = notifications.filter((item) => !item.read).length;
  const items: NotificationCenterItem[] = notifications.map((item) => ({
    id: item.id,
    category: item.kind === "referral" ? "referrals" : "bounties",
    group: "Beework activity",
    title: item.title,
    description: item.description,
    timestamp: item.createdAt,
    unread: !item.read,
    status: item.kind === "award" ? "success" : "information",
    icon: destinations[item.kind].icon,
    actions: [
      { id: "view", label: destinations[item.kind].label },
      ...(!item.read ? [{ id: "read", label: "Mark read", variant: "ghost" as const }] : []),
    ],
  }));

  return <div className="relative" onBlur={(event) => {
    if (event.relatedTarget && !event.currentTarget.contains(event.relatedTarget)) close();
  }}>
    <Button ref={triggerRef} type="button" iconOnly size="small" variant="secondary" leadingIcon={Bell}
      aria-label={unread ? `Notifications, ${unread} unread` : "Notifications"}
      aria-expanded={open} aria-controls={open ? panelId : undefined}
      onClick={() => setOpen((value) => !value)} />
    {unread > 0 && <span aria-hidden className="pointer-events-none absolute -top-1 -right-1 grid min-w-4 place-items-center rounded-full bg-accent-600 px-1 text-[10px] font-bold text-white">{unread > 99 ? "99+" : unread}</span>}
    {open && <div id={panelId} ref={panelRef} tabIndex={-1} className="fixed top-16 right-3 left-3 z-[60] outline-none sm:absolute sm:top-12 sm:right-0 sm:left-auto sm:w-[380px]">
      <NotificationCenter notifications={items} className="max-w-none" emptyMessage="No Beework activity yet."
        onMarkRead={markNotificationRead} onMarkAllRead={markNotificationsRead}
        onAction={(id, action) => {
          if (action !== "view") return;
          const item = notifications.find((notification) => notification.id === id);
          if (!item) return;
          close(); triggerRef.current?.focus(); router.push(destinations[item.kind].href);
        }} />
    </div>}
  </div>;
}
