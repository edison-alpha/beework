"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { JSONContent } from "@tiptap/react";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Copy,
  ExternalLink,
  LockKeyhole,
  Send,
  Share2,
  UsersRound,
  X,
} from "lucide-react";
import { Avatar } from "@/components/base/avatar/avatar";
import { Button } from "@/components/base/buttons/button";
import { Chip } from "@/components/base/badges/chip";
import { Input } from "@/components/base/input/input";
import {
  UsdcIcon,
  VerifiedIcon,
} from "@/components/foundations/icons/brand-icons";
import { useAuth } from "@/modules/auth/context/auth-context";
import { usePlatform } from "@/modules/platform/context/platform-context";
import { deadlineLabel } from "../../utils/bounty.utils";
import { SubmissionStatusBadge } from "../status-badge";
import { RichTextEditor } from "@/modules/create-bounty/components/rich-text-editor";

type DetailTab = "activity" | "overview" | "comments" | "submission";

type MockActivity = {
  id: string;
  name: string;
  avatar: string;
  verified?: boolean;
  time: string;
  kind: "submission" | "paid";
  amount?: string;
};

const MOCK_ACTIVITY: MockActivity[] = [
  { id: "activity-1", name: "prathamlift99", avatar: "PL", verified: true, time: "13 days ago", kind: "submission" },
  { id: "activity-2", name: "grindfi", avatar: "GF", verified: true, time: "14 days ago", kind: "submission" },
  { id: "activity-3", name: "d_web3architect", avatar: "DW", verified: true, time: "15 days ago", kind: "submission" },
  { id: "activity-4", name: "emmanuel1origbe", avatar: "EO", verified: true, time: "15 days ago", kind: "submission" },
  { id: "activity-5", name: "shellbee", avatar: "S", time: "19 days ago", kind: "paid", amount: "1.80" },
  { id: "activity-6", name: "codedtok", avatar: "C", verified: true, time: "19 days ago", kind: "paid", amount: "4.33" },
  { id: "activity-7", name: "xsmartt00", avatar: "X", time: "19 days ago", kind: "paid", amount: "2.70" },
  { id: "activity-8", name: "0xfahadxy", avatar: "F", verified: true, time: "19 days ago", kind: "paid", amount: "2.70" },
  { id: "activity-9", name: "d3rek", avatar: "D", verified: true, time: "19 days ago", kind: "paid", amount: "3.60" },
  { id: "activity-10", name: "yhomeboy24", avatar: "Y", verified: true, time: "20 days ago", kind: "submission" },
];

function RichNode({ node }: { node: JSONContent }) {
  const children = node.content?.map((child, index) => (
    <RichNode key={index} node={child} />
  ));
  if (node.type === "text") return <>{node.text}</>;
  if (node.type === "heading")
    return <h3 className="mt-6 text-headline-semibold">{children}</h3>;
  if (node.type === "bulletList")
    return <ul className="mt-3 grid list-disc gap-2 pl-5">{children}</ul>;
  if (node.type === "orderedList")
    return <ol className="mt-3 grid list-decimal gap-2 pl-5">{children}</ol>;
  if (node.type === "listItem") return <li>{children}</li>;
  if (node.type === "paragraph")
    return <p className="mt-3 leading-7">{children}</p>;
  return <>{children}</>;
}

