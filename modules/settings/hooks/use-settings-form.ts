"use client";

import { useEffect, useState } from "react";
import type { UserProfile } from "@/modules/bounties/types/bounty.types";
import { usePlatform } from "@/modules/platform/context/platform-context";
import { settingsApi } from "../api/settings.api";

export function useSettingsForm() {
  const { profile, saveProfile } = usePlatform();
  const [form, setForm] = useState(profile);
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  useEffect(() => setForm(profile), [profile]);
  const update = <K extends keyof UserProfile>(key: K, value: UserProfile[K]) => setForm((current) => ({ ...current, [key]: value }));
  const submit = async () => { setSaving(true); setMessage(""); try { const valid = await settingsApi.validateProfile(form); saveProfile(valid); setMessage("Profile saved."); } catch (error) { setMessage(error instanceof Error ? error.message : "Could not save profile."); } finally { setSaving(false); } };
  return { form, update, submit, message, saving };
}
