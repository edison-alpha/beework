"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { Icon } from "@iconify/react";
import { Avatar } from "@/components/base/avatar/avatar";
import { Chip } from "@/components/base/badges/chip";
import { VerifiedIcon } from "@/components/foundations/icons/brand-icons";
import type { Bounty } from "../types/bounty.types";
import { deadlineLabel } from "../utils/bounty.utils";
import { RewardBadge } from "./reward-badge";

export function BountyCard({ bounty, activity }: { bounty: Bounty; activity?: { kind: "published" | "submitted" | "won" | "paid"; date: string } }) {
  const activityLabel = activity?.kind === "published" ? "Published" : activity?.kind === "submitted" ? "Submitted" : activity?.kind === "paid" ? "Paid" : "Won";
  return (
    <motion.article layout initial={{ opacity: 0, y: 5 }} animate={{ opacity: bounty.status === "completed" ? .55 : 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: .18 }} className="group rounded-xl border border-border-button-default bg-background-primary-default transition-colors hover:bg-background-secondary-default">
      <Link href={`/bounties/${bounty.slug}`} className="focus-ring grid min-h-[92px] grid-cols-[48px_minmax(0,1fr)] items-center gap-3 rounded-xl p-2.5 sm:grid-cols-[52px_minmax(0,1fr)_145px] sm:gap-4">
        <Avatar initials={bounty.creator.avatar} size="lg" color="blue" className="size-12 sm:size-[52px]" />
        <div className="min-w-0 self-center">
          <h2 className="truncate text-headline-semibold text-text-primary transition-colors group-hover:text-accent-600">{bounty.title}</h2>
          <p className="mt-0.5 flex items-center gap-1 truncate text-body-2-regular text-text-tertiary">@{bounty.creator.username}{bounty.creator.verified && <VerifiedIcon className="size-3.5"/>}</p>
          <div className="mt-2 flex gap-1.5 overflow-hidden">{activity && <Chip variant="caption" color={activity.kind === "won" ? "yellow" : activity.kind === "paid" ? "lime" : "soft"}>{(activity.kind === "won" || activity.kind === "paid") && <Icon icon={activity.kind === "won" ? "solar:cup-star-bold" : "solar:wallet-money-bold"} className="mr-1 size-3.5" aria-hidden="true" />}{activityLabel}</Chip>}{bounty.eligibility === "Verified talent" && <Chip variant="caption" color="soft">Verified only</Chip>}<Chip variant="caption" color="soft">{bounty.category}</Chip>{bounty.skills.slice(0, 1).map((skill) => <Chip key={skill} variant="caption" color="soft" className="hidden sm:inline-flex">{skill}</Chip>)}</div>
        </div>
        <div className="col-span-2 flex items-end justify-between border-t border-separator-border pt-2 sm:col-span-1 sm:block sm:border-0 sm:pt-0 sm:text-right"><RewardBadge amount={bounty.reward.amount} compact/><p className="text-caption-1-medium text-text-tertiary sm:mt-1">{activity ? activity.date : bounty.status === "completed" ? "Completed" : deadlineLabel(bounty.deadline)}</p></div>
      </Link>
    </motion.article>
  );
}
