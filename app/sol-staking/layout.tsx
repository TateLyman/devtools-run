import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Solana Staking Calculator - SOL Staking Rewards & APY Estimator",
  description:
    "Free Solana staking calculator. Estimate daily, weekly, monthly, and yearly SOL staking rewards based on current APY. See how much you can earn staking Solana.",
  keywords: [
    "solana staking calculator",
    "solana staking rewards",
    "sol staking apy",
    "solana staking earnings",
    "sol staking calculator",
    "solana validator rewards",
    "stake solana",
    "solana passive income",
  ],
  alternates: {
    canonical: "https://devtools-site-delta.vercel.app/sol-staking",
  },
  openGraph: {
    title: "Solana Staking Calculator - SOL Staking Rewards & APY Estimator",
    description:
      "Calculate your Solana staking rewards. Estimate daily, weekly, monthly, and yearly earnings based on APY.",
    url: "https://devtools-site-delta.vercel.app/sol-staking",
    type: "website",
  },
};

export default function SolStakingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
