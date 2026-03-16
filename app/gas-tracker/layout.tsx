import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Solana Gas Fee Tracker - Transaction Costs vs Ethereum | Real-Time",
  description:
    "Track Solana gas fees in real-time. Compare Solana's ultra-low transaction costs (~$0.00025) with Ethereum gas fees. See why Solana is the cheapest chain for trading.",
  keywords: [
    "solana gas fees",
    "solana transaction cost",
    "solana fees vs ethereum",
    "solana network fees",
    "sol gas tracker",
    "solana priority fees",
    "cheapest blockchain fees",
    "solana vs ethereum fees",
    "crypto gas fees comparison",
  ],
  alternates: {
    canonical: "https://devtools-site-delta.vercel.app/gas-tracker",
  },
  openGraph: {
    title: "Solana Gas Fee Tracker - Real-Time Transaction Costs vs Ethereum",
    description:
      "Compare Solana's near-zero gas fees with Ethereum. Real-time fee tracking and cost comparison.",
    url: "https://devtools-site-delta.vercel.app/gas-tracker",
    type: "website",
  },
};

export default function GasTrackerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
