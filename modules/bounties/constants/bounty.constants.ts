import type { AppNotification, Bounty, BountyCategory, ReferralActivity, Submission, UserProfile } from "../types/bounty.types";

export const CATEGORIES: BountyCategory[] = ["Development", "Design", "Content", "Community", "Research"];
export const SKILLS = ["React", "TypeScript", "Solana", "Rust", "Figma", "Motion", "Writing", "Research", "Community"];
export const CURRENT_USER_ID = "user-bee";

const doc = (summary: string, bullets: string[]) => ({
  type: "doc",
  content: [
    { type: "paragraph", content: [{ type: "text", text: summary }] },
    { type: "heading", attrs: { level: 2 }, content: [{ type: "text", text: "What success looks like" }] },
    { type: "bulletList", content: bullets.map((text) => ({ type: "listItem", content: [{ type: "paragraph", content: [{ type: "text", text }] }] })) },
  ],
});

export const DEMO_PROFILE: UserProfile = {
  id: CURRENT_USER_ID,
  name: "Alex Morgan",
  username: "alexbuilds",
  avatar: "AM",
  profileCover: "ocean",
  bio: "Product designer and frontend builder exploring better onchain work.",
  skills: ["React", "Figma", "Motion"],
  interests: ["Design", "Development"],
  solanaWalletAddress: "Bee9xj7Ds1v4kTQ8X2nW7mZ5cJr3pL6aVfY",
  verified: true,
  reputation: 92,
  notifications: { product: true, submissions: true, newsletter: false },
};

export const SEED_BOUNTIES: Bounty[] = [
  {
    id: "b-1", slug: "solana-mobile-onboarding", title: "Design a frictionless Solana mobile onboarding", summary: "Create a polished onboarding flow that helps first-time users understand wallets without crypto jargon.",
    description: doc("We are rebuilding the first five minutes of our mobile product. Your task is to turn wallet creation, recovery, and the first USDC receive flow into a calm, trustworthy experience.", ["A clickable Figma prototype for six core screens", "A short rationale covering trust, recovery, and empty states", "Light and dark variants using the supplied design tokens"]),
    category: "Design", skills: ["Figma", "Research"], creator: { id: "c-1", name: "Northstar Labs", username: "northstarlabs", avatar: "NL", verified: true, reputation: 98, paidBounties: 41 }, eligibility: "Verified talent", reward: { amount: 850, currency: "USDC", network: "solana" }, deadline: "2026-09-18", status: "open", applicantsCount: 18, createdAt: "2026-09-02", deliverables: ["Figma prototype", "UX rationale", "Design token handoff"], featured: true,
  },
  {
    id: "b-2", slug: "open-source-wallet-adapter", title: "Improve our open-source wallet adapter", summary: "Ship resilient connection states and a documented React example for a Solana wallet adapter.",
    description: doc("Help developers integrate our wallet package with confidence. Improve error recovery, add a reference example, and document the expected connection lifecycle.", ["Pull request with typed connection states", "Example built with React and TypeScript", "Migration notes and test coverage"]),
    category: "Development", skills: ["React", "TypeScript", "Solana"], creator: { id: "c-2", name: "Dialectic", username: "dialectic", avatar: "DI", verified: true, reputation: 95, paidBounties: 27 }, eligibility: "Open to everyone", reward: { amount: 1200, currency: "USDC", network: "solana" }, deadline: "2026-09-24", status: "open", applicantsCount: 9, createdAt: "2026-09-01", deliverables: ["Production pull request", "Integration example", "Developer documentation"], featured: true,
  },
  {
    id: "b-3", slug: "creator-economy-report", title: "Research the next wave of onchain creator tools", summary: "Map the strongest creator products on Solana and turn the findings into an actionable landscape report.",
    description: doc("We want evidence, not a list of links. Interview builders, compare product mechanics, and identify gaps a small team can credibly pursue.", ["Landscape of at least 20 relevant products", "Five short builder or creator interviews", "Prioritized opportunity map with supporting evidence"]),
    category: "Research", skills: ["Research", "Writing"], creator: { id: "c-3", name: "Common Ground", username: "commonground", avatar: "CG", verified: false, reputation: 84, paidBounties: 12 }, eligibility: "Open to everyone", reward: { amount: 500, currency: "USDC", network: "solana" }, deadline: "2026-09-29", status: "open", applicantsCount: 23, createdAt: "2026-08-30", deliverables: ["Research database", "Written report", "Opportunity matrix"],
  },
  {
    id: "b-4", slug: "beework-launch-kit", title: "Create a launch content kit for Beework", summary: "Develop a concise launch narrative and a reusable set of social posts for a new bounty marketplace.",
    description: doc("Beework needs a launch voice that feels optimistic, useful, and credible to builders. Create modular copy the team can reuse across launch week.", ["Launch narrative and messaging hierarchy", "Ten social posts with visual directions", "Community announcement and FAQ"]),
    category: "Content", skills: ["Writing", "Community"], creator: { id: CURRENT_USER_ID, name: "Alex Morgan", username: "alexbuilds", avatar: "AM", verified: true, reputation: 92, paidBounties: 6 }, eligibility: "Open to everyone", reward: { amount: 320, currency: "USDC", network: "solana" }, deadline: "2026-09-15", status: "reviewing", applicantsCount: 7, createdAt: "2026-08-27", deliverables: ["Messaging document", "Social copy pack", "Launch FAQ"],
  },
  {
    id: "b-5", slug: "rust-indexer-optimization", title: "Optimize a Rust event indexer", summary: "Profile and improve an indexer that processes high-volume Solana program events.",
    description: doc("The current indexer is correct but falls behind during bursts. Find the bottleneck, improve throughput, and document the tradeoffs.", ["Benchmark before and after changes", "Reviewed Rust implementation", "Operational notes and failure-mode analysis"]),
    category: "Development", skills: ["Rust", "Solana"], creator: { id: "c-4", name: "Helio Works", username: "helioworks", avatar: "HW", verified: true, reputation: 97, paidBounties: 33 }, eligibility: "Verified talent", reward: { amount: 2000, currency: "USDC", network: "solana" }, deadline: "2026-08-28", status: "completed", applicantsCount: 12, createdAt: "2026-08-02", deliverables: ["Benchmarks", "Merged pull request", "Runbook"],
  },
  {
    id: "b-6", slug: "design-community-dashboard", title: "Design a community dashboard", summary: "Create a clear dashboard for tracking community momentum and contributor impact.",
    description: doc("Turn community activity into a calm, useful dashboard that helps teams understand where momentum is building.", ["Responsive Figma prototype", "Component states and empty states", "Short rationale for the information hierarchy"]),
    category: "Design", skills: ["Figma", "Research"], creator: { id: "c-5", name: "Open Current", username: "opencurrent", avatar: "OC", verified: true, reputation: 91, paidBounties: 18 }, eligibility: "Open to everyone", reward: { amount: 650, currency: "USDC", network: "solana" }, deadline: "2026-09-30", status: "open", applicantsCount: 14, createdAt: "2026-08-25", deliverables: ["Figma prototype", "UI inventory", "Design rationale"],
  },
];

