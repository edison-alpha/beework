"use client";

import { useEffect, useState } from "react";
import type { BountyDraft } from "@/modules/bounties/types/bounty.types";
import { DRAFT_STORAGE_KEY } from "../constants/create-bounty.constants";

export function useDraftAutosave(draft: BountyDraft, enabled = true) {
  const [savedAt, setSavedAt] = useState<Date | null>(null);
  useEffect(() => {
    if (!enabled) return;
    const timeout = setTimeout(() => {
      localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draft));
      setSavedAt(new Date());
    }, 450);
    return () => clearTimeout(timeout);
  }, [draft, enabled]);
  return savedAt;
}
