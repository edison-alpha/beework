"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { ArrowLeft, ArrowRight, Check, HelpCircle, Plus, Trash2, WalletCards, X } from "lucide-react";
import { parseDate } from "@internationalized/date";
import { Avatar } from "@/components/base/avatar/avatar";
import { Button } from "@/components/base/buttons/button";
import { DatePicker } from "@/components/base/date-picker/date-picker";
import { Input } from "@/components/base/input/input";
import { Select, SelectItem } from "@/components/base/select/select";
import { useAuth } from "@/modules/auth/context/auth-context";
import {
  CATEGORIES,
  SKILLS,
} from "@/modules/bounties/constants/bounty.constants";
import { usePlatform } from "@/modules/platform/context/platform-context";
import { cx } from "@/utils/cx";
import {
  CreateBountyProvider,
  useCreateBounty,
} from "../context/create-bounty-context";
import { RichTextEditor } from "./rich-text-editor";
import { UsdcIcon, VerifiedIcon } from "@/components/foundations/icons/brand-icons";

const CircleDollarSign = UsdcIcon;

type ComposerTab = "category" | "options" | "payment";
type CreateStage = "edit" | "review" | "payment";

function CategoryPanel() {
  const { draft, update } = useCreateBounty();
  return (
    <div className="grid gap-5">
      <fieldset>
        <legend className="text-body-2-medium">Choose a category</legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {CATEGORIES.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => update("category", category)}
              className={cx(
                "focus-ring rounded-full border px-3.5 py-2 text-body-2-medium transition-colors",
                draft.category === category
                  ? "border-accent-600 bg-accent-600 text-white"
                  : "border-border-button-default text-text-secondary hover:bg-background-secondary-hover",
              )}
            >
              {category}
            </button>
          ))}
        </div>
      </fieldset>
      <fieldset>
        <legend className="text-body-2-medium">Skills</legend>
        <p className="mt-1 text-body-2-regular text-text-tertiary">
          Select up to five skills contributors should bring.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {SKILLS.map((skill) => {
            const selected = draft.skills.includes(skill);
            return (
              <button
                key={skill}
                type="button"
                onClick={() =>
                  update(
                    "skills",
                    selected
                      ? draft.skills.filter((item) => item !== skill)
                      : draft.skills.length < 5
                        ? [...draft.skills, skill]
                        : draft.skills,
                  )
                }
                className={cx(
                  "focus-ring rounded-full border px-3 py-1.5 text-body-2-medium transition-colors",
                  selected
                    ? "border-accent-600 bg-accent-600 text-white"
                    : "border-border-button-default text-text-secondary hover:bg-background-secondary-hover",
                )}
              >
                {selected && <Check className="mr-1 inline size-3.5" />}
                {skill}
              </button>
            );
          })}
        </div>
      </fieldset>
    </div>
  );
}

function OptionsPanel() {
  const { draft, update } = useCreateBounty();
  return (
    <div className="grid gap-5">
      <div className="grid gap-2"><span className="text-body-2-medium">Who can submit?</span><Select selectedKey={draft.eligibility} onSelectionChange={(key) => update("eligibility", String(key) as typeof draft.eligibility)} items={["Open to everyone", "Verified talent", "Invite only"].map((value) => ({ id: value, label: value }))}>
        {["Open to everyone", "Verified talent", "Invite only"].map((value) => <SelectItem key={value} id={value}>{value}</SelectItem>)}
      </Select></div>
      <fieldset>
        <legend className="text-body-2-medium">Deliverables</legend>
        <p className="mt-1 text-body-2-regular text-text-tertiary">
          List concrete outcomes contributors need to submit.
        </p>
        <div className="mt-3 grid gap-2">
          {draft.deliverables.map((deliverable, index) => (
            <div key={index} className="flex gap-2">
              <Input
                aria-label={`Deliverable ${index + 1}`}
                placeholder="e.g. Production-ready pull request"
                value={deliverable}
                onChange={(value) =>
                  update(
                    "deliverables",
                    draft.deliverables.map((item, itemIndex) =>
                      itemIndex === index ? value : item,
                    ),
                  )
                }
              />
              {draft.deliverables.length > 1 && (
                <Button
                  iconOnly
                  variant="secondary"
                  leadingIcon={Trash2}
                  aria-label="Remove deliverable"
                  onClick={() =>
                    update(
                      "deliverables",
                      draft.deliverables.filter(
                        (_, itemIndex) => itemIndex !== index,
                      ),
                    )
                  }
                />
              )}
            </div>
          ))}
        </div>
        <Button
          className="mt-3"
          size="small"
          variant="secondary"
          leadingIcon={Plus}
          onClick={() => update("deliverables", [...draft.deliverables, ""])}
        >
          Add deliverable
        </Button>
      </fieldset>
    </div>
  );
}

