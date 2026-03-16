import { Metadata } from "next";
import TokenReport from "./TokenReport";

/* ------------------------------------------------------------------ */
/*  Dynamic SEO metadata                                              */
/* ------------------------------------------------------------------ */

interface PageProps {
  params: Promise<{ mint: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { mint } = await params;

  // Try to fetch token name/symbol for better SEO titles
  let symbol = mint.slice(0, 8) + "...";
  let name = "Solana Token";

  try {
    const res = await fetch(`https://tokens.jup.ag/token/${mint}`, {
      next: { revalidate: 3600 },
    });
    if (res.ok) {
      const data = await res.json();
      if (data.symbol) symbol = data.symbol;
      if (data.name) name = data.name;
    }
  } catch {
    // Use fallback values
  }

  const title = `${symbol} Safety Check — Solana Token Scanner`;
  const description = `Check if ${name} (${symbol}) is safe to buy. Scan for rug pull signals including mint authority, freeze authority, holder concentration, liquidity, and more.`;

  return {
    title,
    description,
    keywords: [
      `${symbol} safe`,
      `${symbol} rug pull`,
      `${symbol} scam`,
      `is ${symbol} safe`,
      `${name} token safety`,
      `${symbol} solana`,
      `${symbol} price`,
      `${symbol} liquidity`,
      "solana token checker",
      "solana rug pull detector",
    ],
    alternates: {
      canonical: `https://devtools-site-delta.vercel.app/token/${mint}`,
    },
    openGraph: {
      title,
      description,
      type: "website",
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  };
}

/* ------------------------------------------------------------------ */
/*  Page (server component shell)                                     */
/* ------------------------------------------------------------------ */

export default async function TokenPage({ params }: PageProps) {
  const { mint } = await params;
  return <TokenReport mint={mint} />;
}
