import type { Bounty, Submission } from "@/modules/bounties/types/bounty.types";

export function getDashboardMetrics(bounties: Bounty[], submissions: Submission[], userId: string) {
  const created = bounties.filter((item) => item.creator.id === userId);
  const contributed = submissions.filter((item) => item.contributorId === userId);
  return {
    activeBounties: created.filter((item) => item.status !== "completed" && item.status !== "draft").length,
    listedRewards: created.reduce((sum, item) => sum + item.reward.amount, 0),
    submittedWork: contributed.length,
    wonRewards: contributed.filter((item) => item.status === "winner").reduce((sum, item) => sum + (bounties.find((bounty) => bounty.id === item.bountyId)?.reward.amount ?? 0), 0),
  };
}
