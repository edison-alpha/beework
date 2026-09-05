"use client";

import { useMemo, useState } from "react";
import type { Bounty, BountyCategory } from "../types/bounty.types";
import { isBountyMatch } from "../utils/bounty.utils";

export type BountySort = "recommended" | "reward" | "newest" | "deadline";

export function useBountyFilters(bounties: Bounty[], initialQuery = "") {
  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState<BountyCategory | "All">("All");
  const [status, setStatus] = useState<"active" | "completed" | "all">("active");
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [minimumReward, setMinimumReward] = useState(0);
  const [sort, setSort] = useState<BountySort>("recommended");

  const results = useMemo(() => bounties
    .filter((bounty) => isBountyMatch(bounty, query))
    .filter((bounty) => category === "All" || bounty.category === category)
    .filter((bounty) => status === "all" || (status === "active" ? bounty.status !== "completed" : bounty.status === "completed"))
    .filter((bounty) => !verifiedOnly || bounty.creator.verified)
    .filter((bounty) => bounty.reward.amount >= minimumReward)
    .sort((a, b) => {
      if (sort === "reward") return b.reward.amount - a.reward.amount;
      if (sort === "newest") return b.createdAt.localeCompare(a.createdAt);
      if (sort === "deadline") return a.deadline.localeCompare(b.deadline);
      return Number(Boolean(b.featured)) - Number(Boolean(a.featured));
    }), [bounties, category, minimumReward, query, sort, status, verifiedOnly]);

  return { results, query, setQuery, category, setCategory, status, setStatus, verifiedOnly, setVerifiedOnly, minimumReward, setMinimumReward, sort, setSort };
}
