import type { Metadata } from "next";
import { LoginView } from "@/modules/auth/components/login-view";
export const metadata: Metadata = { title: "Log in" };
export default function LoginPage() { return <LoginView/>; }
