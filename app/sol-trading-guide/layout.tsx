import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Solana Trading Course — Complete Guide from Zero to Profitable Trader",
  description:
    "Learn to trade Solana tokens: sniping, copy trading, DCA, grid trading, rug pull detection, MEV protection. 8 chapters, 15,000+ words. Beginner to advanced strategies with real examples.",
  keywords: [
    "solana trading guide",
    "how to trade on solana",
    "solana trading course",
    "solana trading strategy",
    "solana token trading",
    "solana beginner guide",
    "crypto trading course",
    "solana snipe tokens",
    "solana copy trading guide",
    "solana rug pull detection",
    "solana DCA strategy",
    "solana MEV protection",
    "jupiter dex trading",
    "solana defi guide",
  ],
  alternates: {
    canonical: "https://devtools-site-delta.vercel.app/sol-trading-guide",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
