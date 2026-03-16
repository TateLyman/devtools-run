import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Crypto Bot Builder Kit — Build Your Own Telegram Trading Bot on Solana",
  description:
    "Everything you need to build a Telegram trading bot on Solana. Full source code (4,100+ lines), deployment guide, Jupiter & Jito integrations, monetization playbook with 7 revenue streams. Node.js.",
  keywords: [
    "build telegram trading bot",
    "crypto bot tutorial",
    "solana bot development",
    "telegram bot source code",
    "crypto trading bot code",
    "solana bot builder",
    "build crypto bot",
    "telegram trading bot tutorial",
    "solana trading bot nodejs",
    "jupiter dex bot",
    "jito mev bot",
    "crypto bot monetization",
    "telegram bot deployment",
    "solana developer tools",
  ],
  alternates: {
    canonical: "https://devtools-site-delta.vercel.app/bot-builder",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
