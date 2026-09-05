"use client";

import Link from "next/link";
import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";
import type { LucideIcon } from "lucide-react";
import { LoaderCircle, Search, Sparkles } from "lucide-react";
import { cx } from "@/utils/cx";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

const buttonClass = (variant: ButtonVariant, size: ButtonSize) => cx(
  "focus-ring inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-xl text-body-medium transition-all duration-200 disabled:pointer-events-none disabled:opacity-45",
  size === "sm" && "h-9 px-3",
  size === "md" && "h-10 px-4",
  size === "lg" && "h-12 px-5",
  variant === "primary" && "bg-accent-600 text-white shadow-sm hover:-translate-y-0.5 hover:bg-accent-500 hover:shadow-md active:translate-y-0",
  variant === "secondary" && "border border-border-button-default bg-background-primary-default text-text-primary hover:border-border-button-hover hover:bg-background-secondary-default",
  variant === "ghost" && "text-text-secondary hover:bg-background-secondary-hover hover:text-text-primary",
  variant === "danger" && "bg-red-600 text-white hover:bg-red-500",
);

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: LucideIcon;
  loading?: boolean;
}

export function Button({ variant = "secondary", size = "md", icon: Icon, loading, className, children, ...props }: ButtonProps) {
  return <button className={cx(buttonClass(variant, size), className)} {...props}>{loading ? <LoaderCircle className="size-4 animate-spin" /> : Icon ? <Icon className="size-4" /> : null}{children}</button>;
}

export function ButtonLink({ href, variant = "secondary", size = "md", icon: Icon, className, children }: { href: string; variant?: ButtonVariant; size?: ButtonSize; icon?: LucideIcon; className?: string; children: ReactNode }) {
  return <Link href={href} className={cx(buttonClass(variant, size), className)}>{Icon && <Icon className="size-4" />}{children}</Link>;
}

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return <section className={cx("card-surface", className)}>{children}</section>;
}

export function Badge({ children, tone = "neutral", className }: { children: ReactNode; tone?: "neutral" | "blue" | "green" | "amber" | "purple" | "red"; className?: string }) {
  return <span className={cx(
    "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-caption-1-semibold",
    tone === "neutral" && "border-separator-border bg-background-secondary-default text-text-secondary",
    tone === "blue" && "border-accent-200 bg-accent-50 text-accent-700 dark:border-accent-800 dark:bg-accent-950 dark:text-accent-300",
    tone === "green" && "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-300",
    tone === "amber" && "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-300",
    tone === "purple" && "border-violet-200 bg-violet-50 text-violet-700 dark:border-violet-800 dark:bg-violet-950 dark:text-violet-300",
    tone === "red" && "border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300",
    className,
  )}>{children}</span>;
}

export function Avatar({ name, src, size = "md", className }: { name: string; src?: string; size?: "sm" | "md" | "lg" | "xl"; className?: string }) {
  const initials = name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase();
  return <span className={cx("inline-grid shrink-0 place-items-center overflow-hidden rounded-full bg-gradient-to-br from-accent-400 to-accent-700 font-semibold text-white", size === "sm" && "size-7 text-[10px]", size === "md" && "size-10 text-body-2-medium", size === "lg" && "size-12 text-body-medium", size === "xl" && "size-20 text-headline-medium", className)}>{src ? <img src={src} alt="" className="size-full object-cover" /> : initials}</span>;
}

export function Field({ label, hint, error, children }: { label: string; hint?: string; error?: string; children: ReactNode }) {
  return <label className="grid gap-2 text-body-2-medium text-text-primary"><span>{label}</span>{children}{(error || hint) && <span className={cx("text-body-2-regular", error ? "text-text-error-primary" : "text-text-tertiary")}>{error || hint}</span>}</label>;
}

const controlClass = "focus-ring h-11 w-full rounded-xl border border-border-button-default bg-background-primary-default px-3.5 text-body-regular text-text-primary placeholder:text-text-placeholder hover:border-border-button-hover";

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={cx(controlClass, props.className)} />;
}

export function Textarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={cx(controlClass, "min-h-28 resize-y py-3", props.className)} />;
}

export function Select(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={cx(controlClass, "cursor-pointer", props.className)} />;
}

export function SearchInput({ value, onChange, placeholder = "Search" }: { value: string; onChange: (value: string) => void; placeholder?: string }) {
  return <label className="relative block"><Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-foreground-icon-tertiary" /><Input aria-label={placeholder} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className="pl-10" /></label>;
}

export function PageHeader({ eyebrow, title, description, action }: { eyebrow?: string; title: string; description?: string; action?: ReactNode }) {
  return <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div className="max-w-3xl">{eyebrow && <p className="mb-2 text-caption-1-semibold uppercase tracking-[.16em] text-accent-600">{eyebrow}</p>}<h1 className="text-title-2-medium text-text-primary">{title}</h1>{description && <p className="mt-2 text-body-regular text-text-secondary">{description}</p>}</div>{action}</div>;
}

export function EmptyState({ title, description, action }: { title: string; description: string; action?: ReactNode }) {
  return <div className="grid place-items-center rounded-3xl border border-dashed border-border-button-default bg-background-secondary-default px-6 py-16 text-center"><div className="grid max-w-sm place-items-center"><span className="mb-4 grid size-12 place-items-center rounded-2xl bg-accent-100 text-accent-700 dark:bg-accent-950 dark:text-accent-300"><Sparkles className="size-5" /></span><h3 className="text-headline-medium">{title}</h3><p className="mt-2 text-body-regular text-text-secondary">{description}</p>{action && <div className="mt-5">{action}</div>}</div></div>;
}

export function Skeleton({ className }: { className?: string }) {
  return <div className={cx("animate-pulse rounded-xl bg-background-tertiary-default", className)} />;
}
