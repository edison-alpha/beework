"use client";

import { useMemo } from "react";
import { usePlatform } from "@/modules/platform/context/platform-context";
import { getDashboardMetrics } from "../api/dashboard.api";

export function useDashboard() {
  const platform = usePlatform();
  const ownedBounties = useMemo(() => platform.bounties.filter((item) => item.creator.id === platform.profile.id), [platform.bounties, platform.profile.id]);
  const mySubmissions = useMemo(() => platform.submissions.filter((item) => item.contributorId === platform.profile.id), [platform.profile.id, platform.submissions]);
  const receivedSubmissions = useMemo(() => platform.submissions.filter((item) => ownedBounties.some((bounty) => bounty.id === item.bountyId)), [ownedBounties, platform.submissions]);
  const metrics = useMemo(() => getDashboardMetrics(platform.bounties, platform.submissions, platform.profile.id), [platform.bounties, platform.profile.id, platform.submissions]);
  return { ...platform, ownedBounties, mySubmissions, receivedSubmissions, metrics };
}
