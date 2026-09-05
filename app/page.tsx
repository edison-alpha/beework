import { MarketplaceView } from "@/modules/bounties/components/marketplace-view";

export default async function HomePage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q = "" } = await searchParams;
  return <MarketplaceView initialQuery={q}/>;
}
