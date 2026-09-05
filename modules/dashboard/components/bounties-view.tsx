"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { ButtonLink } from "@/components/base/buttons/button";
import { BountyCard } from "@/modules/bounties/components/bounty-card";
import type { BountyStatus } from "@/modules/bounties/types/bounty.types";
import { cx } from "@/utils/cx";
import { useDashboard } from "../hooks/use-dashboard";
import { WorkspaceLayout } from "./workspace-layout";

export function BountiesView() {
  const { ownedBounties } = useDashboard();
  const [status, setStatus] = useState<BountyStatus | "all">("all");
  const results = status === "all" ? ownedBounties : ownedBounties.filter((item) => item.status === status);
  return <WorkspaceLayout title="Your bounties" description="Publish work, follow progress, and review outcomes." action={<ButtonLink href="/create" size="small" leadingIcon={Plus}>Create bounty</ButtonLink>}><div className="mb-4 flex gap-2 overflow-x-auto">{(["all", "draft", "open", "reviewing", "completed"] as const).map((item) => <button key={item} onClick={() => setStatus(item)} className={cx("shrink-0 rounded-full border px-3 py-1.5 text-body-2-medium capitalize", status === item ? "border-accent-500 bg-accent-50 text-accent-700 dark:bg-accent-950 dark:text-accent-300" : "border-border-button-default text-text-secondary")}>{item === "all" ? "All" : item}</button>)}</div><div className="grid gap-2">{results.map((bounty) => <BountyCard key={bounty.id} bounty={bounty}/>)}{results.length === 0 && <div className="rounded-xl border border-dashed border-border-button-default py-14 text-center text-body-regular text-text-secondary">No bounties in this status.</div>}</div></WorkspaceLayout>;
}
