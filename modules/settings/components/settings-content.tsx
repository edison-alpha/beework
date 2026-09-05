"use client";

import { useState } from "react";
import { Check, Copy, LogOut } from "lucide-react";
import { Avatar } from "@/components/base/avatar/avatar";
import { Button } from "@/components/base/buttons/button";
import { Input } from "@/components/base/input/input";
import { Switch } from "@/components/base/switch/switch";
import { ThemeToggle } from "@/components/application/theme/theme-toggle";
import { VerifiedIcon, UsdcIcon } from "@/components/foundations/icons/brand-icons";
import { PROFILE_COVERS, type ProfileCover } from "@/components/application/profile/profile-cover-background";
import { useAuth } from "@/modules/auth/context/auth-context";
import { usePlatform } from "@/modules/platform/context/platform-context";
import { CATEGORIES, SKILLS } from "@/modules/bounties/constants/bounty.constants";
import { cx } from "@/utils/cx";
import { useSettingsForm } from "../hooks/use-settings-form";
import type { SettingsSection } from "../constants/settings.constants";

function ProfileSettings() {
  const { form, update, submit, message, saving } = useSettingsForm();
  const selectedCoverKey = form.profileCover in PROFILE_COVERS ? form.profileCover : "ocean";
  const selectedCover = PROFILE_COVERS[selectedCoverKey];
  return (
    <form className="grid gap-5" onSubmit={(event) => { event.preventDefault(); if (!saving) void submit(); }}>
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <Avatar initials={form.avatar} alt={form.name} color="blue" className="size-14" />
          <div className="min-w-0"><p className="flex items-center gap-2 text-body-medium"><span className="truncate">{form.name}</span>{form.verified && <VerifiedIcon className="size-4 shrink-0" />}</p><p className="text-body-2-regular text-text-tertiary">Your public Beework profile</p></div>
        </div>
        <fieldset className="flex w-full items-center justify-between gap-3 sm:w-auto sm:shrink-0">
          <legend className="text-body-2-medium">Profile background</legend>
          <select
            aria-label="Profile background"
            value={selectedCoverKey}
            onChange={(event) => update("profileCover", event.target.value as ProfileCover)}
            className="focus-ring h-8 w-36 shrink-0 rounded-lg border border-border-button-default px-2 text-body-2-medium text-text-primary"
            style={{ background: `linear-gradient(135deg, ${selectedCover.colors[0]}, ${selectedCover.colors[2]})` }}
          >
            {Object.entries(PROFILE_COVERS).map(([cover, option]) => (
              <option
                key={cover}
                value={cover}
                style={{ backgroundColor: option.colors[0], color: "#111827" }}
              >
                {option.label}
              </option>
            ))}
          </select>
        </fieldset>
      </div>
      <Input label="Username" value={form.username} maxLength={24} isRequired onChange={(value) => update("username", value.toLowerCase().replace(/[^a-z0-9_]/g, ""))} hint="3–24 letters, numbers, or underscores." />
      <Input label="Display name" value={form.name} maxLength={60} isRequired onChange={(value) => update("name", value)} />
      <Input label="Avatar initials" value={form.avatar} maxLength={2} onChange={(value) => update("avatar", value.toUpperCase())} hint="Leave empty to use a generated avatar." />
      <Input label="Bio" value={form.bio} maxLength={160} onChange={(value) => update("bio", value)} hint={`${form.bio.length}/160 characters`} />
      {([{ key: "skills", label: "Skills", options: SKILLS }, { key: "interests", label: "Bounty interests", options: CATEGORIES }] as const).map(({ key, label, options }) => (
        <fieldset key={key}><legend className="mb-2 text-body-2-medium">{label}</legend><div className="flex flex-wrap gap-2">{options.map((option) => {
          const selected = form[key].includes(option);
          return <button key={option} type="button" aria-pressed={selected} onClick={() => update(key, selected ? form[key].filter((item) => item !== option) : [...form[key], option])} className={cx("focus-ring rounded-full border px-3 py-1.5 text-body-2-medium", selected ? "border-accent-500 bg-accent-50 text-accent-700 dark:bg-accent-950 dark:text-accent-300" : "border-border-button-default text-text-secondary")}>{option}</button>;
        })}</div></fieldset>
      ))}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-separator-border pt-4"><p role="status" className="text-body-2-regular text-text-secondary">{message}</p><Button type="submit" disabled={saving}>{saving ? "Saving…" : "Save changes"}</Button></div>
    </form>
  );
}

