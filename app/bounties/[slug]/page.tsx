import type { Metadata } from "next";
import { BountyDetailTabsView } from "@/modules/bounties/components/detail/bounty-detail-tabs-view";

export const metadata: Metadata = { title: "Bounty" };

export default async function BountyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <BountyDetailTabsView slug={slug}/>;
}
