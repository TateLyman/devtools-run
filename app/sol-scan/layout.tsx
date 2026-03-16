import { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Solana Token Scanner - Free Rug Pull Checker & Token Safety Analysis",
  description:
    "Free Solana token scanner and rug pull checker. Paste any token contract address to check price, liquidity, volume, and safety. Is this Solana token safe? Find out instantly. No wallet connection required.",
  keywords: [
    "solana token scanner",
    "solana rug pull checker",
    "is this solana token safe",
    "solana token safety check",
    "solana scam checker",
    "solana token checker",
    "solana contract checker",
    "solana rug check",
    "solana token analysis",
    "solana token lookup",
    "sol token scanner",
    "spl token checker",
    "solana memecoin checker",
    "is solana token a scam",
    "solana token rug pull detector",
    "solana mint authority check",
    "solana freeze authority check",
    "solana token liquidity check",
    "check solana token",
    "free solana scanner",
  ],
  alternates: {
    canonical: "https://devtools.run/sol-scan",
  },
  openGraph: {
    title: "Solana Token Scanner - Free Rug Pull Checker",
    description:
      "Free Solana token scanner. Paste any contract address to instantly check price, liquidity, volume, and safety. No wallet required.",
    type: "website",
    url: "https://devtools.run/sol-scan",
    siteName: "DevTools.run",
  },
  twitter: {
    card: "summary_large_image",
    title: "Solana Token Scanner - Free Rug Pull Checker",
    description:
      "Paste any Solana token address to check if it's safe. Free price, liquidity, and volume lookup. Full safety analysis via Telegram bot.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
