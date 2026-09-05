import { SettingsView } from "@/modules/settings/components/settings-view";
export default async function SettingsSectionPage({ params }: { params: Promise<{ section: string }> }) { const { section } = await params; return <SettingsView section={section}/>; }
