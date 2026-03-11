import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Solana Trading Bot for Telegram — Free Copy Trading, Sniping, DCA",
  description:
    "Free Solana trading bot on Telegram. Buy/sell tokens, copy trade wallets, snipe new launches with Pump.fun direct trading, DCA, limit orders, auto take-profit. Jito MEV protected. @solscanitbot",
  keywords: [
    "solana trading bot",
    "solana telegram bot",
    "solana sniper bot",
    "copy trade solana",
    "solana dca bot",
    "pump.fun trading bot",
    "solana limit order bot",
    "free solana bot",
    "jito mev bot",
    "solana auto trade",
  ],
  alternates: {
    canonical: "https://devtools-site-delta.vercel.app/sol-bot",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
