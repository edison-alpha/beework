"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useReducer } from "react";
import type { ReactNode } from "react";
import { DEMO_PROFILE, SEED_BOUNTIES, SEED_NOTIFICATIONS, SEED_REFERRALS, SEED_SUBMISSIONS } from "@/modules/bounties/constants/bounty.constants";
import type { AppNotification, Bounty, BountyDraft, ReferralActivity, Submission, SubmissionStatus, UserProfile } from "@/modules/bounties/types/bounty.types";
import { useAuth } from "@/modules/auth/context/auth-context";

const STORAGE_KEY = "beework:demo-state:v1";

interface PlatformState {
  hydrated: boolean;
  profile: UserProfile;
  bounties: Bounty[];
  submissions: Submission[];
  referrals: ReferralActivity[];
  notifications: AppNotification[];
}

type Action =
  | { type: "hydrate"; state: Omit<PlatformState, "hydrated"> }
  | { type: "create-bounty"; bounty: Bounty }
  | { type: "submit-work"; submission: Submission }
  | { type: "set-submission-status"; id: string; status: SubmissionStatus }
  | { type: "save-profile"; profile: UserProfile }
  | { type: "toggle-notification"; id: string }
  | { type: "mark-notifications-read" }
  | { type: "mark-notification-read"; id: string }
  | { type: "reset" };

const initialState: PlatformState = {
  hydrated: false,
  profile: DEMO_PROFILE,
  bounties: SEED_BOUNTIES,
  submissions: SEED_SUBMISSIONS,
  referrals: SEED_REFERRALS,
  notifications: SEED_NOTIFICATIONS,
};

function reducer(state: PlatformState, action: Action): PlatformState {
  switch (action.type) {
    case "hydrate": return { ...action.state, hydrated: true };
    case "create-bounty": return { ...state, bounties: [action.bounty, ...state.bounties] };
    case "submit-work": return {
      ...state,
      submissions: [action.submission, ...state.submissions],
      bounties: state.bounties.map((bounty) => bounty.id === action.submission.bountyId ? { ...bounty, applicantsCount: bounty.applicantsCount + 1 } : bounty),
    };
    case "set-submission-status": {
      const target = state.submissions.find((submission) => submission.id === action.id);
      if (!target) return state;
      const isWinner = action.status === "winner";
      return {
        ...state,
        submissions: state.submissions.map((submission) => {
          if (submission.id === action.id) return { ...submission, status: action.status };
          if (isWinner && submission.bountyId === target.bountyId) return { ...submission, status: "rejected" };
          return submission;
        }),
        bounties: state.bounties.map((bounty) => isWinner && bounty.id === target.bountyId ? { ...bounty, status: "completed" } : bounty),
        notifications: isWinner ? [{ id: `n-${Date.now()}`, title: "Winner selected", description: `${target.contributorName} received a simulated USDC award.`, kind: "award", read: false, createdAt: "Just now" }, ...state.notifications] : state.notifications,
      };
    }
    case "save-profile": return {
      ...state,
      profile: action.profile,
      bounties: state.bounties.map((bounty) => bounty.creator.id === action.profile.id ? {
        ...bounty, creator: { ...bounty.creator, name: action.profile.name, username: action.profile.username, avatar: action.profile.avatar },
      } : bounty),
      submissions: state.submissions.map((submission) => submission.contributorId === action.profile.id ? {
        ...submission, contributorName: action.profile.name, contributorAvatar: action.profile.avatar,
      } : submission),
    };
    case "toggle-notification": return { ...state, notifications: state.notifications.map((item) => item.id === action.id ? { ...item, read: !item.read } : item) };
    case "mark-notifications-read": return { ...state, notifications: state.notifications.map((item) => ({ ...item, read: true })) };
    case "mark-notification-read": return { ...state, notifications: state.notifications.map((item) => item.id === action.id ? { ...item, read: true } : item) };
    case "reset": return { ...initialState, hydrated: true };
    default: return state;
  }
}

