import type { Bounty, Creator, UserProfile } from "@/modules/bounties/types/bounty.types";

export function findPublicProfile(username: string, current: UserProfile, bounties: Bounty[]): Creator | UserProfile | null {
  if (username === current.username) return current;
  return bounties.map((item) => item.creator).find((creator) => creator.username === username) ?? null;
}
