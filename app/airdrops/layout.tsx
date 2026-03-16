import { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Solana Airdrops 2026 — Upcoming & Past Solana Airdrop List + How to Qualify",
  description:
    "Complete list of upcoming Solana airdrops for 2026. Track Jupiter, Tensor, Kamino, Drift, Sanctum, Parcl and more. Learn how to qualify for free Solana airdrops, check eligibility, and maximize your rewards.",
  keywords: [
    "solana airdrops 2026",
    "upcoming solana airdrops",
    "free solana airdrops",
    "solana airdrop list",
    "solana airdrop checker",
    "how to get solana airdrops",
    "solana airdrop eligibility",
    "upcoming crypto airdrops",
    "solana defi airdrops",
    "free solana tokens",
    "solana airdrop guide",
    "best solana airdrops",
    "solana ecosystem airdrops",
    "jupiter airdrop",
    "kamino airdrop",
    "drift airdrop",
    "tensor airdrop",
    "sanctum airdrop",
    "parcl airdrop",
    "free crypto airdrops 2026",
    "solana airdrop farming",
    "how to qualify for airdrops",
  ],
  alternates: {
    canonical: "https://devtools-site-delta.vercel.app/airdrops",
  },
  openGraph: {
    title: "Solana Airdrops 2026 — Full List of Upcoming & Past Airdrops",
    description:
      "Track every Solana airdrop. See which ones are live, upcoming, and ended. Learn how to qualify and check your eligibility.",
    type: "website",
    url: "https://devtools-site-delta.vercel.app/airdrops",
    siteName: "DevTools.run",
  },
  twitter: {
    card: "summary_large_image",
    title: "Solana Airdrops 2026 — Upcoming & Past Airdrop Tracker",
    description:
      "Complete Solana airdrop list for 2026. Track upcoming drops, eligibility, and estimated values. Free airdrop checker tools included.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
