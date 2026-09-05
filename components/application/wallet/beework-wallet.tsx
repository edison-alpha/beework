"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Icon } from "@iconify/react";
import { ArrowDownLeft, ArrowUpRight, Check, Copy, FlaskConical, History, X } from "lucide-react";
import { Button } from "@/components/base/buttons/button";
import { UsdcIcon } from "@/components/foundations/icons/brand-icons";
import { useAuth } from "@/modules/auth/context/auth-context";
import { usePlatform } from "@/modules/platform/context/platform-context";
import { cx } from "@/utils/cx";
import { MOCK_WALLET } from "./wallet.mock";
import styles from "./wallet.module.css";

const currencyFormatter = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });
const amountFormatter = new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 });
const dateFormatter = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", timeZone: "UTC" });

function abbreviatedAddress(address: string) {
  return address.length > 12 ? `${address.slice(0, 5)}…${address.slice(-4)}` : address;
}

function WalletIcon({ className }: { className?: string }) {
  return <Icon icon="fluent:wallet-credit-card-28-filled" className={className} aria-hidden />;
}

export function BeeworkWallet() {
  const { user } = useAuth();
  const { profile } = usePlatform();
  const [open, setOpen] = useState(false);
  const [present, setPresent] = useState(false);
  const reduceMotion = useReducedMotion();
  const [copyState, setCopyState] = useState<"idle" | "copied" | "error">("idle");
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLElement>(null);
  const titleId = useId();
  const panelId = useId();
  const copyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const address = user?.walletAddress || profile.solanaWalletAddress;
  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!present) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panelRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
      }
      if (event.key === "Tab") {
        const focusable = panelRef.current?.querySelectorAll<HTMLElement>("button:not(:disabled), a[href], [tabindex='0']");
        if (!focusable?.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && (document.activeElement === first || document.activeElement === panelRef.current)) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKeyDown);
    const trigger = triggerRef.current;
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      trigger?.focus();
    };
  }, [close, present]);

  useEffect(() => () => {
    if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
  }, []);

  const copyAddress = async () => {
    if (!address) return;
    try {
      await navigator.clipboard.writeText(address);
      setCopyState("copied");
    } catch {
      setCopyState("error");
    }
    if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
    copyTimerRef.current = setTimeout(() => setCopyState("idle"), 3000);
  };

  return <>
    <Button
      ref={triggerRef}
      type="button"
      iconOnly
      size="small"
      variant="secondary"
      leadingIcon={WalletIcon}
      aria-label="Open wallet"
      aria-haspopup="dialog"
      aria-expanded={open}
      aria-controls={open ? panelId : undefined}
      onClick={() => { setPresent(true); setOpen(true); }}
    />
    {present && createPortal(<AnimatePresence onExitComplete={() => setPresent(false)}>
      {open && <motion.div key="wallet-drawer" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reduceMotion ? 0.1 : 0.24 }} className="fixed inset-0 z-[100] overflow-hidden bg-black/45 backdrop-blur-sm" onMouseDown={(event) => {
      if (event.target === event.currentTarget) close();
    }}>
      <motion.section id={panelId} ref={panelRef} tabIndex={-1} role="dialog" aria-modal="true" aria-labelledby={titleId}
        initial={{ x: reduceMotion ? 0 : "100%" }} animate={{ x: 0 }}
        exit={{ x: reduceMotion ? 0 : "100%", transition: { duration: reduceMotion ? 0.1 : 0.24, ease: [0.4, 0, 1, 1] } }}
        transition={{ duration: reduceMotion ? 0.1 : 0.36, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-y-0 right-0 flex w-full max-w-[440px] flex-col overflow-hidden border-l border-border-button-default bg-background-primary-default text-text-primary shadow-2xl outline-none">
        <header className="flex shrink-0 items-center justify-between gap-3 border-b border-separator-border px-5 py-5 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <div className="min-w-0">
              <h2 id={titleId} className="text-title-2-semibold">My wallet</h2>
              <p className="truncate text-body-2-regular text-text-secondary" title={profile.name}>{profile.name}</p>
            </div>
          </div>
          <button type="button" className="focus-ring grid size-8 shrink-0 place-items-center rounded-full bg-background-secondary-default text-text-secondary transition-colors hover:bg-background-secondary-hover" aria-label="Close wallet" onClick={close}><X className="size-4" aria-hidden /></button>
        </header>

        <div className={cx(styles.scrollArea, "min-h-0 flex-1 overflow-x-hidden overflow-y-auto overscroll-contain px-5 py-5 sm:px-6")}>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <span className="inline-flex items-center gap-1.5 text-caption-1-medium text-text-secondary"><span aria-hidden className="size-1.5 rounded-full bg-accent-500" />Solana network</span>
            {address ? <button type="button" onClick={() => void copyAddress()} title={address} aria-label="Copy wallet address" className="focus-ring inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-lg border border-border-button-default px-2.5 py-1.5 text-caption-1-medium text-text-secondary transition-colors hover:bg-background-secondary-hover"><span className="font-mono">{abbreviatedAddress(address)}</span>{copyState === "copied" ? <Check className="size-3.5 text-accent-600" aria-hidden /> : <Copy className="size-3.5" aria-hidden />}</button> : <span className="text-caption-1-regular text-text-tertiary">No wallet connected</span>}
          </div>
          <p role="status" className={cx("break-all text-caption-1-regular text-text-secondary", copyState === "idle" ? "sr-only" : "mb-3")}>{copyState === "copied" ? "Wallet address copied." : copyState === "error" ? `Could not copy. Your address: ${address}` : ""}</p>

          <section aria-label="Demo balance" className="border-b border-separator-border pt-3 pb-6">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-body-2-medium text-text-secondary">Total balance</h3>
              <span className="rounded-md bg-background-secondary-default px-2 py-1 text-caption-1-medium text-text-tertiary">Demo</span>
            </div>
            <p className="mt-3 flex flex-wrap items-baseline gap-2"><span className="text-[36px] leading-tight font-semibold tracking-tight tabular-nums">{currencyFormatter.format(MOCK_WALLET.balanceUsd)}</span><span className="text-body-2-medium text-text-tertiary">USD</span></p>
            <p className="mt-1 text-body-2-regular text-text-tertiary">Rewards from your completed bounties.</p>
            <Button className="mt-5 h-10 rounded-lg px-4" variant="secondary" disabled trailingIcon={ArrowUpRight} aria-describedby={`${panelId}-demo-note`}>Withdraw</Button>
            <p id={`${panelId}-demo-note`} className="mt-2 text-caption-1-regular text-text-tertiary">Withdrawals unavailable in demo.</p>
          </section>

          <section className="mt-6" aria-labelledby={`${panelId}-assets`}>
            <div className="mb-3 flex items-center justify-between"><h3 id={`${panelId}-assets`} className="text-body-medium">Assets</h3><span className="rounded-md bg-background-secondary-default px-2 py-0.5 text-caption-1-medium text-text-secondary">{MOCK_WALLET.assets.length}</span></div>
            {MOCK_WALLET.assets.map((asset) => <div key={asset.symbol} className="flex items-center gap-3 border-b border-separator-border pt-2 pb-5">
              <UsdcIcon className="size-9" />
              <div className="min-w-0 flex-1"><p className="text-body-medium">{asset.name}</p><p className="mt-0.5 text-caption-1-regular text-text-tertiary">{asset.symbol} · {asset.network}</p></div>
              <div className="shrink-0 text-right tabular-nums"><p className="text-body-medium">{currencyFormatter.format(asset.valueUsd)}</p><p className="mt-0.5 text-caption-1-regular text-text-tertiary">{amountFormatter.format(asset.amount)} {asset.symbol}</p></div>
            </div>)}
          </section>

          <section className="mt-6" aria-labelledby={`${panelId}-activity`}>
            <div className="mb-1 flex items-center justify-between"><h3 id={`${panelId}-activity`} className="text-body-medium">Recent activity</h3><History className="size-4 text-text-tertiary" aria-hidden /></div>
            <ul className="divide-y divide-separator-border">
              {MOCK_WALLET.activity.map((transaction) => {
                const incoming = transaction.type === "reward";
                const TransactionIcon = incoming ? ArrowDownLeft : ArrowUpRight;
                return <li key={transaction.id} className="flex items-start gap-3 py-4">
                  <span className={cx("mt-0.5 grid size-9 shrink-0 place-items-center rounded-full", incoming ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400" : "bg-background-secondary-default text-text-secondary")}><TransactionIcon className="size-4" aria-hidden /></span>
                  <div className="min-w-0 flex-1"><p className="text-body-2-medium">{transaction.title}</p><p className="mt-0.5 truncate text-caption-1-regular text-text-tertiary" title={transaction.description}>{transaction.description}</p></div>
                  <div className="shrink-0 text-right"><p className={cx("text-body-2-medium tabular-nums", incoming && "text-emerald-700 dark:text-emerald-400")}>{incoming ? "+" : "−"}{amountFormatter.format(transaction.amount)} <span className="text-caption-1-medium">USDC</span></p><time dateTime={transaction.date} className="mt-0.5 block text-caption-1-regular text-text-tertiary">{dateFormatter.format(new Date(`${transaction.date}T00:00:00Z`))}</time></div>
                </li>;
              })}
            </ul>
          </section>
        </div>
      </motion.section>
    </motion.div>}
    </AnimatePresence>, document.body)}
  </>;
}
