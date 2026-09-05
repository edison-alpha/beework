export const MOCK_WALLET = {
  balanceUsd: 1250,
  assets: [
    { symbol: "USDC", name: "USD Coin", network: "Solana", amount: 1250, valueUsd: 1250 },
  ],
  activity: [
    { id: "wallet-demo-1", type: "withdrawal", title: "Withdrawn", description: "To external wallet", date: "2026-09-04", amount: 500 },
    { id: "wallet-demo-2", type: "reward", title: "Bounty reward", description: "Solana onboarding design", date: "2026-09-03", amount: 1200 },
    { id: "wallet-demo-3", type: "reward", title: "Bounty reward", description: "Community content sprint", date: "2026-09-01", amount: 550 },
  ],
} as const;
