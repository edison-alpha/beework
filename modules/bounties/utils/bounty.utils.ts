import type { Bounty, BountyStatus } from "../types/bounty.types";

export function formatReward(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function deadlineLabel(deadline: string) {
  const days = Math.ceil((new Date(`${deadline}T23:59:59`).getTime() - Date.now()) / 86_400_000);
  if (days < 0) return "Closed";
  if (days === 0) return "Ends today";
  if (days === 1) return "1 day left";
  return `${days} days left`;
}

export const statusLabel: Record<BountyStatus, string> = { draft: "Draft", open: "Open", reviewing: "In review", awarded: "Awarded", completed: "Completed" };

export function isBountyMatch(bounty: Bounty, query: string) {
  const haystack = [bounty.title, bounty.summary, bounty.category, bounty.creator.name, ...bounty.skills].join(" ").toLowerCase();
  return haystack.includes(query.trim().toLowerCase());
}
