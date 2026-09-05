"use client";

import Link from "next/link";
import { useState } from "react";
import type { JSONContent } from "@tiptap/react";
import { ArrowLeft, CalendarDays, Check, Copy, ExternalLink, Heart, ShieldCheck, UsersRound, X } from "lucide-react";
import { Avatar } from "@/components/base/avatar/avatar";
import { Button } from "@/components/base/buttons/button";
import { Chip } from "@/components/base/badges/chip";
import { Input } from "@/components/base/input/input";
import { useAuth } from "@/modules/auth/context/auth-context";
import { usePlatform } from "@/modules/platform/context/platform-context";
import { deadlineLabel } from "../utils/bounty.utils";
import { RewardBadge } from "./reward-badge";
import { BountyStatusBadge } from "./status-badge";

function RichNode({ node }: { node: JSONContent }) {
  const children = node.content?.map((child, index) => <RichNode key={index} node={child}/>);
  if (node.type === "text") return <>{node.text}</>;
  if (node.type === "heading") return node.attrs?.level === 3 ? <h3 className="mt-6 text-headline-semibold">{children}</h3> : <h2 className="mt-8 text-title-3-semibold">{children}</h2>;
  if (node.type === "bulletList") return <ul className="mt-3 grid list-disc gap-2 pl-5 text-body-regular text-text-secondary">{children}</ul>;
  if (node.type === "orderedList") return <ol className="mt-3 grid list-decimal gap-2 pl-5 text-body-regular text-text-secondary">{children}</ol>;
  if (node.type === "listItem") return <li>{children}</li>;
  if (node.type === "paragraph") return <p className="mt-3 text-body-regular leading-7 text-text-secondary">{children}</p>;
  return <>{children}</>;
}

