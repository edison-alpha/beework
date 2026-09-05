"use client";

import { Search, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/base/buttons/button";
import { Input } from "@/components/base/input/input";
import { CATEGORIES } from "../constants/bounty.constants";
import type { BountyCategory } from "../types/bounty.types";
import type { BountySort } from "../hooks/use-bounty-filters";
import { cx } from "@/utils/cx";

interface Props {
  query: string;
  setQuery: (value: string) => void;
  category: BountyCategory | "All";
  setCategory: (value: BountyCategory | "All") => void;
  status: "active" | "completed" | "all";
  setStatus: (value: "active" | "completed" | "all") => void;
  verifiedOnly: boolean;
  setVerifiedOnly: (value: boolean) => void;
  minimumReward: number;
  setMinimumReward: (value: number) => void;
  sort: BountySort;
  setSort: (value: BountySort) => void;
}

export function BountyFilters(props: Props) {
  return (
    <div className="card-surface grid gap-4 p-4">
      <div className="flex flex-col gap-3 lg:flex-row">
        <Input aria-label="Search bounties" placeholder="Search by skill, creator, or keyword" leadingIcon={Search} value={props.query} onChange={props.setQuery} className="flex-1" />
        <div className="grid grid-cols-2 gap-2 sm:flex">
          <select aria-label="Bounty status" value={props.status} onChange={(event) => props.setStatus(event.target.value as Props["status"])} className="focus-ring h-9 rounded-2lg border border-border-button-default bg-background-primary-default px-3 text-body-2-medium text-text-primary"><option value="active">Active</option><option value="completed">Completed</option><option value="all">All status</option></select>
          <select aria-label="Sort bounties" value={props.sort} onChange={(event) => props.setSort(event.target.value as BountySort)} className="focus-ring h-9 rounded-2lg border border-border-button-default bg-background-primary-default px-3 text-body-2-medium text-text-primary"><option value="recommended">Recommended</option><option value="reward">Highest reward</option><option value="newest">Newest</option><option value="deadline">Ending soon</option></select>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <SlidersHorizontal className="mr-1 size-4 text-foreground-icon-tertiary"/>
        {(["All", ...CATEGORIES] as const).map((item) => <button key={item} onClick={() => props.setCategory(item)} className={cx("focus-ring rounded-full border px-3 py-1.5 text-body-2-medium transition-colors", props.category === item ? "border-accent-300 bg-accent-50 text-accent-700 dark:border-accent-800 dark:bg-accent-950 dark:text-accent-300" : "border-border-button-default bg-background-primary-default text-text-secondary hover:bg-background-secondary-hover")}>{item}</button>)}
        <span className="hidden h-5 w-px bg-separator-border sm:block"/>
        <label className="focus-ring inline-flex cursor-pointer items-center gap-2 rounded-full border border-border-button-default px-3 py-1.5 text-body-2-medium text-text-secondary"><input type="checkbox" checked={props.verifiedOnly} onChange={(event) => props.setVerifiedOnly(event.target.checked)} className="accent-accent-600"/>Verified creators</label>
        <select aria-label="Minimum reward" value={props.minimumReward} onChange={(event) => props.setMinimumReward(Number(event.target.value))} className="focus-ring rounded-full border border-border-button-default bg-background-primary-default px-3 py-1.5 text-body-2-medium text-text-secondary"><option value="0">Any reward</option><option value="250">250+ USDC</option><option value="500">500+ USDC</option><option value="1000">1,000+ USDC</option></select>
        {(props.query || props.category !== "All" || props.status !== "active" || props.verifiedOnly || props.minimumReward > 0 || props.sort !== "recommended") && <Button size="xs" variant="ghost" onClick={() => { props.setQuery(""); props.setCategory("All"); props.setStatus("active"); props.setVerifiedOnly(false); props.setMinimumReward(0); props.setSort("recommended"); }}>Clear filters</Button>}
      </div>
    </div>
  );
}
