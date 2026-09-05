import type { JSONContent } from "@tiptap/react";

export type BountyCategory = "Development" | "Design" | "Content" | "Community" | "Research";
export type BountyStatus = "draft" | "open" | "reviewing" | "awarded" | "completed";
export type SubmissionStatus = "submitted" | "shortlisted" | "winner" | "rejected";

export interface Reward {
  amount: number;
  currency: "USDC";
  network: "solana";
}

export interface Creator {
  id: string;
  name: string;
  username: string;
  avatar: string;
  verified: boolean;
  reputation: number;
  paidBounties: number;
}

export interface Bounty {
  id: string;
  slug: string;
  title: string;
  summary: string;
  description: JSONContent;
  category: BountyCategory;
  skills: string[];
  creator: Creator;
  eligibility: "Open to everyone" | "Verified talent" | "Invite only";
  reward: Reward;
  deadline: string;
  status: BountyStatus;
  applicantsCount: number;
  createdAt: string;
  deliverables: string[];
  featured?: boolean;
}

export interface Submission {
  id: string;
  bountyId: string;
  contributorId: string;
  contributorName: string;
  contributorAvatar: string;
  pitch: string;
  deliverableUrl: string;
  attachments: string[];
  status: SubmissionStatus;
  submittedAt: string;
}

export interface UserProfile {
  id: string;
  privyUserId?: string;
  name: string;
  username: string;
  avatar: string;
  profileCover: "ocean" | "sunset" | "violet";
  bio: string;
  skills: string[];
  interests: string[];
  solanaWalletAddress: string;
  verified: boolean;
  reputation: number;
  notifications: { product: boolean; submissions: boolean; newsletter: boolean };
}

export interface ReferralActivity {
  id: string;
  name: string;
  avatar: string;
  event: "joined" | "published" | "completed";
  reward: number;
  occurredAt: string;
}

export interface AppNotification {
  id: string;
  title: string;
  description: string;
  kind: "submission" | "award" | "deadline" | "referral";
  read: boolean;
  createdAt: string;
}

export interface BountyDraft {
  title: string;
  summary: string;
  description: JSONContent;
  category: BountyCategory;
  skills: string[];
  eligibility: Bounty["eligibility"];
  amount: number;
  deadline: string;
  deliverables: string[];
}
