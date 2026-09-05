"use client";

import { useEffect, useId, useRef, useState } from "react";
import { X } from "lucide-react";
import { Avatar } from "@/components/base/avatar/avatar";
import { Button } from "@/components/base/buttons/button";
import { useAuth } from "@/modules/auth/context/auth-context";
import { usePlatform } from "@/modules/platform/context/platform-context";
import { SettingsContent } from "@/modules/settings/components/settings-content";
import { SETTINGS_SECTIONS, type SettingsSection } from "@/modules/settings/constants/settings.constants";
import { cx } from "@/utils/cx";

export type SettingsPage = SettingsSection;

export interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultPage?: SettingsPage;
}

/** BoardUI settings shell, connected to Beework's account and platform state. */
export function SettingsModal({ isOpen, onClose, defaultPage = "profile" }: SettingsModalProps) {
  const { ready, authenticated, login } = useAuth();
  const { profile, hydrated } = usePlatform();
  const [page, setPage] = useState(defaultPage);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const titleId = useId();

  useEffect(() => {
    if (!isOpen) return;
    const dialog = dialogRef.current;
    if (!dialog) return;
    setPage(defaultPage);
    const previousFocus = document.activeElement;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialog.showModal();
    closeRef.current?.focus();
    return () => {
      dialog.close();
      document.body.style.overflow = overflow;
      if (previousFocus instanceof HTMLElement && previousFocus.isConnected) previousFocus.focus();
    };
  }, [isOpen, defaultPage]);

  const title = SETTINGS_SECTIONS.find((item) => item.id === page)?.label ?? "Profile";
  return (
    <dialog ref={dialogRef} aria-labelledby={titleId}
      onCancel={(event) => { event.preventDefault(); onClose(); }}
      onClick={(event) => { if (event.target === event.currentTarget) onClose(); }}
      className="m-auto h-[min(680px,calc(100dvh-24px))] max-h-none w-[min(900px,calc(100vw-24px))] max-w-none overflow-hidden rounded-3xl border-0 bg-background-full p-0 text-text-primary shadow-2xl backdrop:bg-black/60 backdrop:backdrop-blur-sm">
      <div className="flex h-full min-h-0 flex-col sm:flex-row">
        <aside className="shrink-0 border-b border-separator-border bg-background-secondary-default p-3 sm:w-52 sm:border-r sm:border-b-0">
          <div className="mb-4 hidden items-center gap-3 px-2 pt-2 sm:flex"><Avatar initials={profile.avatar} alt={profile.name} color="blue" /><div className="min-w-0"><p className="text-body-medium">Beework</p><p className="truncate text-body-2-regular text-text-secondary">{authenticated ? `@${profile.username}` : "Settings"}</p></div></div>
          <nav aria-label="Settings sections" className="flex gap-1 overflow-x-auto sm:flex-col">
            {SETTINGS_SECTIONS.map(({ id, label, icon: Icon }) => (
              <button key={id} type="button" aria-current={page === id ? "page" : undefined}
                onClick={() => { setPage(id); contentRef.current?.scrollTo({ top: 0 }); }}
                className={cx("focus-ring flex shrink-0 items-center gap-2 rounded-xl px-3 py-2.5 text-left text-body-2-medium", page === id ? "bg-background-secondary-hover text-text-primary" : "text-text-secondary hover:bg-background-secondary-hover/60")}>
                <Icon className="size-4 shrink-0" aria-hidden />{label}
              </button>
            ))}
          </nav>
        </aside>
        <div className="flex min-h-0 min-w-0 flex-1 flex-col">
          <header className="flex shrink-0 items-center justify-between gap-3 px-5 py-5 sm:px-7"><h2 id={titleId} className="text-title-3-semibold">{title}</h2><button ref={closeRef} type="button" onClick={onClose} aria-label="Close settings" className="focus-ring grid size-9 shrink-0 place-items-center rounded-full bg-background-secondary-default hover:bg-background-secondary-hover"><X className="size-4" /></button></header>
          <div ref={contentRef} className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pb-6 sm:px-7">
            {isOpen && (!ready || !hydrated ? <p role="status" className="text-body-regular text-text-secondary">Loading settings…</p> : authenticated ? <SettingsContent key={page} section={page} onClose={onClose} /> : <div className="grid gap-4"><p className="text-body-regular">Log in to manage your Beework account.</p><Button onClick={() => { onClose(); login(); }}>Log in</Button></div>)}
          </div>
        </div>
      </div>
    </dialog>
  );
}
