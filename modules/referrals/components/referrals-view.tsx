"use client";

import { useState } from "react";
import { Check, Copy, Gift, Link2, UsersRound } from "lucide-react";
import { Avatar } from "@/components/base/avatar/avatar";
import { Button } from "@/components/base/buttons/button";
import { Input } from "@/components/base/input/input";
import { useAuth } from "@/modules/auth/context/auth-context";
import { referralsApi } from "../api/referrals.api";
import { REFERRAL_RATE_LABEL } from "../constants/referral.constants";
import { useReferrals } from "../hooks/use-referrals";

export function ReferralsView() {
  const { authenticated, login } = useAuth();
  const { link, referrals, metrics } = useReferrals();
  const [copied, setCopied] = useState(false);
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");

  if (!authenticated) {
    return (
      <div className="mx-auto max-w-lg px-4 py-24 text-center">
        <h1 className="text-title-2-medium">Share good work, earn together</h1>
        <p className="mt-3 text-body-regular text-text-secondary">Log in to get your personal Beework referral link.</p>
        <Button className="mt-6" onClick={login}>Continue with Privy</Button>
      </div>
    );
  }

  const copyLink = () => {
    void navigator.clipboard?.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const applyCode = async () => {
    try {
      await referralsApi.applyCode(code);
      setMessage("Referral code applied to this demo session.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Code could not be applied.");
    }
  };

  return (
    <div className="mx-auto max-w-[980px] px-4 py-8 sm:px-6">
      <section className="card-surface overflow-hidden">
        <div className="border-b border-separator-border bg-background-secondary-default p-6 sm:p-8">
          <p className="text-body-2-medium text-accent-600">Referrals</p>
          <h1 className="mt-2 text-title-2-medium">Earn every time your referrals get paid</h1>
          <p className="mt-3 max-w-2xl text-body-regular text-text-secondary">
            {REFERRAL_RATE_LABEL}. Rewards are simulated in this frontend demo.
          </p>
        </div>
        <div className="p-6 sm:p-8">
          <p className="mb-2 text-body-2-medium">Your referral link</p>
          <div className="flex flex-col gap-2 sm:flex-row">
            <div className="flex min-w-0 flex-1 items-center gap-2 rounded-2lg bg-background-tertiary-default px-3 text-body-regular">
              <Link2 className="size-4 shrink-0 text-foreground-icon-tertiary" />
              <span className="truncate">{link}</span>
            </div>
            <Button leadingIcon={copied ? Check : Copy} onClick={copyLink}>{copied ? "Copied" : "Copy link"}</Button>
          </div>
          <div className="mt-6 rounded-2xl border border-border-button-default p-4">
            <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-end">
              <Input
                className="max-w-sm"
                label="Have a referral code?"
                placeholder="Enter code"
                value={code}
                onChange={setCode}
                hint={message || "A code can only be applied once."}
              />
              <Button variant="secondary" onClick={applyCode}>Apply code</Button>
            </div>
          </div>
        </div>
      </section>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        {[
          { icon: UsersRound, value: metrics.paid, label: "Paid referrals" },
          { icon: Gift, value: metrics.pending, label: "Awaiting first activity" },
          { icon: Link2, value: `${metrics.earnings.toFixed(2)} USDC`, label: "Referral earnings" },
        ].map(({ icon: Icon, value, label }) => (
          <section key={label} className="card-surface p-5">
            <Icon className="size-4 text-accent-600" />
            <p className="mt-4 text-title-3-semibold">{value}</p>
            <p className="mt-1 text-body-2-regular text-text-tertiary">{label}</p>
          </section>
        ))}
      </div>

      <section className="card-surface mt-5 p-6 sm:p-8">
        <h2 className="text-title-3-semibold">Activity</h2>
        <div className="mt-5 divide-y divide-separator-border border-t border-separator-border">
          {referrals.map((item) => (
            <div key={item.id} className="flex items-center gap-3 py-4">
              <Avatar initials={item.avatar} color="blue" />
              <div className="min-w-0 flex-1">
                <p className="text-body-medium">{item.name}</p>
                <p className="text-body-2-regular text-text-tertiary">{item.event} · {item.occurredAt}</p>
              </div>
              <strong className="text-body-medium">{item.reward ? `+${item.reward.toFixed(2)} USDC` : "Pending"}</strong>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
