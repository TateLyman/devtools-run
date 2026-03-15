import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Solana Token Scanner API — Real-Time Token Safety Data",
  description:
    "Paid API for Solana token scanning. Get mint authority, freeze authority, liquidity, volume, price, and risk scoring in a single call. Powered by Solana RPC, Jupiter, and DexScreener. 0.5 SOL for 1,000 requests/month.",
  keywords: [
    "solana token scanner api",
    "solana token safety api",
    "solana rug pull detection api",
    "solana token risk score",
    "solana mint authority check api",
    "dexscreener api alternative",
    "solana token liquidity api",
    "crypto token safety scanner",
    "solana defi api",
    "token risk analysis api",
  ],
  alternates: {
    canonical: "https://devtools-site-delta.vercel.app/api-access",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
