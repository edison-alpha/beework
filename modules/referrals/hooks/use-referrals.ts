"use client";

import { useMemo } from "react";
import { usePlatform } from "@/modules/platform/context/platform-context";
import { REFERRAL_BASE_URL } from "../constants/referral.constants";

export function useReferrals() {
  const { profile, referrals } = usePlatform();
  const link = `${REFERRAL_BASE_URL}/${profile.username}`;
  const metrics = useMemo(() => ({ paid: referrals.filter((item) => item.reward > 0).length, pending: referrals.filter((item) => item.reward === 0).length, earnings: referrals.reduce((sum, item) => sum + item.reward, 0) }), [referrals]);
  return { link, referrals, metrics };
}
