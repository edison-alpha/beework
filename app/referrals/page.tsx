import type { Metadata } from "next";
import { ReferralsView } from "@/modules/referrals/components/referrals-view";
export const metadata: Metadata = { title: "Referrals" };
export default function ReferralsPage() { return <ReferralsView/>; }
