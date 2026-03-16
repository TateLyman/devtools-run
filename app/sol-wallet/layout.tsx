import { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Solana Wallet Tracker - Free Portfolio Checker & Balance Lookup (2026)",
  description:
    "Free Solana wallet tracker and portfolio checker. Check any wallet's SOL balance, token holdings, recent transactions, and total portfolio value in USD. No signup required. Works with any Solana address.",
  keywords: [
    "solana wallet tracker",
    "solana portfolio checker",
    "check solana wallet balance",
    "solana wallet checker",
    "solana portfolio tracker",
    "check solana wallet",
    "solana wallet balance",
    "solana wallet tracker 2026",
    "solana address lookup",
    "sol balance checker",
    "solana token holdings",
    "solana wallet analyzer",
    "solana wallet lookup",
    "check sol balance",
    "solana wallet viewer",
    "solana portfolio value",
    "solana wallet scanner",
    "free solana wallet tracker",
    "solana wallet monitor",
    "track solana wallet",
  ],
  alternates: {
    canonical: "https://devtools.run/sol-wallet",
  },
  openGraph: {
    title: "Solana Wallet Tracker - Free Portfolio Checker & Balance Lookup",
    description:
      "Check any Solana wallet's SOL balance, token holdings, and portfolio value. Free, instant, no wallet connection required.",
    type: "website",
    url: "https://devtools.run/sol-wallet",
    siteName: "DevTools.run",
  },
  twitter: {
    card: "summary_large_image",
    title: "Solana Wallet Tracker - Free Portfolio Checker",
    description:
      "Paste any Solana address to check SOL balance, token holdings, and recent transactions. Free portfolio tracker with USD values.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
