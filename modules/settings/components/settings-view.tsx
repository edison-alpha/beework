"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/base/buttons/button";
import { SettingsModal } from "@/components/application/settings/settings-modal";
import { SETTINGS_SECTIONS, type SettingsSection } from "../constants/settings.constants";

/** Direct settings URLs use the same modal as the navbar and mobile Account menu. */
export function SettingsView({ section }: { section: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(true);
  const current = SETTINGS_SECTIONS.some((item) => item.id === section) ? section as SettingsSection : "profile";
  return <div className="mx-auto max-w-lg px-4 py-16 text-center">
    <h1 className="text-title-2-medium">Beework settings</h1>
    <Button className="mt-5" onClick={() => setOpen(true)}>Open settings</Button>
    <SettingsModal isOpen={open} defaultPage={current} onClose={() => { setOpen(false); router.push("/"); }} />
  </div>;
}
