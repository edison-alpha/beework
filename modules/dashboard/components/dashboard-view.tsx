"use client";

import Link from "next/link";
import { ArrowRight, CircleDollarSign, Plus } from "lucide-react";
import { ButtonLink } from "@/components/base/buttons/button";
import { BountyCard } from "@/modules/bounties/components/bounty-card";
import { SubmissionStatusBadge } from "@/modules/bounties/components/status-badge";
import { useDashboard } from "../hooks/use-dashboard";
import { WorkspaceLayout } from "./workspace-layout";

export function DashboardView() {
  const { metrics, ownedBounties, mySubmissions, bounties } = useDashboard();
  const stats = [{ label: "Active bounties", value: metrics.activeBounties }, { label: "Rewards listed", value: `${metrics.listedRewards} USDC` }, { label: "Work submitted", value: metrics.submittedWork }, { label: "Rewards won", value: `${metrics.wonRewards} USDC` }];
  return <WorkspaceLayout title="Overview" description="A clear view of the work you create and contribute to." action={<ButtonLink href="/create" size="small" leadingIcon={Plus}>Create bounty</ButtonLink>}><div className="grid grid-cols-2 gap-3 lg:grid-cols-4">{stats.map((stat) => <section key={stat.label} className="card-surface p-4"><p className="text-title-3-semibold">{stat.value}</p><p className="mt-2 text-body-2-regular text-text-tertiary">{stat.label}</p></section>)}</div><section className="mt-7"><div className="mb-3 flex items-center justify-between"><h2 className="text-headline-semibold">Recent bounties</h2><Link href="/dashboard/bounties" className="inline-flex items-center gap-1 text-body-2-medium text-accent-600">View all<ArrowRight className="size-4"/></Link></div><div className="grid gap-2">{ownedBounties.slice(0, 2).map((bounty) => <BountyCard key={bounty.id} bounty={bounty}/>)}</div></section><section className="mt-7"><div className="mb-3 flex items-center justify-between"><h2 className="text-headline-semibold">Your latest submissions</h2><Link href="/dashboard/submissions" className="inline-flex items-center gap-1 text-body-2-medium text-accent-600">View all<ArrowRight className="size-4"/></Link></div><div className="card-surface divide-y divide-separator-border">{mySubmissions.map((submission) => { const bounty = bounties.find((item) => item.id === submission.bountyId); return <Link href={bounty ? `/bounties/${bounty.slug}` : "#"} key={submission.id} className="flex items-center justify-between gap-4 p-4 hover:bg-background-secondary-hover"><div><p className="text-body-medium">{bounty?.title ?? "Bounty"}</p><p className="mt-1 text-body-2-regular text-text-tertiary">Submitted {submission.submittedAt}</p></div><SubmissionStatusBadge status={submission.status}/></Link>; })}</div></section></WorkspaceLayout>;
}
