import { Bell, Palette, Settings, UserRound, WalletCards } from "lucide-react";

export const SETTINGS_SECTIONS = [
  { id: "profile", label: "Profile", icon: UserRound },
  { id: "wallet", label: "Wallet", icon: WalletCards },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "appearance", label: "Appearance", icon: Palette },
  { id: "account", label: "Account", icon: Settings },
] as const;
export type SettingsSection = typeof SETTINGS_SECTIONS[number]["id"];
