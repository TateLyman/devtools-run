import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SOL/USD Calculator - Solana to USD Converter with Live Price",
  description:
    "Free Solana (SOL) to USD converter with live prices from CoinGecko. Instantly calculate SOL to USD and USD to SOL. Auto-refreshes every 60 seconds.",
  keywords: [
    "SOL USD calculator",
    "Solana converter",
    "SOL to USD",
    "USD to SOL",
    "Solana price",
    "crypto calculator",
  ],
  alternates: {
    canonical: "https://devtools-site-delta.vercel.app/sol-calc",
  },
};

export default function SolCalcLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
