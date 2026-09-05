"use client";

import { createContext, useContext, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { PrivyProvider, usePrivy } from "@privy-io/react-auth";

interface AuthUser {
  id: string;
  name: string;
  email?: string;
  walletAddress?: string;
}

interface AuthContextValue {
  ready: boolean;
  authenticated: boolean;
  configured: boolean;
  user: AuthUser | null;
  login: () => void;
  logout: () => Promise<void> | void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function PrivyBridge({ children }: { children: ReactNode }) {
  const { ready, authenticated, user, login: openPrivy, logout } = usePrivy();
  const wallet = user?.linkedAccounts.find(
    (account) => account.type === "wallet" && "chainType" in account && account.chainType === "solana",
  );
  const email = user?.linkedAccounts.find((account) => account.type === "email");

  const value = useMemo<AuthContextValue>(() => ({
    ready,
    authenticated,
    configured: true,
    user: user ? {
      id: user.id,
      name: user.google?.name || user.twitter?.name || (email && "address" in email ? email.address.split("@")[0] : "Beework member"),
      email: email && "address" in email ? email.address : undefined,
      walletAddress: wallet && "address" in wallet ? wallet.address : undefined,
    } : null,
    login: openPrivy,
    logout,
  }), [authenticated, email, logout, openPrivy, ready, user, wallet]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

function DemoAuthProvider({ children }: { children: ReactNode }) {
  const [authenticated, setAuthenticated] = useState(false);

  const value = useMemo<AuthContextValue>(() => ({
    ready: true,
    authenticated,
    configured: false,
    user: authenticated
      ? { id: "demo-user", name: "Alex Morgan", email: "alex@beework.xyz", walletAddress: "Bee9…VfY" }
      : null,
    login: () => setAuthenticated(true),
    logout: () => setAuthenticated(false),
  }), [authenticated]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const appId = process.env.NEXT_PUBLIC_PRIVY_APP_ID;

  if (!appId) return <DemoAuthProvider>{children}</DemoAuthProvider>;

  return (
    <PrivyProvider
      appId={appId}
      config={{
        loginMethods: ["email", "google", "wallet"],
        embeddedWallets: { solana: { createOnLogin: "users-without-wallets" } },
        appearance: { theme: "light", accentColor: "#2473fe", logo: undefined },
      }}
    >
      <PrivyBridge>{children}</PrivyBridge>
    </PrivyProvider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}
