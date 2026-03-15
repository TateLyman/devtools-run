import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Complete Solana Developer Bundle — 5 Products, 35% Off",
  description:
    "Get everything: Trading Bot Source Code, Grid Bot, DeFi Toolkit, Trading Guide, and AI Prompt Pack. Save 1.1 SOL (35% off) vs buying individually. Pay with SOL, instant delivery.",
  keywords: [
    "solana developer bundle",
    "solana trading bot bundle",
    "solana tools discount",
    "crypto trading bot source code",
    "solana defi toolkit bundle",
    "solana grid bot deal",
    "solana developer tools pack",
    "crypto bot source code bundle",
  ],
  alternates: {
    canonical: "https://devtools-site-delta.vercel.app/bundle",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