export function BountyDetailTabsView({ slug }: { slug: string }) {
  const { bounties, profile, submissions, submitWork } = usePlatform();
  const { authenticated, login } = useAuth();
  const bounty = bounties.find((item) => item.slug === slug);
  const [tab, setTab] = useState<DetailTab>("overview");
  const [pitch, setPitch] = useState("");
  const [pitchContent, setPitchContent] = useState<JSONContent>({ type: "doc", content: [{ type: "paragraph" }] });
  const [url, setUrl] = useState("");
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([
    {
      id: "c1",
      name: "Maya Chen",
      avatar: "MC",
      text: "Is it okay to include an interactive prototype alongside the handoff?",
      time: "2 days ago",
    },
    {
      id: "c2",
      name: "Jordan Lee",
      avatar: "JL",
      text: "Excited about this brief — the deliverables are very clear.",
      time: "4 days ago",
    },
  ]);
  const [copied, setCopied] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  useEffect(() => {
    if (copied) setShareOpen(true);
  }, [copied]);
  if (!bounty)
    return (
      <div className="mx-auto max-w-[880px] px-4 py-24 text-center">
        <h1 className="text-title-2-medium">Bounty not found</h1>
        <Link href="/" className="mt-4 inline-block text-accent-600">
          Return to marketplace
        </Link>
      </div>
    );

  const bountySubmissions = submissions.filter(
    (item) => item.bountyId === bounty.id,
  );
  const activityItems: MockActivity[] = [
    ...bountySubmissions.map((submission) => ({
      id: submission.id,
      name: submission.contributorName,
      avatar: submission.contributorAvatar,
      verified: true,
      time: submission.submittedAt,
      kind: "submission" as const,
    })),
    ...MOCK_ACTIVITY,
  ];
  const mine = bountySubmissions.find(
    (item) => item.contributorId === profile.id,
  );
  const isOwner = bounty.creator.id === profile.id;
  const requiresVerification =
    bounty.eligibility === "Verified talent" && !profile.verified;
  const minimumPayout = Math.max(5, Math.round(bounty.reward.amount * 0.1));
  const tabs: Array<{ id: DetailTab; label: string }> = [
    { id: "activity", label: "Activity" },
    { id: "overview", label: "Overview" },
    { id: "comments", label: "Comments" },
    { id: "submission", label: "Your submission" },
  ];

  return (
    <div className="mx-auto max-w-[880px] px-3 py-5 sm:px-5">
      <Link
        href="/"
        className="focus-ring mb-4 inline-flex items-center gap-2 rounded-lg text-body-2-medium text-text-secondary"
      >
        <ArrowLeft className="size-4" />
        All bounties
      </Link>
      <section className="rounded-xl border border-border-button-default bg-background-primary-default p-4 sm:p-5">
        <div className="flex items-center gap-2 text-body-2-regular text-text-secondary">
          <Avatar initials={bounty.creator.avatar} size="sm" color="blue" />
          <Link
            href={`/profile/${bounty.creator.username}`}
            className="hover:text-text-primary"
          >
            {bounty.creator.name}
          </Link>
          {bounty.creator.verified && <VerifiedIcon />}
        </div>
        <h1 className="mt-4 text-title-3-semibold">{bounty.title}</h1>
        <div className="mt-2 flex flex-wrap items-center gap-2 text-body-2-regular text-text-tertiary">
          <span>{deadlineLabel(bounty.deadline)}</span>
          <span>·</span>
          <span>{bounty.applicantsCount} submissions</span>
          <span>·</span>
          <span>{bounty.category}</span>
          <button
            className="ml-auto inline-flex items-center gap-1 text-accent-600"
            onClick={() => {
              void navigator.clipboard?.writeText(location.href);
              setCopied(true);
              setTimeout(() => setCopied(false), 1500);
            }}
          >
            {copied ? (
              <Check className="size-3.5" />
            ) : (
              <Share2 className="size-3.5" />
            )}
            {copied ? "Copied" : "Share & earn"}
          </button>
        </div>
      </section>
      <section className="mt-4 grid grid-cols-3 divide-x divide-separator-border rounded-xl border border-border-button-default bg-background-primary-default py-2">
        <div className="px-3 py-3 text-center">
          <p className="text-title-3-semibold">
            {bounty.reward.amount}{" "}
            <span className="text-caption-1-semibold text-text-tertiary">
              USDC
            </span>
          </p>
          <p className="mt-1 text-body-2-regular text-text-tertiary">Total</p>
        </div>
        <div className="px-3 py-3 text-center">
          <p className="text-title-3-semibold">
            {minimumPayout}{" "}
            <span className="text-caption-1-semibold text-text-tertiary">
              USDC
            </span>
          </p>
          <p className="mt-1 text-body-2-regular text-text-tertiary">
            Minimum payout
          </p>
        </div>
        <div className="px-3 py-3 text-center">
          <p className="text-title-3-semibold">
            5{" "}
            <span className="text-caption-1-semibold text-text-tertiary">
              USDC
            </span>
          </p>
          <p className="mt-1 text-body-2-regular text-accent-600">
            Referral payout
          </p>
        </div>
      </section>
      <section className="mt-4 min-h-[430px] overflow-hidden rounded-xl border border-border-button-default bg-background-primary-default">
        <div
          role="tablist"
          aria-label="Bounty details"
          className="flex overflow-x-auto border-b border-separator-border"
        >
          {tabs.map((item) => (
            <button
              key={item.id}
              role="tab"
              aria-selected={tab === item.id}
              onClick={() => setTab(item.id)}
              className={
                tab === item.id
                  ? "focus-ring shrink-0 border-r border-separator-border bg-background-primary-default px-5 py-3 text-body-2-semibold text-text-primary"
                  : "focus-ring shrink-0 border-r border-separator-border bg-background-secondary-default px-5 py-3 text-body-2-medium text-text-tertiary hover:text-text-primary"
              }
            >
              {item.label}
            </button>
          ))}
        </div>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={tab}
            role="tabpanel"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.16 }}
            className="p-5 sm:p-7"
          >
            {tab === "overview" && (
              <div className="text-body-regular text-text-secondary">
                <div className="mb-5 flex flex-wrap gap-2">
                  <Chip color="blue" variant="caption">
                    {bounty.eligibility}
                  </Chip>
                  {bounty.skills.map((skill) => (
                    <Chip key={skill} color="soft" variant="caption">
                      {skill}
                    </Chip>
                  ))}
                </div>
                {bounty.description.content?.map((node, index) => (
                  <RichNode key={index} node={node} />
                ))}
                <h3 className="mt-7 text-headline-semibold text-text-primary">
                  Deliverables
                </h3>
                <ul className="mt-3 grid gap-2">
                  {bounty.deliverables.map((item) => (
                    <li key={item} className="flex gap-2">
                      <Check className="mt-1 size-4 shrink-0 text-accent-600" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {tab === "activity" && (
              <div className="grid gap-0">
                {activityItems.length ? (
                  activityItems.map((activity, index) => (
                    <div
                      key={activity.id}
                      className="relative flex gap-3 pb-6 last:pb-0"
                    >
                      <span className="relative z-10">
                        <Avatar
                          initials={activity.avatar}
                          color="blue"
                        />
                      </span>
                      {index < activityItems.length - 1 && (
                        <span className="absolute top-8 bottom-0 left-4 w-px bg-separator-border" />
                      )}
                      <div>
                        <p className="text-caption-1-medium text-text-tertiary">
                          {activity.time}
                        </p>
                        <p className="mt-1 flex flex-wrap items-center gap-1 text-body-medium">
                          <span>{activity.name}</span>
                          {activity.verified && <VerifiedIcon className="size-4 text-accent-600" />}
                          <span className="ml-1">{activity.kind === "paid" ? "was paid" : "made a submission"}</span>
                          {activity.amount && <strong className="ml-1">{activity.amount} USDC</strong>}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-16 text-center">
                    <UsersRound className="mx-auto size-6 text-foreground-icon-tertiary" />
                    <p className="mt-3 text-body-medium">No activity yet</p>
                  </div>
                )}
              </div>
            )}
            {tab === "comments" && (
              <div>
                <form
                  className="flex gap-2"
                  onSubmit={(event) => {
                    event.preventDefault();
                    if (!comment.trim()) return;
                    if (!authenticated) {
                      login();
                      return;
                    }
                    setComments((items) => [
                      {
                        id: String(Date.now()),
                        name: "Alex Morgan",
                        avatar: "AM",
                        text: comment,
                        time: "Just now",
                      },
                      ...items,
                    ]);
                    setComment("");
                  }}
                >
                  <Input
                    aria-label="Comment"
                    placeholder="Ask a question or leave a comment…"
                    value={comment}
                    onChange={setComment}
                    className="flex-1"
                  />
                  <Button
                    type="submit"
                    iconOnly
                    leadingIcon={Send}
                    aria-label="Post comment"
                  />
                </form>
                <div className="mt-5 divide-y divide-separator-border">
                  {comments.map((item) => (
                    <article key={item.id} className="flex gap-3 py-5">
                      <Avatar initials={item.avatar} size="md" color="blue" />
                      <div>
                        <p className="text-body-2-medium">
                          {item.name}{" "}
                          <span className="font-normal text-text-tertiary">
                            · {item.time}
                          </span>
                        </p>
                        <p className="mt-2 text-body-regular text-text-secondary">
                          {item.text}
                        </p>
                        <button className="mt-2 text-caption-1-medium text-text-tertiary hover:text-accent-600">
                          Reply
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            )}
            {tab === "submission" &&
              (isOwner ? (
                <div className="py-16 text-center">
                  <p className="text-headline-semibold">
                    You created this bounty
                  </p>
                  <p className="mt-2 text-body-regular text-text-secondary">
                    Review contributor submissions from your workspace.
                  </p>
                  <Link
                    href="/dashboard/submissions"
                    className="mt-5 inline-flex text-body-medium text-accent-600"
                  >
                    Open review workspace
                  </Link>
                </div>
              ) : mine ? (
                <div className="rounded-xl bg-background-secondary-default p-5">
                  <div className="flex items-center justify-between">
                    <h3 className="text-headline-semibold">Your submission</h3>
                    <SubmissionStatusBadge status={mine.status} />
                  </div>
                  <p className="mt-4 text-body-regular text-text-secondary">
                    {mine.pitch}
                  </p>
                  <a
                    href={mine.deliverableUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-3 inline-flex items-center gap-1 text-body-2-medium text-accent-600"
                  >
                    Open deliverable
                    <ExternalLink className="size-4" />
                  </a>
                </div>
              ) : requiresVerification ? (
                <div className="relative min-h-[360px] overflow-hidden rounded-xl">
                  <form
                    aria-hidden="true"
                    className="pointer-events-none grid gap-4 opacity-[0.12] select-none"
                  >
                    <div className="grid gap-2 text-body-2-medium"><span>Your approach</span><RichTextEditor value={pitchContent} onChange={() => undefined} /></div>
                    <Input isRequired type="url" label="Deliverable link" placeholder="https://" value="" onChange={() => undefined} leadingIcon={ExternalLink} />
                    <div className="rounded-xl border border-separator-border bg-background-secondary-default p-3 text-body-2-regular text-text-secondary">Submit your best work.</div>
                    <Button type="button">Submit work</Button>
                  </form>
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-background-primary-default/60 px-5 text-center">
                    <Link href="/settings/profile" className="inline-flex items-center gap-1 text-body-medium text-accent-600 hover:text-accent-700">
                      Get verified <ArrowRight className="size-4" />
                    </Link>
                    <LockKeyhole className="mt-3 size-7 text-accent-600" aria-hidden="true" />
                    <h3 className="mt-3 max-w-md text-title-3-semibold text-text-primary">
                      Verify your profile to make a submission.
                    </h3>
                    <p className="mt-3 text-body-regular text-text-secondary">
                      This bounty only accepts submissions from verified users.
                    </p>
                    <div className="mt-5 inline-flex items-center gap-2 text-body-2-medium text-text-secondary">
                      <VerifiedIcon className="size-5 text-accent-600" />
                      More submissions, more rewards
                    </div>
                  </div>
                </div>
              ) : (
                <form
                  className="grid gap-4"
                  onSubmit={(event) => {
                    event.preventDefault();
                    if (!authenticated) {
                      login();
                      return;
                    }
                    submitWork({
                      bountyId: bounty.id,
                      pitch,
                      deliverableUrl: url,
                      attachments: [],
                    });
                  }}
                >
                <div className="grid gap-2 text-body-2-medium"><span>Your approach</span><RichTextEditor value={pitchContent} onChange={(value) => { setPitchContent(value); setPitch(JSON.stringify(value)); }} /></div>
                  <Input
                    isRequired
                    type="url"
                    label="Deliverable link"
                    placeholder="https://"
                    value={url}
                    onChange={setUrl}
                    leadingIcon={ExternalLink}
                  />
                  <div className="rounded-xl border border-separator-border bg-background-secondary-default p-3 text-body-2-regular text-text-secondary">
                    <strong className="text-text-primary">
                      Submit your best work.
                    </strong>{" "}
                    You can only submit once in this demo.
                  </div>
                  <Button type="submit" disabled={bounty.status !== "open"}>
                    {authenticated ? "Submit work" : "Log in to submit"}
                  </Button>
                </form>
              ))}
          </motion.div>
        </AnimatePresence>
      </section>
      {shareOpen && (
        <div
          className="fixed inset-0 z-[70] grid place-items-center bg-black/60 p-4 backdrop-blur-sm"
          onMouseDown={(event) =>
            event.target === event.currentTarget && setShareOpen(false)
          }
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="share-title"
            className="w-full max-w-lg rounded-3xl bg-background-primary-default p-5 shadow-2xl sm:p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-caption-1-semibold text-accent-600">
                  Share & earn
                </p>
                <h2 id="share-title" className="mt-1 text-title-3-semibold">
                  Share this bounty
                </h2>
              </div>
              <Button
                iconOnly
                variant="secondary"
                leadingIcon={X}
                aria-label="Close"
                onClick={() => setShareOpen(false)}
              />
            </div>
            <div className="mt-5 rounded-2xl border border-border-button-default bg-background-secondary-default p-5">
              <div className="mb-4 flex items-center gap-2">
                <Avatar initials={bounty.creator.avatar} size="sm" color="blue" />
                <span className="text-body-2-medium">@{bounty.creator.username}</span>
                {bounty.creator.verified && <VerifiedIcon className="size-4 text-accent-600" />}
              </div>
              <p className="text-title-3-semibold">{bounty.title}</p>
              <div className="mt-3 flex items-center justify-between gap-3">
                <Chip color="soft" variant="caption">
                  {bounty.category}
                </Chip>
                <strong className="inline-flex items-center gap-1.5 text-headline-semibold">
                  <span className="text-accent-600"><UsdcIcon className="size-5" /></span>
                  {bounty.reward.amount} USDC
                </strong>
              </div>
              <p className="mt-4 text-body-2-regular text-text-tertiary">
                @{bounty.creator.username}
              </p>
            </div>
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              <Button
                className="bg-black text-white hover:bg-neutral-800"
                leadingIcon={Share2}
                onClick={() => {
                  const url = location.href;
                  if (navigator.share)
                    void navigator.share({
                      title: bounty.title,
                      text: `Check out this bounty on Beework: ${bounty.title}`,
                      url,
                    });
                  else
                    window.open(
                      `https://twitter.com/intent/tweet?text=${encodeURIComponent(bounty.title)}&url=${encodeURIComponent(url)}`,
                      "_blank",
                      "noopener,noreferrer",
                    );
                }}
              >
                Share
              </Button>
              <Button
                variant="secondary"
                leadingIcon={copied ? Check : Copy}
                onClick={() => {
                  void navigator.clipboard?.writeText(location.href);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 1500);
                }}
              >
                {copied ? "Copied" : "Copy link"}
              </Button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