function slugify(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function toUsername(value: string) {
  const normalized = value.toLowerCase().replace(/[^a-z0-9_]+/g, "").slice(0, 24);
  return normalized || "beework_member";
}

function toInitials(value: string) {
  return value.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toUpperCase() || "BW";
}

interface PlatformContextValue extends PlatformState {
  createBounty: (draft: BountyDraft) => Bounty;
  submitWork: (input: Pick<Submission, "bountyId" | "pitch" | "deliverableUrl" | "attachments">) => Submission | null;
  setSubmissionStatus: (id: string, status: SubmissionStatus) => void;
  saveProfile: (profile: UserProfile) => void;
  toggleNotification: (id: string) => void;
  markNotificationsRead: () => void;
  markNotificationRead: (id: string) => void;
  resetDemo: () => void;
}

const PlatformContext = createContext<PlatformContextValue | null>(null);

export function PlatformProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { authenticated, user } = useAuth();

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) dispatch({ type: "hydrate", state: JSON.parse(raw) as Omit<PlatformState, "hydrated"> });
      else dispatch({ type: "hydrate", state: { ...initialState, hydrated: undefined } as unknown as Omit<PlatformState, "hydrated"> });
    } catch {
      dispatch({ type: "hydrate", state: { profile: DEMO_PROFILE, bounties: SEED_BOUNTIES, submissions: SEED_SUBMISSIONS, referrals: SEED_REFERRALS, notifications: SEED_NOTIFICATIONS } });
    }
  }, []);

  useEffect(() => {
    if (!state.hydrated || !authenticated || !user) return;
    if (state.profile.privyUserId === user.id && state.profile.id === user.id && state.profile.solanaWalletAddress === (user.walletAddress || "")) return;

    const isReturningUser = state.profile.privyUserId === user.id;
    const usernameSource = user.email?.split("@")[0] || user.name;
    dispatch({
      type: "save-profile",
      profile: isReturningUser
        ? { ...state.profile, id: user.id, solanaWalletAddress: user.walletAddress || "" }
        : {
            ...DEMO_PROFILE,
            id: user.id,
            privyUserId: user.id,
            name: user.name,
            username: toUsername(usernameSource),
            avatar: toInitials(user.name),
            solanaWalletAddress: user.walletAddress || "",
            verified: false,
            reputation: 0,
          },
    });
  }, [authenticated, state.hydrated, state.profile, user]);

  useEffect(() => {
    if (!state.hydrated) return;
    const { hydrated: _hydrated, ...persisted } = state;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(persisted));
  }, [state]);

  const createBounty = useCallback((draft: BountyDraft) => {
    const bounty: Bounty = {
      id: `b-${Date.now()}`,
      slug: `${slugify(draft.title)}-${Date.now().toString().slice(-4)}`,
      title: draft.title,
      summary: draft.summary,
      description: draft.description,
      category: draft.category,
      skills: draft.skills,
      creator: { id: state.profile.id, name: state.profile.name, username: state.profile.username, avatar: state.profile.avatar, verified: state.profile.verified, reputation: state.profile.reputation, paidBounties: state.bounties.filter((item) => item.creator.id === state.profile.id && item.status === "completed").length },
      eligibility: draft.eligibility,
      reward: { amount: draft.amount, currency: "USDC", network: "solana" },
      minimumPayout: draft.minimumPayout ?? Math.max(5, Math.round(draft.amount * 0.1)),
      deadline: draft.deadline,
      status: "open",
      applicantsCount: 0,
      createdAt: new Date().toISOString().slice(0, 10),
      deliverables: draft.deliverables,
    };
    dispatch({ type: "create-bounty", bounty });
    return bounty;
  }, [state.bounties, state.profile]);

  const submitWork = useCallback((input: Pick<Submission, "bountyId" | "pitch" | "deliverableUrl" | "attachments">) => {
    const bounty = state.bounties.find((item) => item.id === input.bountyId);
    if (!bounty || bounty.status !== "open" || bounty.creator.id === state.profile.id || state.submissions.some((item) => item.bountyId === input.bountyId && item.contributorId === state.profile.id)) return null;
    const submission: Submission = { id: `s-${Date.now()}`, contributorId: state.profile.id, contributorName: state.profile.name, contributorAvatar: state.profile.avatar, status: "submitted", submittedAt: new Date().toISOString().slice(0, 10), ...input };
    dispatch({ type: "submit-work", submission });
    return submission;
  }, [state.bounties, state.profile, state.submissions]);

  const value = useMemo<PlatformContextValue>(() => ({
    ...state,
    createBounty,
    submitWork,
    setSubmissionStatus: (id, status) => dispatch({ type: "set-submission-status", id, status }),
    saveProfile: (profile) => dispatch({ type: "save-profile", profile }),
    toggleNotification: (id) => dispatch({ type: "toggle-notification", id }),
    markNotificationsRead: () => dispatch({ type: "mark-notifications-read" }),
    markNotificationRead: (id) => dispatch({ type: "mark-notification-read", id }),
    resetDemo: () => dispatch({ type: "reset" }),
  }), [createBounty, state, submitWork]);

  return <PlatformContext.Provider value={value}>{children}</PlatformContext.Provider>;
}

export function usePlatform() {
  const context = useContext(PlatformContext);
  if (!context) throw new Error("usePlatform must be used inside PlatformProvider");
  return context;
}
