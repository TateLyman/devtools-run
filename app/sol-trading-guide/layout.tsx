import { Metadata } from "next";

export const metadata: Metadata = {
  title: "The Complete Solana Trading Guide — From Zero to Profitable Trader",
  description:
    "Learn to trade Solana tokens: sniping, copy trading, DCA, grid trading, rug pull detection, MEV protection. 8 chapters, 15,000+ words. Beginner to advanced.",
  keywords: [
    "solana trading guide",
    "how to trade solana",
    "solana trading strategy",
    "solana token trading",
    "solana beginner guide",
    "crypto trading guide",
    "solana snipe tokens",
    "solana copy trading guide",
    "solana rug pull detection",
    "solana trading course",
  ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
