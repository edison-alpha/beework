import type { Metadata, Viewport } from "next";
import Script from "next/script";
import localFont from "next/font/local";
import { Providers } from "./providers";
import { BeeworkShell } from "@/components/application/beework-shell";
import { PwaRegister } from "@/components/application/pwa-register";
import "@/styles/globals.css";

const sfProRounded = localFont({
  variable: "--font-sf-pro",
  display: "swap",
  src: [
    { path: "../components/font/SF-Pro-Rounded-Light.otf", weight: "300", style: "normal" },
    { path: "../components/font/SF-Pro-Rounded-Regular.otf", weight: "400", style: "normal" },
    { path: "../components/font/SF-Pro-Rounded-Medium.otf", weight: "500", style: "normal" },
    { path: "../components/font/SF-Pro-Rounded-Semibold.otf", weight: "600", style: "normal" },
    { path: "../components/font/SF-Pro-Rounded-Bold.otf", weight: "700", style: "normal" },
  ],
});

export const metadata: Metadata = {
  title: { default: "Beework — Get great work moving", template: "%s · Beework" },
  description: "Discover, create, and complete high-quality Web3 bounties paid in USDC.",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: "/94b7b561-2a2d-49e9-b826-f192e06df4a0.png",
    shortcut: "/94b7b561-2a2d-49e9-b826-f192e06df4a0.png",
    apple: "/94b7b561-2a2d-49e9-b826-f192e06df4a0.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ffffff",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${sfProRounded.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="min-h-full bg-background-full font-sans text-text-primary">
        <Script id="beework-theme" strategy="beforeInteractive">{`(function(){try{var dark=localStorage.getItem("boardui:theme")==="dark";document.documentElement.classList.toggle("dark",dark)}catch(e){}})();`}</Script>
        <PwaRegister /><Providers><BeeworkShell>{children}</BeeworkShell></Providers>
      </body>
    </html>
  );
}
