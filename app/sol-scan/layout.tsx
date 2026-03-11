import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Solana Token Scanner — Rug Check & Safety Analysis",
  description:
    "Scan any Solana token for rug pull risks. Check liquidity locks, top holders, mint authority, freeze authority, and more. Powered by on-chain data.",
  keywords: [
    "solana rug check",
    "solana token scanner",
    "sol token safety",
    "rug pull detector",
    "solana scam checker",
    "is token safe solana",
  ],
  alternates: {
    canonical: "https://devtools-site-delta.vercel.app/sol-scan",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
