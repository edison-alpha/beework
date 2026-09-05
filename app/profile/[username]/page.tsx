import { ProfileView } from "@/modules/profile/components/profile-view";
export default async function ProfilePage({ params }: { params: Promise<{ username: string }> }) { const { username } = await params; return <ProfileView username={username}/>; }
