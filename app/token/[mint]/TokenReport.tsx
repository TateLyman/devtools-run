"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

/* ------------------------------------------------------------------ */
/*  Types                                                             */
/* ------------------------------------------------------------------ */

interface DexPair {
  baseToken: { name: string; symbol: string; address: string };
  quoteToken: { symbol: string };
  priceUsd: string | null;
  priceChange: { h24: number } | null;
  volume: { h24: number } | null;
  liquidity: { usd: number } | null;
  marketCap: number | null;
  fdv: number | null;
  dexId: string;
  pairAddress: string;
  url: string;
}

interface TokenData {
  name: string;
  symbol: string;
  logoURI: string | null;
  price: number | null;
  priceChange24h: number | null;
  volume24h: number | null;
  liquidity: number | null;
  marketCap: number | null;
  fdv: number | null;
  pairCount: number;
  topPairs: DexPair[];
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                           */
/* ------------------------------------------------------------------ */

function formatUsd(value: number | null): string {
  if (value === null || value === undefined) return "N/A";
  if (value >= 1_000_000_000) return `$${(value / 1_000_000_000).toFixed(2)}B`;
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(2)}M`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(2)}K`;
  if (value < 0.01) return `$${value.toFixed(8)}`;
  return `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })}`;
}

function formatPrice(value: number | null): string {
  if (value === null || value === undefined) return "N/A";
  if (value < 0.000001) return `$${value.toFixed(12)}`;
  if (value < 0.01) return `$${value.toFixed(8)}`;
  return `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })}`;
}

function changeColor(change: number | null): string {
  if (change === null) return "var(--text-secondary)";
  return change >= 0 ? "var(--success, #22c55e)" : "var(--error, #ef4444)";
}

function changePrefix(change: number | null): string {
  if (change === null) return "";
  return change >= 0 ? "+" : "";
}

/* ------------------------------------------------------------------ */
/*  Component                                                         */
/* ------------------------------------------------------------------ */

