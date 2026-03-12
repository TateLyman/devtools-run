import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Solana DeFi Toolkit — 10 Production Scripts for Developers",
  description:
    "10 ready-to-use Node.js scripts for Solana DeFi: wallet monitor, token scanner, Jupiter swaps, Pump.fun monitor, whale tracker, bulk transfers, portfolio tracker, and more.",
  keywords: [
    "solana defi scripts",
    "solana developer tools",
    "jupiter swap script",
    "solana wallet monitor",
    "solana token scanner",
    "pumpfun monitor",
    "solana whale tracker",
    "solana bulk transfer",
    "solana portfolio tracker",
    "solana nft snapshot",
  ],
  alternates: {
    canonical: "https://devtools-site-delta.vercel.app/sol-defi-toolkit",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
