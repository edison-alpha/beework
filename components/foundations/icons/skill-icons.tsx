"use client";

import { addCollection, Icon } from "@iconify/react";
import crypto from "@iconify-json/cryptocurrency-color/icons.json";
import logos from "@iconify-json/logos/icons.json";
import { BookOpen, Braces, PenLine, UsersRound } from "lucide-react";
import type { ComponentType } from "react";
import { cx } from "@/utils/cx";

addCollection(logos);
addCollection(crypto);

const brandIcons: Record<string, string> = {
  Figma: "logos:figma",
  React: "logos:react",
  TypeScript: "logos:typescript-icon",
  Solana: "cryptocurrency-color:sol",
  Rust: "logos:rust",
  Motion: "logos:framer",
  Writing: "logos:medium-icon",
  Research: "logos:notion-icon",
  Community: "logos:discord-icon",
};

const fallbackIcons: Record<string, ComponentType<{ className?: string }>> = {
  Development: Braces,
  Design: PenLine,
  Content: PenLine,
  Research: BookOpen,
  Community: UsersRound,
};

export function SkillIcon({ skill, className }: { skill: string; className?: string }) {
  const icon = brandIcons[skill];
  const Fallback = fallbackIcons[skill] ?? Braces;
  if (!icon) return <Fallback className={cx("size-3.5 shrink-0", className)} aria-hidden />;
  return <Icon icon={icon} className={cx("size-3.5 shrink-0", className)} width="14" height="14" aria-hidden />;
}

export function hasSkillIcon(skill: string) {
  return Boolean(brandIcons[skill]);
}
