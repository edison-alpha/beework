import type { BountyDraft } from "@/modules/bounties/types/bounty.types";

export function validateStep(step: number, draft: BountyDraft) {
  if (step === 0) {
    if (draft.title.trim().length < 8) return "Use a clear title with at least 8 characters.";
    if (draft.summary.trim().length < 20) return "Add a summary with at least 20 characters.";
    if (draft.skills.length === 0) return "Select at least one skill.";
  }
  if (step === 1) {
    const hasDescription = JSON.stringify(draft.description).replace(/\W/g, "").length > 35;
    if (!hasDescription) return "Describe the work and what a successful result looks like.";
    if (!draft.deliverables.some((item) => item.trim().length > 2)) return "Add at least one deliverable.";
  }
  if (step === 2) {
    if (draft.amount < 10) return "The minimum reward is 10 USDC.";
    if (draft.minimumPayout < 5) return "The minimum payout is 5 USDC.";
    if (draft.minimumPayout > draft.amount) return "The minimum payout cannot exceed the total reward.";
    if (!draft.deadline || new Date(draft.deadline).getTime() <= Date.now()) return "Choose a future deadline.";
  }
  return null;
}