export default function TokenReport({ mint }: { mint: string }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tokenData, setTokenData] = useState<TokenData | null>(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError("");

      try {
        // Fetch both APIs in parallel
        const [jupRes, dexRes] = await Promise.allSettled([
          fetch(`https://api.jup.ag/price/v2?ids=${mint}`),
          fetch(`https://api.dexscreener.com/latest/dex/tokens/${mint}`),
        ]);

        let jupPrice: number | null = null;
        if (jupRes.status === "fulfilled" && jupRes.value.ok) {
          const jupData = await jupRes.value.json();
          const p = jupData.data?.[mint]?.price;
          if (p) jupPrice = parseFloat(p);
        }

        let name = "Unknown Token";
        let symbol = "???";
        let logoURI: string | null = null;
        let priceChange24h: number | null = null;
        let volume24h: number | null = null;
        let liquidity: number | null = null;
        let marketCap: number | null = null;
        let fdv: number | null = null;
        let pairCount = 0;
        let topPairs: DexPair[] = [];
        let dexPrice: number | null = null;

        if (dexRes.status === "fulfilled" && dexRes.value.ok) {
          const dexData = await dexRes.value.json();
          const pairs: DexPair[] = dexData.pairs || [];
          pairCount = pairs.length;

          if (pairs.length > 0) {
            const main = pairs[0];
            name = main.baseToken.name || name;
            symbol = main.baseToken.symbol || symbol;

            if (main.priceUsd) dexPrice = parseFloat(main.priceUsd);
            priceChange24h = main.priceChange?.h24 ?? null;

            // Sum volume and liquidity across all pairs
            volume24h = pairs.reduce((sum, p) => sum + (p.volume?.h24 || 0), 0);
            liquidity = pairs.reduce((sum, p) => sum + (p.liquidity?.usd || 0), 0);

            marketCap = main.marketCap ?? null;
            fdv = main.fdv ?? null;

            topPairs = pairs.slice(0, 5);
          }
        }

        // Also try Jupiter metadata for logo
        try {
          const metaRes = await fetch(`https://tokens.jup.ag/token/${mint}`);
          if (metaRes.ok) {
            const metaData = await metaRes.json();
            if (metaData.name) name = metaData.name;
            if (metaData.symbol) symbol = metaData.symbol;
            if (metaData.logoURI) logoURI = metaData.logoURI;
          }
        } catch {
          // optional
        }

        const price = jupPrice ?? dexPrice;

        if (!price && pairCount === 0) {
          setError(
            "No market data found for this token. It may not be traded on any DEX yet, or the address may be invalid."
          );
          setLoading(false);
          return;
        }

        setTokenData({
          name,
          symbol,
          logoURI,
          price,
          priceChange24h,
          volume24h,
          liquidity,
          marketCap,
          fdv,
          pairCount,
          topPairs,
        });
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch token data."
        );
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [mint]);

  /* ---- Loading ---- */

  if (loading) {
    return (
      <>
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-1">Loading Token Data...</h1>
          <p className="text-[var(--text-secondary)] text-sm font-mono">
            {mint}
          </p>
        </div>
        <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] p-8 text-center">
          <div className="inline-block w-8 h-8 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-sm text-[var(--text-secondary)]">
            Fetching live market data from Jupiter and DexScreener...
          </p>
        </div>
      </>
    );
  }

  /* ---- Error ---- */

  if (error) {
    return (
      <>
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-1">Token Not Found</h1>
          <p className="text-[var(--text-secondary)] text-sm font-mono break-all">
            {mint}
          </p>
        </div>
        <div className="rounded-lg border border-[var(--error)] bg-[var(--error)]/10 p-4 text-sm text-[var(--error)] mb-6">
          {error}
        </div>
        <div className="flex gap-3">
          <Link
            href="/token"
            className="px-4 py-2 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border)] hover:border-[var(--accent)] text-sm transition-colors text-[var(--text-secondary)] hover:text-white"
          >
            Back to Token Checker
          </Link>
          <a
            href="https://t.me/solscanitbot"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-lg bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white text-sm font-medium transition-colors"
          >
            Try @solscanitbot Instead
          </a>
        </div>
      </>
    );
  }

  if (!tokenData) return null;

  /* ---- Render ---- */

  return (
    <>
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          {tokenData.logoURI ? (
            <img
              src={tokenData.logoURI}
              alt={tokenData.name}
              className="w-10 h-10 rounded-full border border-[var(--border)]"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-[var(--bg-tertiary)] border border-[var(--border)] flex items-center justify-center text-base font-bold text-[var(--accent)]">
              {tokenData.symbol.charAt(0)}
            </div>
          )}
          <div>
            <h1 className="text-2xl font-bold">
              {tokenData.name} ({tokenData.symbol})
            </h1>
            <p className="text-[var(--text-secondary)] text-xs font-mono break-all">
              {mint}
            </p>
          </div>
        </div>
      </div>

      {/* Price Hero */}
      <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] p-6 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <div className="text-xs text-[var(--text-secondary)] mb-1">
              Current Price
            </div>
            <div className="text-3xl font-bold text-white">
              {formatPrice(tokenData.price)}
            </div>
          </div>
          {tokenData.priceChange24h !== null && (
            <div className="text-right">
              <div className="text-xs text-[var(--text-secondary)] mb-1">
                24h Change
              </div>
              <div
                className="text-xl font-bold"
                style={{ color: changeColor(tokenData.priceChange24h) }}
              >
                {changePrefix(tokenData.priceChange24h)}
                {tokenData.priceChange24h?.toFixed(2)}%
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] p-4">
          <div className="text-xs text-[var(--text-secondary)] mb-1">
            Market Cap
          </div>
          <div className="text-lg font-bold text-white font-mono">
            {formatUsd(tokenData.marketCap)}
          </div>
        </div>
        <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] p-4">
          <div className="text-xs text-[var(--text-secondary)] mb-1">
            24h Volume
          </div>
          <div className="text-lg font-bold text-white font-mono">
            {formatUsd(tokenData.volume24h)}
          </div>
        </div>
        <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] p-4">
          <div className="text-xs text-[var(--text-secondary)] mb-1">
            Total Liquidity
          </div>
          <div className="text-lg font-bold text-white font-mono">
            {formatUsd(tokenData.liquidity)}
          </div>
        </div>
        <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] p-4">
          <div className="text-xs text-[var(--text-secondary)] mb-1">
            Trading Pairs
          </div>
          <div className="text-lg font-bold text-white font-mono">
            {tokenData.pairCount}
          </div>
        </div>
      </div>

      {/* FDV if available */}
      {tokenData.fdv && (
        <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] p-4 mb-6">
          <div className="text-xs text-[var(--text-secondary)] mb-1">
            Fully Diluted Valuation (FDV)
          </div>
          <div className="text-lg font-bold text-white font-mono">
            {formatUsd(tokenData.fdv)}
          </div>
        </div>
      )}

      {/* BIG CTA - Rug Pull Scan */}
      <div className="mb-6 rounded-xl border-2 border-[var(--accent)] bg-gradient-to-r from-blue-900/40 to-purple-900/40 p-8 text-center">
        <h2 className="text-2xl font-bold text-white mb-2">
          Is {tokenData.symbol} Safe to Buy?
        </h2>
        <p className="text-gray-300 text-sm mb-4 max-w-xl mx-auto">
          Market data alone can&apos;t tell you if a token is a rug pull. Get a full
          on-chain safety scan that checks for the red flags that matter.
        </p>
        <a
          href="https://t.me/solscanitbot"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white font-bold py-3 px-8 rounded-lg text-base transition-colors"
        >
          Scan {tokenData.symbol} for Rug Pull Signals
        </a>
        <p className="text-xs text-[var(--text-secondary)] mt-3">
          via @solscanitbot on Telegram — instant results
        </p>
      </div>

      {/* What the bot checks */}
      <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] p-6 mb-6">
        <h3 className="text-base font-semibold text-white mb-4">
          What Our Scanner Checks
        </h3>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            {
              label: "Mint Authority",
              desc: "Whether the creator can mint unlimited tokens to dilute supply and crash the price.",
              icon: "M",
            },
            {
              label: "Freeze Authority",
              desc: "Whether the creator can freeze any holder's token account, preventing them from selling.",
              icon: "F",
            },
            {
              label: "Holder Concentration",
              desc: "Top wallet ownership percentages. High concentration means one wallet can dump the entire supply.",
              icon: "H",
            },
            {
              label: "LP Lock Status",
              desc: "Whether the liquidity pool tokens are locked or burned, preventing a liquidity rug pull.",
              icon: "L",
            },
            {
              label: "Liquidity Ratio",
              desc: "Real liquidity relative to market cap. Low ratios mean your sell will cause massive slippage.",
              icon: "R",
            },
            {
              label: "Safety Score",
              desc: "A composite 0-100 score based on all checks above. Higher is safer.",
              icon: "S",
            },
          ].map((item) => (
            <div
              key={item.label}
              className="flex gap-3 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border)] p-4"
            >
              <div className="w-8 h-8 rounded-full bg-[var(--accent)]/20 border border-[var(--accent)]/30 flex items-center justify-center text-xs font-bold text-[var(--accent)] shrink-0">
                {item.icon}
              </div>
              <div>
                <div className="text-sm font-semibold text-white">
                  {item.label}
                </div>
                <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Trading Pairs */}
      {tokenData.topPairs.length > 0 && (
        <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] p-6 mb-6">
          <h3 className="text-base font-semibold text-white mb-4">
            Top Trading Pairs
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-[var(--text-secondary)] border-b border-[var(--border)]">
                  <th className="pb-2 pr-4">DEX</th>
                  <th className="pb-2 pr-4">Pair</th>
                  <th className="pb-2 pr-4 text-right">Price</th>
                  <th className="pb-2 pr-4 text-right">24h Volume</th>
                  <th className="pb-2 text-right">Liquidity</th>
                </tr>
              </thead>
              <tbody>
                {tokenData.topPairs.map((pair) => (
                  <tr
                    key={pair.pairAddress}
                    className="border-b border-[var(--border)] last:border-b-0"
                  >
                    <td className="py-2.5 pr-4 text-white capitalize">
                      {pair.dexId}
                    </td>
                    <td className="py-2.5 pr-4 font-mono text-[var(--text-secondary)]">
                      <a
                        href={pair.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-[var(--accent)] transition-colors"
                      >
                        {pair.baseToken.symbol}/{pair.quoteToken.symbol}
                      </a>
                    </td>
                    <td className="py-2.5 pr-4 text-right font-mono text-white">
                      {pair.priceUsd
                        ? formatPrice(parseFloat(pair.priceUsd))
                        : "N/A"}
                    </td>
                    <td className="py-2.5 pr-4 text-right font-mono text-white">
                      {formatUsd(pair.volume?.h24 ?? null)}
                    </td>
                    <td className="py-2.5 text-right font-mono text-white">
                      {formatUsd(pair.liquidity?.usd ?? null)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* External links */}
      <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] p-6 mb-6">
        <h3 className="text-base font-semibold text-white mb-4">
          View on Explorers
        </h3>
        <div className="flex flex-wrap gap-3">
          <a
            href={`https://solscan.io/token/${mint}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border)] hover:border-[var(--accent)] text-sm text-[var(--text-secondary)] hover:text-white transition-colors"
          >
            Solscan
            <span aria-hidden="true">&rarr;</span>
          </a>
          <a
            href={`https://dexscreener.com/solana/${mint}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border)] hover:border-[var(--accent)] text-sm text-[var(--text-secondary)] hover:text-white transition-colors"
          >
            DexScreener
            <span aria-hidden="true">&rarr;</span>
          </a>
          <a
            href={`https://birdeye.so/token/${mint}?chain=solana`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border)] hover:border-[var(--accent)] text-sm text-[var(--text-secondary)] hover:text-white transition-colors"
          >
            Birdeye
            <span aria-hidden="true">&rarr;</span>
          </a>
          <a
            href={`https://jup.ag/swap/SOL-${mint}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border)] hover:border-[var(--accent)] text-sm text-[var(--text-secondary)] hover:text-white transition-colors"
          >
            Trade on Jupiter
            <span aria-hidden="true">&rarr;</span>
          </a>
        </div>
      </div>

      {/* Related links */}
      <div className="flex flex-wrap gap-3 mb-6">
        <Link
          href="/token"
          className="px-4 py-2 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border)] hover:border-[var(--accent)] text-sm transition-colors text-[var(--text-secondary)] hover:text-white"
        >
          Scan Another Token
        </Link>
        <Link
          href="/sol-scan"
          className="px-4 py-2 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border)] hover:border-[var(--accent)] text-sm transition-colors text-[var(--text-secondary)] hover:text-white"
        >
          Premium Deep Scan
        </Link>
        <a
          href="https://t.me/solscanitbot"
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border)] hover:border-[var(--accent)] text-sm transition-colors text-[var(--text-secondary)] hover:text-white"
        >
          @solscanitbot on Telegram
        </a>
      </div>

      {/* Bot CTA */}
      <div className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 rounded-xl p-6 border border-blue-800/30 mb-6">
        <h3 className="text-lg font-bold text-white mb-2">
          Trade {tokenData.symbol} on Telegram
        </h3>
        <p className="text-gray-300 text-sm mb-3">
          Buy, sell, copy trade, snipe new tokens, and DCA — all from Telegram.
          MEV-protected. 0.5% fees with Premium.
        </p>
        <a
          href="https://t.me/solscanitbot"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg text-sm transition-colors"
        >
          Open @solscanitbot
        </a>
      </div>

      {/* Ad slot */}
      <div className="ad-slot mt-8">
        <span>Ad Space</span>
      </div>

      {/* SEO content */}
      <section className="mt-10 text-sm text-[var(--text-secondary)] space-y-2">
        <h2 className="text-lg font-semibold text-white">
          About {tokenData.name} ({tokenData.symbol})
        </h2>
        <p>
          This page shows live market data for {tokenData.name} ({tokenData.symbol})
          on the Solana blockchain. Price data is sourced from Jupiter and DexScreener.
          Liquidity and volume figures are aggregated across all known trading pairs.
        </p>
        <p>
          To check if {tokenData.symbol} is safe to buy, we recommend running a full
          on-chain safety scan using{" "}
          <a
            href="https://t.me/solscanitbot"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--accent)] hover:text-[var(--accent-hover)]"
          >
            @solscanitbot
          </a>{" "}
          on Telegram. The bot checks mint authority, freeze authority, holder
          concentration, LP lock status, and produces a safety score from 0 to 100.
          You can also use the{" "}
          <Link
            href="/sol-scan"
            className="text-[var(--accent)] hover:text-[var(--accent-hover)]"
          >
            premium scanner on this site
          </Link>{" "}
          for a detailed web-based report.
        </p>
      </section>
    </>
  );
}
