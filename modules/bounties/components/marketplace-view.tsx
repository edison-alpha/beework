"use client";

import { AnimatePresence } from "motion/react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { Avatar } from "@/components/base/avatar/avatar";
import { useAuth } from "@/modules/auth/context/auth-context";
import { usePlatform } from "@/modules/platform/context/platform-context";
import { useBountyFilters } from "../hooks/use-bounty-filters";
import { BountyCard } from "./bounty-card";

export function MarketplaceView({ initialQuery = "" }: { initialQuery?: string }) {
  const { bounties, profile } = usePlatform();
  const { authenticated } = useAuth();
  const filters = useBountyFilters(bounties, initialQuery);
  const [mine, setMine] = useState(false);
  const displayed = mine ? filters.results.filter((item) => item.creator.id === profile.id) : filters.results;

  useEffect(() => {
    if (!authenticated) setMine(false);
  }, [authenticated]);

  return (
    <section className="mx-auto w-full max-w-[920px] px-3 py-3 pb-24 sm:px-5 sm:py-5 sm:pb-5">
      <div className="sticky top-14 z-40 -mx-3 mb-3 bg-background-full/95 px-3 py-3 backdrop-blur-xl sm:-mx-5 sm:px-5">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button onClick={() => setMine(false)} className={mine ? "focus-ring rounded-full border border-border-button-default bg-background-primary-default px-3 py-1.5 text-body-2-medium text-text-secondary" : "focus-ring rounded-full bg-text-primary px-3 py-1.5 text-body-2-medium text-background-primary-default"}>All bounties</button>
            {authenticated && <button onClick={() => setMine(true)} className={mine ? "focus-ring inline-flex items-center gap-2 rounded-full border border-accent-500 bg-accent-50 px-3 py-1.5 text-body-2-medium text-accent-700 dark:bg-accent-950 dark:text-accent-300" : "focus-ring inline-flex items-center gap-2 rounded-full border border-accent-500 bg-background-primary-default px-3 py-1.5 text-body-2-medium text-accent-600"}><Avatar initials={profile.avatar} size="xs" color="blue"/>Your bounties</button>}
          </div>
        </div>
      </div>
      <div className="grid gap-2">
        <AnimatePresence mode="popLayout">{displayed.map((bounty) => <BountyCard key={bounty.id} bounty={bounty}/>)}</AnimatePresence>
        {displayed.length === 0 && <div className="rounded-xl border border-dashed border-border-button-default py-16 text-center"><p className="text-headline-medium">No bounties found</p><p className="mt-1 text-body-2-regular text-text-secondary">Try a different filter or publish your first bounty.</p></div>}
      </div>
      {authenticated && <Link href="/create" aria-label="Create bounty" className="fixed right-5 bottom-5 z-50 grid size-14 place-items-center rounded-full bg-accent-600 text-white shadow-xl shadow-accent-600/30 transition-transform hover:scale-105 active:scale-95 md:hidden"><Plus className="size-7" /></Link>}
    </section>
  );
}