export const SEED_SUBMISSIONS: Submission[] = [
  { id: "s-1", bountyId: "b-4", contributorId: "talent-1", contributorName: "Maya Chen", contributorAvatar: "MC", pitch: "I built a concise narrative around credible work and assembled a modular launch sequence.", deliverableUrl: "https://example.com/beework-launch", attachments: ["launch-messaging.pdf"], status: "shortlisted", submittedAt: "2026-09-03" },
  { id: "s-2", bountyId: "b-4", contributorId: "talent-2", contributorName: "Jordan Lee", contributorAvatar: "JL", pitch: "My concept focuses on proof of work, transparent rewards, and community momentum.", deliverableUrl: "https://example.com/concept", attachments: [], status: "submitted", submittedAt: "2026-09-04" },
  { id: "s-3", bountyId: "b-2", contributorId: CURRENT_USER_ID, contributorName: "Alex Morgan", contributorAvatar: "AM", pitch: "A resilient state-machine approach with an accessible connection example.", deliverableUrl: "https://github.com/example/pull/42", attachments: [], status: "submitted", submittedAt: "2026-09-02" },
  { id: "s-4", bountyId: "b-1", contributorId: CURRENT_USER_ID, contributorName: "Alex Morgan", contributorAvatar: "AM", pitch: "A warm, accessible onboarding direction with a clear path from first touch to first transaction.", deliverableUrl: "https://figma.com/example/solana-onboarding", attachments: ["onboarding-flow.pdf"], status: "winner", submittedAt: "2026-08-25", paidAt: "2026-08-29" },
  { id: "s-5", bountyId: "b-6", contributorId: CURRENT_USER_ID, contributorName: "Alex Morgan", contributorAvatar: "AM", pitch: "A focused dashboard concept that makes contribution health easy to scan at a glance.", deliverableUrl: "https://figma.com/example/community-dashboard", attachments: [], status: "submitted", submittedAt: "2026-09-01" },
];

export const SEED_REFERRALS: ReferralActivity[] = [
  { id: "r-1", name: "Sam Rivera", avatar: "SR", event: "published", reward: 4.5, occurredAt: "2026-09-01" },
  { id: "r-2", name: "Nadia Park", avatar: "NP", event: "joined", reward: 0, occurredAt: "2026-08-28" },
];

export const SEED_NOTIFICATIONS: AppNotification[] = [
  { id: "n-1", title: "New submission", description: "Jordan submitted work to your Beework launch bounty.", kind: "submission", read: false, createdAt: "20 min ago" },
  { id: "n-2", title: "Deadline approaching", description: "Your wallet adapter bounty closes in 5 days.", kind: "deadline", read: false, createdAt: "2 hr ago" },
  { id: "n-3", title: "Referral reward", description: "You earned 4.50 USDC from Sam's first bounty.", kind: "referral", read: true, createdAt: "4 days ago" },
];
