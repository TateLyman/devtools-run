import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Solana Token Lookup",
  description:
    "Look up any Solana token by mint address. See supply, decimals, holders, and price data. Free, fast, no signup.",
  keywords: [
    "solana token lookup",
    "spl token info",
    "solana mint address",
    "sol token checker",
    "solana token data",
  ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
