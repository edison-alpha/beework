"use client";

import { UsdcIcon } from "@/components/foundations/icons/brand-icons";
import { formatReward } from "../utils/bounty.utils";

export function RewardBadge({ amount, compact = false }: { amount: number; compact?: boolean }) {
  if (compact) {
    return (
      <div className="flex shrink-0 flex-col items-end gap-1">
        <UsdcIcon className="size-5 sm:size-6" />
        <p className="text-[28px] leading-none font-semibold tracking-[-0.04em] text-text-primary sm:text-[30px]">
          {formatReward(amount)}
        </p>
      </div>
    );
  }

  return (
    <div className="flex shrink-0 items-center gap-2.5">
      <UsdcIcon className="size-9" />
      <div className="text-right">
        <p className="text-title-3-semibold text-text-primary">{formatReward(amount)}</p>
        <p className="text-body-2-medium text-text-tertiary">USDC · Solana</p>
      </div>
    </div>
  );
}
