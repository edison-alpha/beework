"use client";

import Link from "next/link";
import { BriefcaseBusiness, Settings, Star, Trophy } from "lucide-react";
import { Avatar } from "@/components/base/avatar/avatar";
import { Chip } from "@/components/base/badges/chip";
import { ButtonLink } from "@/components/base/buttons/button";
import { VerifiedIcon } from "@/components/foundations/icons/brand-icons";
import { ProfileCoverBackground, type ProfileCover } from "@/components/application/profile/profile-cover-background";
import { BountyCard } from "@/modules/bounties/components/bounty-card";
import { usePlatform } from "@/modules/platform/context/platform-context";
import { usePublicProfile } from "../hooks/use-public-profile";

export function ProfileView({ username }: { username: string }) {
  const { profile } = usePlatform();
  const { person, published, completedWork, earned, activities } = usePublicProfile(username);

  if (!person) {
    return (
      <div className="mx-auto max-w-[880px] px-4 py-24 text-center">
        <h1 className="text-title-2-medium">Profile not found</h1>
        <Link href="/" className="mt-4 inline-block text-accent-600">Return to marketplace</Link>
      </div>
    );
  }

  const bio = "bio" in person
    ? person.bio
    : `${person.name} is a verified Beework creator with ${person.paidBounties} paid bounties.`;
  const skills = "skills" in person ? person.skills : [];

  return (
    <div className="mx-auto max-w-[920px] px-4 py-8 sm:px-6">
      <section className="card-surface">
        <div className="relative h-28 overflow-hidden rounded-t-xl border-b border-separator-border bg-background-secondary-default">
          <ProfileCoverBackground cover={("profileCover" in person ? person.profileCover : "ocean") as ProfileCover} />
          <div className="absolute inset-0 bg-white/10" />
        </div>
        <div className="px-5 pb-6 sm:px-7">
          <div className="-mt-10 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <Avatar
              initials={person.avatar}
              color="blue"
              className="size-20 border-4 border-background-primary-default text-title-3-semibold"
            />
            {username === profile.username && (
              <ButtonLink
                className="sm:mb-1"
                href="/settings/profile"
                size="small"
                variant="secondary"
                leadingIcon={Settings}
              >
                Edit profile
              </ButtonLink>
            )}
          </div>
          <div className="mt-4 flex items-center gap-2">
            <h1 className="text-title-3-semibold">{person.name}</h1>
            {person.verified && <VerifiedIcon className="size-5" />}
          </div>
          <p className="mt-1 text-body-2-regular text-text-tertiary">@{person.username}</p>
          <p className="mt-4 max-w-2xl text-body-regular text-text-secondary">{bio}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {skills.map((skill) => <Chip key={skill} color="soft" variant="caption">{skill}</Chip>)}
          </div>
        </div>
      </section>

      <div className="mt-4 grid grid-cols-3 gap-3">
        {[
          { icon: Star, value: `${earned.toLocaleString()} USDC`, label: "Earned" },
          { icon: BriefcaseBusiness, value: published.length, label: "Bounties" },
          { icon: Trophy, value: completedWork.length, label: "Wins" },
        ].map(({ icon: Icon, value, label }) => (
          <section key={label} className="card-surface p-4">
            <Icon className="size-4 text-accent-600" />
            <p className="mt-3 text-title-3-semibold">{value}</p>
            <p className="text-body-2-regular text-text-tertiary">{label}</p>
          </section>
        ))}
      </div>

      <section className="mt-7">
        <h2 className="mb-3 text-headline-semibold">Activity</h2>
        <div className="grid gap-2">
          {activities.map((activity) => activity.bounty && <BountyCard key={activity.id} bounty={activity.bounty} activity={{ kind: activity.kind, date: activity.date }} />)}
          {activities.length === 0 && <div className="rounded-xl border border-dashed border-border-button-default py-12 text-center text-body-regular text-text-secondary">No activity yet.</div>}
        </div>
      </section>
    </div>
  );
}
