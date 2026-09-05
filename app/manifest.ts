import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Beework",
    short_name: "Beework",
    description: "Discover, create, and complete high-quality Web3 bounties paid in USDC.",
    start_url: "/",
    display: "standalone",
    background_color: "#0b1020",
    theme_color: "#2563eb",
    icons: [{ src: "/94b7b561-2a2d-49e9-b826-f192e06df4a0.png", sizes: "any", type: "image/png", purpose: "maskable" }],
  };
}
