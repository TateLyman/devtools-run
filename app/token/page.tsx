import { Metadata } from "next";
import Link from "next/link";
import TokenSearchBox from "./TokenSearchBox";

export const metadata: Metadata = {
  title: "Solana Token Checker — Is This Token Safe?",
  description:
    "Check if any Solana token is safe to buy. Free token safety checker with rug pull detection, liquidity analysis, and scam alerts. Paste any mint address to scan.",
  keywords: [
    "solana token checker",
    "solana token safety",
    "check solana token",
    "solana rug pull checker",
    "is solana token safe",
    "solana scam check",
    "solana token scanner",
    "solana token analysis",
    "SPL token safety check",
    "solana memecoin checker",
  ],
  alternates: {
    canonical: "https://devtools-site-delta.vercel.app/token",
  },
  openGraph: {
    title: "Solana Token Checker — Is This Token Safe?",
    description:
      "Check if any Solana token is safe to buy. Scan for rug pull signals, liquidity issues, and scam patterns.",
    type: "website",
  },
};

/* ------------------------------------------------------------------ */
/*  Top tokens list — pre-linked for SEO                              */
/* ------------------------------------------------------------------ */

const TOP_TOKENS = [
  { symbol: "SOL", name: "Wrapped SOL", mint: "So11111111111111111111111111111111111111112" },
  { symbol: "USDC", name: "USD Coin", mint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v" },
  { symbol: "USDT", name: "Tether USD", mint: "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB" },
  { symbol: "BONK", name: "Bonk", mint: "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263" },
  { symbol: "WIF", name: "dogwifhat", mint: "EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm" },
  { symbol: "JUP", name: "Jupiter", mint: "JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN" },
  { symbol: "RAY", name: "Raydium", mint: "4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R" },
  { symbol: "PYTH", name: "Pyth Network", mint: "HZ1JovNiVvGrGNiiYvEozEVgZ58xaU3RKwX8eACQBCt3" },
  { symbol: "JTO", name: "Jito", mint: "jtojtomepa8beP8AuQc6eXt5FriJwfFMwQx2v2f9mCL" },
  { symbol: "W", name: "Wormhole", mint: "85VBFQZC9TZkfaptBWjvUw7YbZjy52A6mjtPGjstQAmQ" },
  { symbol: "ORCA", name: "Orca", mint: "orcaEKTdK7LKz57vaAYr9QeNsVEPfiu6QeMU1kektZE" },
  { symbol: "POPCAT", name: "Popcat", mint: "7GCihgDB8fe6KNjn2MYtkzZcRjQy3t9GHdC8uHYmW2hr" },
  { symbol: "MEW", name: "cat in a dogs world", mint: "MEW1gQWJ3nEXg2qgERiKu7FAFj79PHvQVREQUzScPP5" },
  { symbol: "RENDER", name: "Render Token", mint: "rndrizKT3MK1iimdxRdWabcF7Zg7AR5T4nud4EkHBof" },
  { symbol: "HNT", name: "Helium", mint: "hntyVP6YFm1Hg25TN9WGLqM12b8TQmcknKrdu1oxWux" },
  { symbol: "TRUMP", name: "Official Trump", mint: "6p6xgHyF7AeE6TZkSmFsko444wqoP15icUSqi2jfGiPN" },
  { symbol: "FARTCOIN", name: "Fartcoin", mint: "9BB6NFEcjBCtnNLFko2FqVQBq8HHM13kCyYcdQbgpump" },
  { symbol: "AI16Z", name: "ai16z", mint: "HeLp6NuQkmYB4pYWo2zYs22mESHXPQYzXbB8n4V98jwC" },
  { symbol: "PENGU", name: "Pudgy Penguins", mint: "2zMMhcVQEXDtdE6vsFS7S7D5oUodfJHE8vd1gnBouauv" },
  { symbol: "BOME", name: "BOOK OF MEME", mint: "ukHH6c7mMyiWCf6HyRELbMTJBPF43WRmu3MsAMa4VBa" },
];

/* ------------------------------------------------------------------ */
/*  Page                                                              */
/* ------------------------------------------------------------------ */

export default function TokenLandingPage() {
  return (
    <>
      {/* Hero */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          Solana Token Safety Checker
        </h1>
        <p className="text-[var(--text-secondary)] text-sm max-w-2xl">
          Paste any Solana token mint address to check if it&apos;s safe. View live price,
          liquidity, volume, market cap, and rug pull signals. Powered by
          DexScreener and Jupiter data.
        </p>
      </div>

      {/* Search Box (client component) */}
      <TokenSearchBox />

      {/* What We Check */}
      <section className="mt-10 mb-10">
        <h2 className="text-xl font-bold text-white mb-4">
          What Does the Safety Check Cover?
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              title: "Mint Authority",
              desc: "Can the creator mint unlimited new tokens and dilute your bag?",
            },
            {
              title: "Freeze Authority",
              desc: "Can the creator freeze your token account so you can't sell?",
            },
            {
              title: "Holder Concentration",
              desc: "Does a single wallet hold a dangerous percentage of the supply?",
            },
            {
              title: "Liquidity Lock",
              desc: "Is the liquidity pool locked, or can the dev pull it at any time?",
            },
            {
              title: "Liquidity Ratio",
              desc: "How much real liquidity backs the token relative to market cap?",
            },
            {
              title: "Trading Volume",
              desc: "Is there real trading activity, or just wash trading?",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] p-5"
            >
              <h3 className="text-sm font-semibold text-white mb-1">
                {item.title}
              </h3>
              <p className="text-xs text-[var(--text-secondary)]">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <div className="mb-10 bg-gradient-to-r from-blue-900/50 to-purple-900/50 rounded-xl p-6 border border-blue-800/30">
        <h3 className="text-lg font-bold text-white mb-2">
          Get Instant Token Scans on Telegram
        </h3>
        <p className="text-gray-300 text-sm mb-3">
          Scan any token in seconds. Our Telegram bot checks mint authority, freeze
          authority, holder concentration, LP lock status, and more. Just paste a
          contract address.
        </p>
        <a
          href="https://t.me/solscanitbot"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg text-sm transition-colors"
        >
          Open @solscanitbot on Telegram
        </a>
      </div>

      {/* Top Tokens Grid */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-white mb-4">
          Top Solana Tokens — Safety Reports
        </h2>
        <p className="text-[var(--text-secondary)] text-sm mb-4">
          Click any token to view its live safety report with price, liquidity,
          market cap, and rug pull analysis.
        </p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {TOP_TOKENS.map((token) => (
            <Link
              key={token.mint}
              href={`/token/${token.mint}`}
              className="rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] hover:border-[var(--accent)] p-4 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[var(--bg-tertiary)] border border-[var(--border)] flex items-center justify-center text-sm font-bold text-[var(--accent)] group-hover:border-[var(--accent)] transition-colors">
                  {token.symbol.charAt(0)}
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">
                    {token.symbol}
                  </div>
                  <div className="text-xs text-[var(--text-secondary)]">
                    {token.name}
                  </div>
                </div>
              </div>
              <div className="mt-2 text-xs text-[var(--text-secondary)] font-mono truncate">
                {token.mint}
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Ad slot */}
      <div className="ad-slot mt-8">
        <span>Ad Space</span>
      </div>

      {/* SEO content */}
      <section className="mt-10 text-sm text-[var(--text-secondary)] space-y-3">
        <h2 className="text-lg font-semibold text-white">
          How to Check if a Solana Token Is Safe
        </h2>
        <p>
          Before buying any Solana token, you should check for common rug pull
          indicators. The most important factors are whether the mint authority is
          revoked (preventing unlimited token creation), whether the freeze
          authority is revoked (preventing the creator from freezing your tokens),
          and how concentrated the token supply is among top holders.
        </p>
        <p>
          Our Solana Token Safety Checker fetches live data from DexScreener and
          Jupiter to show you price, 24-hour volume, liquidity, market cap, and
          the number of active trading pairs. Combined with on-chain analysis from
          our Telegram bot, you get a complete picture of whether a token is safe
          to trade.
        </p>
        <h3 className="text-base font-semibold text-white pt-2">
          Common Solana Token Scam Patterns
        </h3>
        <ul className="list-disc list-inside space-y-1">
          <li>
            <strong>Mint authority enabled</strong> &mdash; The creator can print
            unlimited tokens, crashing the price
          </li>
          <li>
            <strong>Freeze authority enabled</strong> &mdash; The creator can freeze
            your wallet, preventing you from selling
          </li>
          <li>
            <strong>Top holder owns 50%+</strong> &mdash; One wallet can dump the
            entire supply
          </li>
          <li>
            <strong>Low liquidity</strong> &mdash; Even a small sell causes massive
            price impact
          </li>
          <li>
            <strong>No LP lock</strong> &mdash; The developer can pull all liquidity
            at any time
          </li>
        </ul>
        <h3 className="text-base font-semibold text-white pt-2">
          Free vs. Deep Scan
        </h3>
        <p>
          This page shows live market data (price, volume, liquidity, market cap)
          for free using public APIs. For a deep on-chain safety scan including
          mint/freeze authority checks, holder analysis, and a safety score, use
          our{" "}
          <Link href="/sol-scan" className="text-[var(--accent)] hover:text-[var(--accent-hover)]">
            premium Solana Token Scanner
          </Link>{" "}
          or scan instantly on Telegram via{" "}
          <a
            href="https://t.me/solscanitbot"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--accent)] hover:text-[var(--accent-hover)]"
          >
            @solscanitbot
          </a>
          .
        </p>
      </section>
    </>
  );
}