export function BountyDetailView({ slug }: { slug: string }) {
  const { bounties, profile, submissions, submitWork } = usePlatform();
  const { authenticated, login } = useAuth();
  const bounty = bounties.find((item) => item.slug === slug);
  const [saved, setSaved] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [pitch, setPitch] = useState("");
  const [url, setUrl] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!bounty) return <div className="mx-auto max-w-3xl px-4 py-24 text-center"><h1 className="text-title-2-medium">Bounty not found</h1><Link className="mt-4 inline-block text-accent-600" href="/">Return to marketplace</Link></div>;
  const isOwner = bounty.creator.id === profile.id;
  const alreadySubmitted = submissions.some((item) => item.bountyId === bounty.id && item.contributorId === profile.id);

  const openSubmission = () => {
    if (!authenticated) { login(); return; }
    setFormOpen(true);
  };

  return (
    <div className="mx-auto max-w-[1180px] px-4 py-8 sm:px-6 lg:px-8">
      <Link href="/" className="focus-ring inline-flex items-center gap-2 rounded-lg text-body-2-medium text-text-secondary hover:text-text-primary"><ArrowLeft className="size-4"/>Back to marketplace</Link>
      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_350px]">
        <article className="card-surface overflow-hidden">
          <div className="border-b border-separator-border p-6 sm:p-8">
            <div className="flex flex-wrap items-center gap-2"><BountyStatusBadge status={bounty.status}/><Chip color="soft" variant="caption">{bounty.category}</Chip><span className="text-body-2-regular text-text-tertiary">Posted {bounty.createdAt}</span></div>
            <h1 className="mt-5 max-w-3xl text-title-2-medium">{bounty.title}</h1>
            <p className="mt-4 text-[1.05rem] leading-7 text-text-secondary">{bounty.summary}</p>
            <div className="mt-6 flex flex-wrap gap-2">{bounty.skills.map((skill) => <Chip key={skill} color="blue" variant="caption">{skill}</Chip>)}</div>
          </div>
          <div className="p-6 sm:p-8">{bounty.description.content?.map((node, index) => <RichNode key={index} node={node}/>)}<h2 className="mt-9 text-title-3-semibold">Deliverables</h2><div className="mt-4 grid gap-3">{bounty.deliverables.map((item) => <div key={item} className="flex items-start gap-3 rounded-2xl bg-background-secondary-default p-4 text-body-medium"><span className="grid size-6 shrink-0 place-items-center rounded-full bg-accent-100 text-accent-700 dark:bg-accent-950 dark:text-accent-300"><Check className="size-3.5"/></span>{item}</div>)}</div></div>
        </article>
        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <section className="card-surface p-6"><RewardBadge amount={bounty.reward.amount}/><div className="my-5 h-px bg-separator-border"/><div className="grid gap-3 text-body-2-regular text-text-secondary"><div className="flex items-center justify-between"><span className="inline-flex items-center gap-2"><CalendarDays className="size-4"/>Deadline</span><strong className="text-text-primary">{deadlineLabel(bounty.deadline)}</strong></div><div className="flex items-center justify-between"><span className="inline-flex items-center gap-2"><UsersRound className="size-4"/>Submissions</span><strong className="text-text-primary">{bounty.applicantsCount}</strong></div><div className="flex items-center justify-between"><span>Eligibility</span><strong className="text-text-primary">{bounty.eligibility}</strong></div></div><div className="mt-6 grid gap-2">{isOwner ? <Link href="/dashboard/submissions" className="focus-ring inline-flex h-10 items-center justify-center rounded-xl bg-accent-600 text-body-medium text-white">Review submissions</Link> : <Button disabled={alreadySubmitted || bounty.status !== "open"} onClick={openSubmission}>{alreadySubmitted ? "Already submitted" : bounty.status !== "open" ? "Submissions closed" : "Submit work"}</Button>}<div className="grid grid-cols-2 gap-2"><Button variant="secondary" leadingIcon={Heart} onClick={() => setSaved(!saved)}>{saved ? "Saved" : "Save"}</Button><Button variant="secondary" leadingIcon={copied ? Check : Copy} onClick={() => { void navigator.clipboard?.writeText(location.href); setCopied(true); setTimeout(() => setCopied(false), 1500); }}>{copied ? "Copied" : "Share"}</Button></div></div><p className="mt-4 text-center text-caption-1-medium text-text-tertiary">Demo funding · no transaction will be broadcast</p></section>
          <section className="card-surface p-5"><p className="text-caption-1-semibold uppercase tracking-[.12em] text-text-tertiary">Posted by</p><div className="mt-4 flex items-center gap-3"><Avatar initials={bounty.creator.avatar} size="lg" color="blue"/><div><p className="inline-flex items-center gap-1 text-body-medium">{bounty.creator.name}{bounty.creator.verified && <ShieldCheck className="size-4 text-accent-600"/>}</p><p className="text-body-2-regular text-text-tertiary">@{bounty.creator.username}</p></div></div><div className="mt-4 grid grid-cols-2 gap-2"><div className="rounded-xl bg-background-secondary-default p-3"><p className="text-headline-semibold">{bounty.creator.reputation}</p><p className="text-caption-1-medium text-text-tertiary">Reputation</p></div><div className="rounded-xl bg-background-secondary-default p-3"><p className="text-headline-semibold">{bounty.creator.paidBounties}</p><p className="text-caption-1-medium text-text-tertiary">Bounties paid</p></div></div></section>
        </aside>
      </div>
      {formOpen && <div className="fixed inset-0 z-[70] grid place-items-end bg-black/40 p-0 backdrop-blur-sm sm:place-items-center sm:p-4" onMouseDown={(event) => event.target === event.currentTarget && setFormOpen(false)}><section role="dialog" aria-modal="true" aria-labelledby="submission-title" className="w-full max-w-xl rounded-t-3xl bg-background-primary-default p-6 shadow-2xl sm:rounded-3xl"><div className="flex items-center justify-between"><div><p className="text-caption-1-semibold text-accent-600">Submit your work</p><h2 id="submission-title" className="mt-1 text-title-3-semibold">Make your case clearly</h2></div><Button iconOnly variant="secondary" leadingIcon={X} aria-label="Close" onClick={() => setFormOpen(false)}/></div>{submitted ? <div className="grid place-items-center py-12 text-center"><span className="grid size-14 place-items-center rounded-full bg-accent-100 text-accent-700"><Check className="size-6"/></span><h3 className="mt-4 text-headline-semibold">Submission received</h3><p className="mt-2 text-body-regular text-text-secondary">Track its status from your dashboard.</p><Button className="mt-5" onClick={() => setFormOpen(false)}>Done</Button></div> : <form className="mt-6 grid gap-4" onSubmit={(event) => { event.preventDefault(); const result = submitWork({ bountyId: bounty.id, pitch, deliverableUrl: url, attachments: [] }); if (result) setSubmitted(true); }}><label className="grid gap-2 text-body-2-medium">Pitch<textarea required value={pitch} onChange={(event) => setPitch(event.target.value)} placeholder="Explain your approach and the value of your submission…" className="focus-ring min-h-32 rounded-2xl border border-border-button-default bg-background-secondary-default p-3 text-body-regular"/></label><Input isRequired type="url" label="Deliverable link" placeholder="https://" value={url} onChange={setUrl} leadingIcon={ExternalLink}/><div className="mt-2 flex justify-end gap-2"><Button type="button" variant="secondary" onClick={() => setFormOpen(false)}>Cancel</Button><Button type="submit">Send submission</Button></div></form>}</section></div>}
    </div>
  );
}
