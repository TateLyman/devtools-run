import { Metadata } from "next";

export const metadata: Metadata = {
  title: "SOL Grid Trading Bot — Automated Solana Trading on Jupiter DEX",
  description:
    "Production-grade grid trading bot for Solana. Backtested +11.7% during a -37% SOL crash. Python source code, paper trading, backtester, Pyth oracle, risk management. Deploy free on Oracle Cloud.",
  keywords: [
    "solana grid trading bot",
    "solana trading bot python",
    "jupiter dex bot",
    "automated solana trading",
    "grid bot crypto",
    "solana bot source code",
    "sol trading automation",
    "crypto grid strategy",
  ],
  alternates: {
    canonical: "https://devtools-site-delta.vercel.app/sol-grid-bot",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
