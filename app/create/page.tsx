import type { Metadata } from "next";
import { CreateBountyView } from "@/modules/create-bounty/components/create-bounty-view";

export const metadata: Metadata = { title: "Create bounty" };
export default function CreatePage() { return <CreateBountyView/>; }
