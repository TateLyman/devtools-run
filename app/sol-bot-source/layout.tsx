import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Solana Telegram Trading Bot Source Code — 4,100+ Lines Production-Ready",
  description:
    "Full source code for a Solana Telegram trading bot. 42 commands, copy trading, sniping, DCA, limit orders, portfolio tracking, referral system, premium tier, token promotions. Node.js, Jupiter DEX, Jito MEV protection.",
  keywords: [
    "solana trading bot source code",
    "telegram bot source code",
    "solana bot github",
    "crypto trading bot code",
    "jupiter dex bot source",
    "solana sniper bot code",
    "copy trading bot source",
    "telegram trading bot nodejs",
    "solana bot template",
    "crypto bot source code buy",
  ],
  alternates: {
    canonical: "https://devtools-site-delta.vercel.app/sol-bot-source",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