function WalletSettings() {
  const { user, configured } = useAuth();
  const address = user?.walletAddress?.trim() || "";
  const [copyState, setCopyState] = useState<"idle" | "copied" | "error">("idle");
  return <div className="grid gap-5">
    <div className="flex items-center gap-3"><UsdcIcon className="size-9" /><div><p className="text-body-medium">USDC on Solana</p><p className="text-body-2-regular text-text-secondary">Wallet associated with your Beework account.</p></div></div>
    <div className="rounded-2xl border border-border-button-default p-4">
      <p className="mb-2 text-body-2-medium">{configured ? "Solana wallet address" : "Demo wallet"}</p>
      {address ? <><code className="block break-all text-body-2-regular text-text-secondary">{address}</code><Button type="button" className="mt-4" size="small" variant="secondary" leadingIcon={copyState === "copied" ? Check : Copy} onClick={async () => {
        try { await navigator.clipboard.writeText(address); setCopyState("copied"); } catch { setCopyState("error"); }
      }}>{copyState === "copied" ? "Copied" : "Copy address"}</Button><p role="status" className="mt-2 text-body-2-regular text-text-secondary">{copyState === "error" ? "Could not copy. Select and copy the address above." : ""}</p></> : <p className="text-body-2-regular text-text-secondary">No Solana wallet is connected to this account yet.</p>}
    </div>
    <p className="rounded-xl bg-background-secondary-default p-4 text-body-2-regular text-text-secondary">Payments are currently simulated. Beework does not transfer USDC or broadcast wallet transactions.</p>
  </div>;
}

function NotificationSettings() {
  const { profile, saveProfile, notifications, markNotificationsRead } = usePlatform();
  const [saved, setSaved] = useState(false);
  const unread = notifications.filter((item) => !item.read).length;
  const rows = [{ key: "submissions", title: "Bounty and submission activity", detail: "Submissions, shortlist decisions, and awards." }, { key: "product", title: "Product updates", detail: "New Beework features and improvements." }, { key: "newsletter", title: "Community newsletter", detail: "Bounty opportunities and community news." }] as const;
  return <div className="grid gap-5">
    <p className="text-body-2-regular text-text-secondary">Preferences are saved on this device. Email and push delivery are not enabled yet.</p>
    <div className="divide-y divide-separator-border">{rows.map((row) => <div key={row.key} className="flex items-center gap-4 py-4"><div className="min-w-0 flex-1"><p className="text-body-medium">{row.title}</p><p className="mt-1 text-body-2-regular text-text-secondary">{row.detail}</p></div><Switch aria-label={row.title} isSelected={profile.notifications[row.key]} onChange={(selected) => { saveProfile({ ...profile, notifications: { ...profile.notifications, [row.key]: selected } }); setSaved(true); }} /></div>)}</div>
    <p role="status" className="text-body-2-regular text-text-secondary">{saved ? "Preferences saved." : ""}</p>
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-background-secondary-default p-4"><p className="text-body-2-medium">{unread} unread notifications</p><Button size="small" variant="secondary" disabled={!unread} onClick={markNotificationsRead}>Mark all read</Button></div>
  </div>;
}

function AccountSettings({ onClose }: { onClose: () => void }) {
  const { user, configured, logout } = useAuth();
  const { resetDemo } = usePlatform();
  const [confirmReset, setConfirmReset] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  return <div className="grid gap-5">
    <dl className="grid gap-4 rounded-2xl border border-border-button-default p-4"><div><dt className="text-body-2-medium">Email</dt><dd className="mt-1 break-all text-body-2-regular text-text-secondary">{user?.email || "No email linked to this account"}</dd></div><div><dt className="text-body-2-medium">Sign-in provider</dt><dd className="mt-1 text-body-2-regular text-text-secondary">{configured ? "Privy" : "Demo session"}</dd></div></dl>
    <Button variant="secondary" leadingIcon={LogOut} disabled={busy} onClick={async () => { setBusy(true); setMessage(""); try { await logout(); onClose(); } catch { setMessage("Could not log out. Please try again."); } finally { setBusy(false); } }}>{busy ? "Logging out…" : "Log out"}</Button>
    <section className="rounded-2xl border border-border-button-default p-4"><h3 className="text-body-medium">Local demo data</h3><p className="mt-2 text-body-2-regular text-text-secondary">Profile edits, bounties, submissions, and preferences are stored in this browser. They do not sync across devices.</p><p className="mt-2 text-body-2-regular text-text-secondary">Reset restores the sample marketplace and removes local changes. Your Privy account and wallet are not deleted.</p>
      {confirmReset ? <div className="mt-4 grid gap-3"><p className="text-body-2-medium">Reset local Beework data? This cannot be undone.</p><div className="flex flex-wrap gap-2"><Button variant="secondary" onClick={() => setConfirmReset(false)}>Cancel</Button><Button variant="danger" onClick={() => { resetDemo(); setConfirmReset(false); setMessage("Local demo data reset."); }}>Confirm reset</Button></div></div> : <Button className="mt-4" variant="danger" onClick={() => setConfirmReset(true)}>Reset demo data</Button>}
    </section>
    <p role="status" className="text-body-2-regular text-text-secondary">{message}</p>
  </div>;
}

export function SettingsContent({ section, onClose }: { section: SettingsSection; onClose: () => void }) {
  switch (section) {
    case "profile": return <ProfileSettings />;
    case "wallet": return <WalletSettings />;
    case "notifications": return <NotificationSettings />;
    case "account": return <AccountSettings onClose={onClose} />;
    case "appearance": return <div className="grid gap-5"><p className="text-body-2-regular text-text-secondary">Choose the Beework theme for this device.</p><div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-background-secondary-default p-4"><div><p className="text-body-medium">Color mode</p><p className="text-body-2-regular text-text-secondary">Light or dark</p></div><ThemeToggle appearance="segmented" /></div></div>;
  }
}
