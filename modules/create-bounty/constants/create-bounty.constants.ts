import type { BountyDraft } from "@/modules/bounties/types/bounty.types";

export const DRAFT_STORAGE_KEY = "beework:create-draft:v1";
export const CREATE_STEPS = ["Basics", "Scope", "Reward & deadline", "Review"] as const;

export function createEmptyDraft(): BountyDraft {
  const deadline = new Date(Date.now() + 14 * 86_400_000).toISOString().slice(0, 10);
  return {
    title: "",
    summary: "",
    description: { type: "doc", content: [{ type: "paragraph" }] },
    category: "Development",
    skills: [],
    eligibility: "Open to everyone",
    amount: 250,
    deadline,
    deliverables: [""],
  };
}
