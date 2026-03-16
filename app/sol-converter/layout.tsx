import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SOL to USD Converter - Live Solana Price Calculator | SOL vs ETH vs BTC",
  description:
    "Convert SOL to USD instantly with live Solana prices. Compare SOL with ETH and BTC. Free real-time crypto converter updated every 60 seconds.",
  keywords: [
    "sol to usd",
    "solana price",
    "sol converter",
    "solana to usd",
    "sol usd converter",
    "solana price calculator",
    "sol price live",
    "solana vs ethereum",
    "solana vs bitcoin",
    "crypto converter",
  ],
  alternates: {
    canonical: "https://devtools-site-delta.vercel.app/sol-converter",
  },
  openGraph: {
    title: "SOL to USD Converter - Live Solana Price with ETH & BTC Comparison",
    description:
      "Convert SOL to USD with live prices. Compare Solana with Ethereum and Bitcoin side by side.",
    url: "https://devtools-site-delta.vercel.app/sol-converter",
    type: "website",
  },
};

export default function SolConverterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
