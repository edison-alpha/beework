"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import type { Bounty, BountyDraft } from "@/modules/bounties/types/bounty.types";
import { usePlatform } from "@/modules/platform/context/platform-context";
import { createEmptyDraft, DRAFT_STORAGE_KEY } from "../constants/create-bounty.constants";
import { useDraftAutosave } from "../hooks/use-draft-autosave";
import { validateStep } from "../utils/create-bounty.utils";

interface CreateBountyContextValue {
  draft: BountyDraft;
  step: number;
  error: string | null;
  savedAt: Date | null;
  update: <K extends keyof BountyDraft>(key: K, value: BountyDraft[K]) => void;
  apply: (partial: Partial<BountyDraft>) => void;
  next: () => boolean;
  back: () => void;
  goTo: (step: number) => void;
  review: () => boolean;
  publish: () => Bounty | null;
}

const CreateBountyContext = createContext<CreateBountyContextValue | null>(null);

export function CreateBountyProvider({ children }: { children: ReactNode }) {
  const { createBounty } = usePlatform();
  const [draft, setDraft] = useState<BountyDraft>(createEmptyDraft);
  const [step, setStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);
  const savedAt = useDraftAutosave(draft, loaded);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(DRAFT_STORAGE_KEY);
      if (stored) setDraft(JSON.parse(stored) as BountyDraft);
    } catch { /* Start with a clean draft when storage is unavailable. */ }
    setLoaded(true);
  }, []);

  const value = useMemo<CreateBountyContextValue>(() => ({
    draft,
    step,
    error,
    savedAt,
    update: (key, value) => { setDraft((current) => ({ ...current, [key]: value })); setError(null); },
    apply: (partial) => { setDraft((current) => ({ ...current, ...partial })); setError(null); },
    next: () => { const message = validateStep(step, draft); setError(message); if (message) return false; setStep((current) => Math.min(current + 1, 3)); return true; },
    back: () => { setError(null); setStep((current) => Math.max(current - 1, 0)); },
    goTo: (nextStep) => { if (nextStep < step) { setError(null); setStep(nextStep); } },
    review: () => { for (let index = 0; index < 3; index += 1) { const message = validateStep(index, draft); if (message) { setStep(index); setError(message); return false; } } setError(null); return true; },
    publish: () => { for (let index = 0; index < 3; index += 1) { const message = validateStep(index, draft); if (message) { setStep(index); setError(message); return null; } } const bounty = createBounty({ ...draft, deliverables: draft.deliverables.filter(Boolean) }); localStorage.removeItem(DRAFT_STORAGE_KEY); setDraft(createEmptyDraft()); return bounty; },
  }), [createBounty, draft, error, savedAt, step]);

  return <CreateBountyContext.Provider value={value}>{children}</CreateBountyContext.Provider>;
}

export function useCreateBounty() {
  const context = useContext(CreateBountyContext);
  if (!context) throw new Error("useCreateBounty must be used inside CreateBountyProvider");
  return context;
}
