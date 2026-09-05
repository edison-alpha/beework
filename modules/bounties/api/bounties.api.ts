import type { Bounty } from "../types/bounty.types";

export const bountiesApi = {
  list(source: Bounty[]) {
    return Promise.resolve(source);
  },
  getBySlug(source: Bounty[], slug: string) {
    return Promise.resolve(source.find((bounty) => bounty.slug === slug) ?? null);
  },
};
