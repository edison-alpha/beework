"use client";

import { useMemo } from "react";
import { usePlatform } from "@/modules/platform/context/platform-context";
import { findPublicProfile } from "../api/profile.api";

export function usePublicProfile(username: string) {
  const { profile, bounties, submissions } = usePlatform();
  const person = useMemo(() => findPublicProfile(username, profile, bounties), [bounties, profile, username]);
  const published = useMemo(() => bounties.filter((item) => item.creator.username === username), [bounties, username]);
  const submittedWork = useMemo(() => username === profile.username ? submissions.filter((item) => item.contributorId === profile.id) : [], [profile, submissions, username]);
  const completedWork = useMemo(() => submittedWork.filter((item) => item.status === "winner"), [submittedWork]);
  const earned = useMemo(() => completedWork.reduce((total, submission) => total + (bounties.find((bounty) => bounty.id === submission.bountyId)?.reward.amount ?? 0), 0), [bounties, completedWork]);
  const activities = useMemo(() => [
    ...published.map((bounty) => ({ id: `published-${bounty.id}`, kind: "published" as const, date: bounty.createdAt, bounty })),
    ...submittedWork.map((submission) => {
      const bounty = bounties.find((item) => item.id === submission.bountyId);
      return { id: `submission-${submission.id}`, kind: submission.status === "winner" ? "won" as const : "submitted" as const, date: submission.submittedAt, bounty };
    }),
  ].sort((left, right) => right.date.localeCompare(left.date)), [bounties, published, submittedWork]);
  return { person, published, completedWork, earned, activities };
}