function PaymentPanel() {
  const { draft, update } = useCreateBounty();
  const minimumPayout = draft.minimumPayout ?? Math.max(5, Math.round(draft.amount * 0.1));
  return (
    <div className="grid gap-5">
      <div className="grid gap-5 md:grid-cols-2 md:items-start">
        <Input
          type="number"
          label="Reward amount"
          value={String(draft.amount)}
          onChange={(value) => update("amount", Number(value))}
          leadingIcon={CircleDollarSign}
          hint="Minimum reward: 10 USDC"
        />
        <Input
          type="number"
          label="Minimum payout"
          value={String(minimumPayout)}
          onChange={(value) => update("minimumPayout", Number(value))}
          leadingIcon={CircleDollarSign}
          hint="The minimum amount paid to an accepted contributor."
        />
        <div>
          <p className="mb-2 text-body-2-medium">Deadline</p>
          <DatePicker
            aria-label="Bounty deadline"
            value={parseDate(draft.deadline)}
            onChange={(value) => value && update("deadline", value.toString())}
          />
          <p className="mt-2 text-body-2-regular text-text-tertiary">
            When should the bounty close?
          </p>
        </div>
      </div>
    </div>
  );
}

function ReviewBounty({ onBack, onContinue }: { onBack: () => void; onContinue: () => void }) {
  const { draft } = useCreateBounty();
  const { profile } = usePlatform();

  return (
    <main className="mx-auto flex min-h-[calc(100vh-3.5rem)] max-w-[960px] flex-col px-4 pb-24 pt-5 sm:px-8 sm:pt-7">
      <div className="mb-5 flex items-center gap-2 border-b border-separator-border bg-background-secondary-default/70 px-3 py-2 text-body-2-regular text-text-secondary">
        <HelpCircle className="size-4 shrink-0" />
        Need help creating this bounty? <a href="mailto:hello@beework.app" className="font-medium text-text-primary underline underline-offset-4">Book a quick call</a>
      </div>
      <section className="mx-auto w-full max-w-2xl">
        <div className="flex items-center gap-2">
          <Avatar initials={profile.avatar} alt={profile.name} color="blue" size="sm" />
          <span className="text-body-2-regular text-text-secondary">{profile.username}</span>
        </div>
        <h1 className="mt-4 text-title-2-medium sm:text-display-3-medium">{draft.title}</h1>
        <span className="mt-3 inline-flex rounded-full bg-accent-600 px-3 py-1 text-caption-1-semibold text-white">{draft.category}</span>
        <p className="mt-5 flex items-center gap-2 text-body-regular text-text-secondary">
          <CircleDollarSign className="size-5" /> Total reward {draft.amount.toLocaleString()} USDC
        </p>
        <p className="mt-6 text-body-regular text-text-primary">{draft.summary}</p>
        <div className="mt-7 rounded-2xl border border-separator-border bg-background-secondary-default p-4">
          <p className="text-body-2-medium text-text-primary">Bounty details</p>
          <dl className="mt-3 grid gap-3 text-body-2-regular sm:grid-cols-3">
            <div><dt className="text-text-tertiary">Eligibility</dt><dd className="mt-1 text-text-primary">{draft.eligibility}</dd></div>
            <div><dt className="text-text-tertiary">Deadline</dt><dd className="mt-1 text-text-primary">{new Date(`${draft.deadline}T00:00:00`).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" })}</dd></div>
            <div><dt className="text-text-tertiary">Deliverables</dt><dd className="mt-1 text-text-primary">{draft.deliverables.filter(Boolean).length}</dd></div>
          </dl>
        </div>
      </section>
      <div className="fixed right-0 bottom-0 left-0 z-40 border-t border-separator-border bg-background-primary-default/95 backdrop-blur">
        <div className="mx-auto flex max-w-[960px] items-center justify-between px-4 py-3 sm:px-8">
          <Button variant="ghost" leadingIcon={ArrowLeft} onClick={onBack}>Back</Button>
          <Button trailingIcon={ArrowRight} onClick={onContinue}>Continue to payment</Button>
        </div>
      </div>
    </main>
  );
}

function PaymentCheckout({ onBack, onPost }: { onBack: () => void; onPost: () => void }) {
  const { draft, update } = useCreateBounty();
  const { profile } = usePlatform();
  const [paymentComplete, setPaymentComplete] = useState(false);
  const suggestions = [50, 100, 200, 380, 700];
  const total = Number.isFinite(draft.amount) ? draft.amount : 0;

  useEffect(() => {
    if (!paymentComplete) return;
    const timeout = window.setTimeout(onPost, 1200);
    return () => window.clearTimeout(timeout);
  }, [onPost, paymentComplete]);

  if (paymentComplete) {
    return (
      <main className="mx-auto flex min-h-[calc(100vh-3.5rem)] max-w-[960px] items-center px-4 py-12 sm:px-8">
        <motion.section
          initial={{ opacity: 0, scale: 0.94, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="mx-auto w-full max-w-md rounded-3xl border border-separator-border bg-background-primary-default p-7 text-center shadow-xl sm:p-9"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.14, type: "spring", stiffness: 320, damping: 16 }}
            className="mx-auto w-fit text-accent-600"
          >
            <VerifiedIcon className="size-16 text-accent-600" />
          </motion.div>
          <p className="mt-6 text-caption-1-semibold uppercase tracking-[0.12em] text-accent-600">Payment successful</p>
          <h1 className="mt-2 text-title-2-medium">Your bounty is posted</h1>
          <p className="mt-3 text-body-regular text-text-secondary">{total.toLocaleString()} USDC has been reserved for “{draft.title}”. Taking you to your bounty now.</p>
          <div className="mt-6 rounded-2xl bg-background-secondary-default p-4 text-left"><p className="text-caption-1-medium text-text-tertiary">BOUNTY AMOUNT</p><p className="mt-1 text-title-3-semibold">{total.toLocaleString()} USDC</p></div>
        </motion.section>
      </main>
    );
  }

  return (
    <main className="mx-auto min-h-[calc(100vh-3.5rem)] max-w-[960px] px-4 pb-12 pt-5 sm:px-8 sm:pt-7">
      <div className="mb-5 flex items-center gap-2 border-b border-separator-border bg-background-secondary-default/70 px-3 py-2 text-body-2-regular text-text-secondary">
        <HelpCircle className="size-4 shrink-0" />
        Need help creating this bounty? <a href="mailto:hello@beework.app" className="font-medium text-text-primary underline underline-offset-4">Book a quick call</a>
      </div>
      <section className="mx-auto w-full max-w-2xl">
        <Button variant="ghost" leadingIcon={ArrowLeft} onClick={onBack}>Back to review</Button>
        <div className="mt-5 flex items-center gap-3 rounded-2xl border border-separator-border p-4">
          <Avatar initials={profile.avatar} alt={profile.name} color="blue" size="lg" />
          <div className="min-w-0"><p className="truncate text-body-medium">{draft.title}</p><p className="mt-1 truncate text-body-2-regular text-text-secondary">{draft.summary}</p></div>
        </div>
        <div className="mt-6 rounded-2xl border border-separator-border p-5 sm:p-6">
          <div className="flex items-center justify-between gap-3"><p className="text-caption-1-semibold uppercase tracking-wide text-text-tertiary">Bounty amount</p><span className="inline-flex items-center gap-2 rounded-full border border-border-button-default px-3 py-1.5 text-body-2-medium"><WalletCards className="size-4" /> Pay with wallet</span></div>
          <Input aria-label="Bounty amount" type="number" value={String(total)} onChange={(value) => update("amount", Number(value))} leadingIcon={CircleDollarSign} className="mt-4 text-title-1-semibold" />
          <p className="mt-6 text-body-2-medium">Smart suggestions</p>
          <div className="mt-3 flex flex-wrap gap-2">{suggestions.map((amount) => <button key={amount} type="button" onClick={() => update("amount", amount)} className={cx("focus-ring rounded-full border px-4 py-2 text-body-2-medium", total === amount ? "border-accent-600 bg-accent-50 text-accent-700 dark:bg-accent-950 dark:text-accent-300" : "border-border-button-default hover:bg-background-secondary-hover")}>{amount} USDC</button>)}</div>
        </div>
        <div className="mt-7"><h2 className="text-body-medium">What you unlock</h2><div className="mt-4 grid gap-3 text-body-2-regular text-text-secondary sm:grid-cols-2"><span className="inline-flex items-center gap-2"><Check className="size-4 text-accent-600" /> Reach more qualified contributors</span><span className="inline-flex items-center gap-2"><Check className="size-4 text-accent-600" /> Listed in the explore feed</span></div></div>
        <div className="mt-7 rounded-2xl border border-separator-border p-5"><div className="flex items-center gap-2 border-b border-separator-border pb-4 text-body-2-regular text-text-secondary"><Check className="size-4 text-accent-600" /> Your bounty will be ready to post after payment.</div><dl className="mt-4 grid gap-3 text-body-regular"><div className="flex justify-between"><dt className="text-text-secondary">Subtotal</dt><dd>{total.toLocaleString()} USDC</dd></div><div className="flex justify-between"><dt className="text-text-secondary">Platform fee</dt><dd>0 USDC</dd></div><div className="flex justify-between border-t border-separator-border pt-4 text-title-3-semibold"><dt>Total to pay</dt><dd>{total.toLocaleString()} USDC</dd></div></dl><Button className="mt-5 w-full" disabled={total < 10} onClick={() => setPaymentComplete(true)}>Pay {total.toLocaleString()} USDC</Button><p className="mt-4 text-center text-caption-1-regular text-text-tertiary">By continuing, you agree to Beework&apos;s Terms of Service.</p></div>
      </section>
    </main>
  );
}

function CreateForm() {
  const router = useRouter();
  const { authenticated, login } = useAuth();
  const { profile } = usePlatform();
  const { draft, update, publish, review, error, savedAt } = useCreateBounty();
  const [tab, setTab] = useState<ComposerTab>("category");
  const [stage, setStage] = useState<CreateStage>("edit");
  const tabs: { id: ComposerTab; label: string }[] = [
    { id: "category", label: "Category" },
    { id: "options", label: "Options" },
    { id: "payment", label: "Payment" },
  ];

  if (!authenticated)
    return (
      <div className="mx-auto max-w-lg px-4 py-24 text-center">
        <h1 className="text-title-2-medium">Log in to create a bounty</h1>
        <p className="mt-3 text-body-regular text-text-secondary">
          One Beework account can publish bounties and submit work.
        </p>
        <Button className="mt-6" onClick={login}>
          Continue with Privy
        </Button>
      </div>
    );

  if (stage === "review") {
    return <ReviewBounty onBack={() => setStage("edit")} onContinue={() => setStage("payment")} />;
  }

  if (stage === "payment") {
    return <PaymentCheckout onBack={() => setStage("review")} onPost={() => {
      const bounty = publish();
      if (bounty) router.push(`/bounties/${bounty.slug}`);
    }} />;
  }

  const panel =
    tab === "category" ? (
      <CategoryPanel />
    ) : tab === "options" ? (
      <OptionsPanel />
    ) : (
      <PaymentPanel />
    );

  return (
    <main className="mx-auto flex min-h-[calc(100vh-3.5rem)] max-w-[960px] flex-col px-4 pb-24 pt-5 sm:px-8 sm:pt-7">
      <div className="mb-4 flex items-center gap-2 border-b border-separator-border bg-background-secondary-default/70 px-3 py-2 text-body-2-regular text-text-secondary">
        <HelpCircle className="size-4 shrink-0" />
        Need help creating this bounty?{" "}
        <a
          href="mailto:hello@beework.app"
          className="font-medium text-text-primary underline underline-offset-4"
        >
          Book a quick call
        </a>
      </div>
      <div className="flex items-center gap-2">
        <Avatar initials={profile.avatar} color="blue" size="sm" />
        <span className="text-body-2-regular text-text-secondary">
          {profile.username}
        </span>
      </div>
      <input
        aria-label="Bounty title"
        value={draft.title}
        onChange={(event) => update("title", event.target.value)}
        maxLength={90}
        placeholder="e.g. Write a launch thread about Beework…"
        className="mt-2 w-full bg-transparent py-2 text-title-2-medium text-text-primary outline-none placeholder:text-text-tertiary sm:text-display-3-medium"
      />
      <Input
        className="mt-3 max-w-2xl"
        label="Short summary"
        placeholder="Summarize the bounty in at least 20 characters"
        value={draft.summary}
        onChange={(value) => update("summary", value)}
        maxLength={240}
        isInvalid={error === "Add a summary with at least 20 characters."}
        hint={`${draft.summary.trim().length}/20 characters minimum`}
      />
      <div className="mt-5">
        <div
          role="tablist"
          aria-label="Bounty settings"
          className="flex w-fit items-center gap-1 rounded-full border border-border-button-default bg-background-secondary-default p-1"
        >
          {tabs.map((item) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={tab === item.id}
              onClick={() => setTab(item.id)}
              className={cx(
                "focus-ring rounded-full px-4 py-2 text-body-2-medium transition-colors",
                tab === item.id
                  ? "bg-background-primary-default text-text-primary shadow-xs"
                  : "text-text-secondary hover:text-text-primary",
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
        <motion.div
          key={tab}
          role="tabpanel"
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.18 }}
          className="mt-4 rounded-2xl border border-separator-border bg-background-primary-default p-4 sm:p-5"
        >
          {panel}
        </motion.div>
      </div>
      <div className="mt-5">
        <div className="mb-2 flex items-center justify-between">
          <p className="text-body-2-medium">Description</p>
        </div>
        <RichTextEditor
          value={draft.description}
          onChange={(value) => update("description", value)}
        />
      </div>
      {error && (
        <p
          role="alert"
          className="mt-4 rounded-xl bg-red-50 p-3 text-body-2-medium text-text-error-primary dark:bg-red-950"
        >
          {error}
        </p>
      )}
      <div className="fixed right-0 bottom-0 left-0 z-40 border-t border-separator-border bg-background-primary-default/95 backdrop-blur">
        <div className="mx-auto flex max-w-[960px] items-center justify-between px-4 py-3 sm:px-8">
          <p className="text-caption-1-medium text-text-tertiary">
            {savedAt
              ? `Draft saved ${savedAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
              : "Saving draft…"}
          </p>
          <Button
            onClick={() => {
              if (review()) setStage("review");
            }}
          >
            Review bounty
          </Button>
        </div>
      </div>
    </main>
  );
}

export function CreateBountyView() {
  return (
    <CreateBountyProvider>
      <CreateForm />
    </CreateBountyProvider>
  );
}
