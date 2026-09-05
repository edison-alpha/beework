import { Chip } from "@/components/base/badges/chip";
import type { BountyStatus, SubmissionStatus } from "../types/bounty.types";
import { statusLabel } from "../utils/bounty.utils";

const bountyTone: Record<BountyStatus, "blue" | "yellow" | "purple" | "cyan" | "lime"> = { draft: "yellow", open: "lime", reviewing: "blue", awarded: "purple", completed: "cyan" };
const submissionTone: Record<SubmissionStatus, "blue" | "yellow" | "purple" | "rose"> = { submitted: "blue", shortlisted: "yellow", winner: "purple", rejected: "rose" };

export function BountyStatusBadge({ status }: { status: BountyStatus }) {
  return <Chip variant="caption" color={bountyTone[status]}>{statusLabel[status]}</Chip>;
}

export function SubmissionStatusBadge({ status }: { status: SubmissionStatus }) {
  return <Chip variant="caption" color={submissionTone[status]}>{status[0].toUpperCase() + status.slice(1)}</Chip>;
}
