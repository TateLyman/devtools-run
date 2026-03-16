import { Metadata } from "next";

export const metadata: Metadata = {
  title: "White-Label Solana Trading Bot — Your Own Branded Telegram Bot",
  description:
    "Launch your own branded Solana Telegram trading bot. 44 commands, token scanning, copy trading, DCA, sniping, alerts. Your brand, your fees, your community. Deployed in 24 hours.",
  keywords: [
    "white label telegram bot",
    "custom crypto bot",
    "branded trading bot",
    "solana bot for projects",
    "white label crypto trading bot",
    "custom solana telegram bot",
    "branded solana scanner",
    "telegram trading bot white label",
    "crypto bot for communities",
    "solana project tools",
    "white label defi bot",
    "custom token scanner bot",
  ],
  alternates: {
    canonical: "https://devtools-site-delta.vercel.app/white-label",
  },
  openGraph: {
    title: "White-Label Solana Trading Bot — Your Own Branded Telegram Bot",
    description:
      "Launch your own branded Solana Telegram trading bot for your community. 44 commands, your branding, your fees. Deployed in 24 hours.",
    url: "https://devtools-site-delta.vercel.app/white-label",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "White-Label Solana Trading Bot",
    description:
      "Your own branded Solana Telegram trading bot. 44 commands, token scanning, copy trading. Your brand, your fees.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
