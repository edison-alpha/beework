import type { UserProfile } from "@/modules/bounties/types/bounty.types";

export const settingsApi = {
  async validateProfile(profile: UserProfile) {
    await Promise.resolve();
    if (!/^[a-z0-9_]{3,24}$/.test(profile.username)) throw new Error("Username must be 3–24 lowercase letters, numbers, or underscores.");
    const name = profile.name.trim();
    if (name.length < 2 || name.length > 60) throw new Error("Display name must be 2–60 characters.");
    if (profile.bio.length > 160) throw new Error("Bio must be 160 characters or fewer.");
    if (profile.avatar.trim().length > 2) throw new Error("Use up to two avatar initials.");
    return { ...profile, name, avatar: profile.avatar.trim().toUpperCase(), bio: profile.bio.trim() };
  },
};
