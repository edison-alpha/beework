"use client";

import { ShaderBackground } from "@/components/motion/shader-background";
import { cx } from "@/utils/cx";

export const PROFILE_COVERS = {
  ocean: { label: "Ocean", colors: ["#dbeafe", "#bfdbfe", "#99f6e4", "#e0e7ff"] },
  sunset: { label: "Sunset", colors: ["#fed7aa", "#fbcfe8", "#ddd6fe", "#fde68a"] },
  violet: { label: "Violet", colors: ["#ddd6fe", "#c4b5fd", "#bae6fd", "#f5d0fe"] },
} as const;

export type ProfileCover = keyof typeof PROFILE_COVERS;

export function ProfileCoverBackground({ cover = "ocean", className }: { cover?: ProfileCover; className?: string }) {
  return (
    <ShaderBackground
      variant="static-mesh-gradient"
      colors={PROFILE_COVERS[cover].colors as unknown as string[]}
      className={cx("h-full w-full", className)}
    />
  );
}
