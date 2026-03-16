"use client";

import { useState, useCallback } from "react";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface JupiterPrice {
  price: number | null;
}

interface DexPair {
  chainId: string;
  dexId: string;
  pairAddress: string;
  baseToken: {
    address: string;
    name: string;
    symbol: string;
  };
  quoteToken: {
    address: string;
    name: string;
    symbol: string;
  };
  priceUsd: string | null;
  priceNative: string | null;
  txns: {
    h24: { buys: number; sells: number };
    h6: { buys: number; sells: number };
    h1: { buys: number; sells: number };
    m5: { buys: number; sells: number };
  };
  volume: {
    h24: number;
    h6: number;
    h1: number;
    m5: number;
  };
  priceChange: {
    h24: number;
    h6: number;
    h1: number;
    m5: number;
  };
  liquidity: {
    usd: number;
    base: number;
    quote: number;
  };
  fdv: number;
  marketCap: number;
  pairCreatedAt: number;
  info?: {
    imageUrl?: string;
    websites?: { url: string }[];
    socials?: { type: string; url: string }[];
  };
}

interface ScanResult {
  tokenName: string;
  tokenSymbol: string;
  tokenLogo: string | null;
  mintAddress: string;
  priceUsd: number | null;
  priceChange24h: number | null;
  volume24h: number | null;
  liquidity: number | null;
  fdv: number | null;
  marketCap: number | null;
  txns24h: { buys: number; sells: number } | null;
  topDex: string | null;
  pairAge: number | null; // days
  pairCount: number;
  pairs: DexPair[];
}

type PageStatus =
  | { type: "idle" }
  | { type: "scanning" }
  | { type: "done"; result: ScanResult }
  | { type: "error"; message: string };

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const EXAMPLE_TOKENS = [
  { label: "BONK", mint: "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263" },
  { label: "WIF", mint: "EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm" },
  { label: "JUP", mint: "JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN" },
  { label: "USDC", mint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v" },
];

/* ------------------------------------------------------------------ */
/*  Formatting helpers                                                 */
/* ------------------------------------------------------------------ */

function formatUsd(value: number | null | undefined): string {
  if (value === null || value === undefined) return "N/A";
  if (value >= 1_000_000_000) return `$${(value / 1_000_000_000).toFixed(2)}B`;
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(2)}M`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(2)}K`;
  if (value >= 1) return `$${value.toFixed(2)}`;
  if (value >= 0.01) return `$${value.toFixed(4)}`;
  if (value >= 0.0001) return `$${value.toFixed(6)}`;
  return `$${value.toFixed(10)}`;
}

function formatPrice(value: number | null | undefined): string {
  if (value === null || value === undefined) return "N/A";
  if (value >= 1) return `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}`;
  if (value >= 0.01) return `$${value.toFixed(4)}`;
  if (value >= 0.0001) return `$${value.toFixed(6)}`;
  if (value >= 0.00000001) return `$${value.toFixed(10)}`;
  // For extremely small prices, use subscript notation
  const str = value.toFixed(20);
  const match = str.match(/^0\.0*[1-9]/);
  if (match) {
    const zeros = match[0].length - 2; // subtract "0."
    return `$0.0{${zeros}}${str.slice(match[0].length - 1, match[0].length + 3)}`;
  }
  return `$${value.toExponential(4)}`;
}

function formatNumber(value: number | null | undefined): string {
  if (value === null || value === undefined) return "N/A";
  return value.toLocaleString();
}

function timeAgo(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days > 365) return `${Math.floor(days / 365)}y ${days % 365}d ago`;
  if (days > 30) return `${Math.floor(days / 30)}mo ${days % 30}d ago`;
  if (days > 0) return `${days}d ago`;
  const hours = Math.floor(diff / (1000 * 60 * 60));
  if (hours > 0) return `${hours}h ago`;
  const mins = Math.floor(diff / (1000 * 60));
  return `${mins}m ago`;
}

function isValidSolanaAddress(address: string): boolean {
  return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(address);
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function SolScanPage() {
  const [mintInput, setMintInput] = useState("");
  const [status, setStatus] = useState<PageStatus>({ type: "idle" });

  /* ---- Scan logic ---- */

  const runScan = useCallback(async (mint: string) => {
    setStatus({ type: "scanning" });

    try {
      // Fetch from Jupiter Price API and DexScreener in parallel
      const [jupiterRes, dexRes] = await Promise.allSettled([
        fetch(`https://api.jup.ag/price/v2?ids=${mint}`),
        fetch(`https://api.dexscreener.com/latest/dex/tokens/${mint}`),
      ]);

      // Parse Jupiter price
      let jupiterPrice: number | null = null;
      if (jupiterRes.status === "fulfilled" && jupiterRes.value.ok) {
        try {
          const jupData = await jupiterRes.value.json();
          const p = jupData.data?.[mint]?.price;
          if (p) jupiterPrice = parseFloat(p);
        } catch { /* skip */ }
      }

      // Parse DexScreener data
      let pairs: DexPair[] = [];
      if (dexRes.status === "fulfilled" && dexRes.value.ok) {
        try {
          const dexData = await dexRes.value.json();
          pairs = (dexData.pairs || []).filter(
            (p: DexPair) => p.chainId === "solana"
          );
        } catch { /* skip */ }
      }

      if (!jupiterPrice && pairs.length === 0) {
        setStatus({
          type: "error",
          message:
            "Token not found. Make sure you entered a valid Solana token mint address. The token must be listed on at least one DEX.",
        });
        return;
      }

      // Aggregate data from all pairs
      const topPair = pairs.length > 0 ? pairs[0] : null;

      // Calculate aggregated 24h volume across all pairs
      const totalVolume24h = pairs.reduce(
        (sum, p) => sum + (p.volume?.h24 || 0),
        0
      );

      // Calculate total liquidity across all pairs
      const totalLiquidity = pairs.reduce(
        (sum, p) => sum + (p.liquidity?.usd || 0),
        0
      );

      // Total 24h transactions
      const totalTxns24h = pairs.reduce(
        (acc, p) => ({
          buys: acc.buys + (p.txns?.h24?.buys || 0),
          sells: acc.sells + (p.txns?.h24?.sells || 0),
        }),
        { buys: 0, sells: 0 }
      );

      // Find oldest pair
      const oldestPairTs = pairs.reduce(
        (oldest, p) =>
          p.pairCreatedAt && p.pairCreatedAt < oldest ? p.pairCreatedAt : oldest,
        Infinity
      );

      const result: ScanResult = {
        tokenName: topPair?.baseToken?.name || "Unknown Token",
        tokenSymbol: topPair?.baseToken?.symbol || "???",
        tokenLogo: topPair?.info?.imageUrl || null,
        mintAddress: mint,
        priceUsd: jupiterPrice ?? (topPair?.priceUsd ? parseFloat(topPair.priceUsd) : null),
        priceChange24h: topPair?.priceChange?.h24 ?? null,
        volume24h: totalVolume24h > 0 ? totalVolume24h : null,
        liquidity: totalLiquidity > 0 ? totalLiquidity : null,
        fdv: topPair?.fdv ?? null,
        marketCap: topPair?.marketCap ?? null,
        txns24h: totalTxns24h.buys > 0 || totalTxns24h.sells > 0 ? totalTxns24h : null,
        topDex: topPair?.dexId ?? null,
        pairAge: oldestPairTs < Infinity ? Math.floor((Date.now() - oldestPairTs) / (1000 * 60 * 60 * 24)) : null,
        pairCount: pairs.length,
        pairs: pairs.slice(0, 5), // top 5 pairs
      };

      setStatus({ type: "done", result });
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Scan failed. Please try again.";
      setStatus({ type: "error", message });
    }
  }, []);

  const handleScan = useCallback(
    (mintOverride?: string) => {
      const mint = (mintOverride ?? mintInput).trim();
      if (!mint) {
        setStatus({ type: "error", message: "Please enter a token mint address." });
        return;
      }
      if (!isValidSolanaAddress(mint)) {
        setStatus({ type: "error", message: "Invalid Solana address format. Please enter a valid token mint address." });
        return;
      }
      runScan(mint);
    },
    [mintInput, runScan]
  );

  function handleExampleClick(mint: string) {
    setMintInput(mint);
    handleScan(mint);
  }

  const isLoading = status.type === "scanning";

  /* ---------------------------------------------------------------- */
  /*  Render                                                          */
  /* ---------------------------------------------------------------- */

  return (
    <>
      {/* Hero Section */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-3 leading-tight">
          Solana Token Scanner
        </h1>
        <p className="text-[var(--text-secondary)] text-base max-w-2xl">
          Free Solana token checker. Look up any SPL token's price, liquidity, volume, and trading activity. Paste a contract address below to check if a Solana token is safe before buying.
        </p>
      </div>

      {/* Search Input */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2 text-[var(--text-secondary)]">
          Token Mint Address
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={mintInput}
            onChange={(e) => setMintInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !isLoading && handleScan()}
            placeholder="Enter a Solana token contract address..."
            className="flex-1"
            spellCheck={false}
            autoComplete="off"
          />
          <button
            onClick={() => handleScan()}
            disabled={isLoading}
            className="px-6 py-2 rounded-lg bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white text-sm font-semibold transition-colors disabled:opacity-50 shrink-0 cursor-pointer"
          >
            {isLoading ? "Scanning..." : "Scan Token"}
          </button>
        </div>
        <p className="text-xs text-[var(--text-secondary)] mt-1.5">
          100% free -- no wallet connection required. Data from Jupiter and DexScreener.
        </p>
      </div>

      {/* Example Tokens */}
      <div className="mb-8 flex flex-wrap gap-2">
        <span className="text-xs text-[var(--text-secondary)] self-center mr-1">
          Popular:
        </span>
        {EXAMPLE_TOKENS.map((t) => (
          <button
            key={t.mint}
            onClick={() => handleExampleClick(t.mint)}
            disabled={isLoading}
            className="px-3 py-1.5 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border)] hover:border-[var(--accent)] text-sm transition-colors text-[var(--text-secondary)] hover:text-white disabled:opacity-50 cursor-pointer"
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] p-10 mb-6 text-center">
          <div className="inline-block w-8 h-8 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-sm text-[var(--text-secondary)]">
            Fetching token data from Jupiter and DexScreener...
          </p>
        </div>
      )}

      {/* Error */}
      {status.type === "error" && (
        <div className="rounded-lg border border-[var(--error)] bg-[var(--error)]/10 p-4 text-sm text-[var(--error)] mb-6">
          {status.message}
        </div>
      )}

      {/* Results */}
      {status.type === "done" && <ScanResults result={status.result} />}

      {/* CTA - Always visible */}
      <div className="mt-8 mb-8 rounded-xl overflow-hidden">
        <div className="bg-gradient-to-r from-blue-900/60 to-purple-900/60 p-6 sm:p-8 border border-blue-700/40 rounded-xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/30">
                  FULL SAFETY ANALYSIS
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white mb-2">
                Is this token a rug pull? Find out with @solscanitbot
              </h3>
              <p className="text-gray-300 text-sm mb-1">
                Get the full rug pull analysis on Telegram -- for free:
              </p>
              <ul className="text-gray-400 text-sm space-y-1 mb-4 list-none">
                <li className="flex items-center gap-2">
                  <span className="text-green-400 text-xs">&#9679;</span>
                  <span><strong className="text-gray-200">Mint Authority</strong> -- Can the creator mint unlimited tokens?</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-400 text-xs">&#9679;</span>
                  <span><strong className="text-gray-200">Freeze Authority</strong> -- Can the creator freeze your tokens?</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-400 text-xs">&#9679;</span>
                  <span><strong className="text-gray-200">Top Holder Concentration</strong> -- Is supply concentrated in a few wallets?</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-400 text-xs">&#9679;</span>
                  <span><strong className="text-gray-200">LP Lock Status</strong> -- Is liquidity locked or can it be pulled?</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-400 text-xs">&#9679;</span>
                  <span><strong className="text-gray-200">Safety Score</strong> -- 0-100 risk score with detailed breakdown</span>
                </li>
              </ul>
            </div>
            <div className="shrink-0">
              <a
                href="https://t.me/solscanitbot"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-8 rounded-lg text-sm transition-colors shadow-lg shadow-blue-900/30"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                </svg>
                Scan on Telegram
              </a>
              <p className="text-xs text-gray-500 mt-2 text-center">
                Free and instant
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bot features - secondary CTA */}
      <div className="mb-8 rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] p-6">
        <h3 className="text-lg font-bold text-white mb-2">Trade Solana Tokens on Telegram</h3>
        <p className="text-gray-400 text-sm mb-4">
          Beyond scanning, @solscanitbot is a full Solana trading bot. Buy, sell, copy trade, snipe launches, set limit orders, and DCA -- all from Telegram with MEV protection.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
          {[
            { title: "Buy / Sell", desc: "Instant swaps" },
            { title: "Copy Trade", desc: "Follow wallets" },
            { title: "Sniper", desc: "New launches" },
            { title: "DCA", desc: "Auto-invest" },
          ].map((f) => (
            <div key={f.title} className="rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border)] p-3 text-center">
              <div className="text-sm font-semibold text-white">{f.title}</div>
              <div className="text-xs text-[var(--text-secondary)]">{f.desc}</div>
            </div>
          ))}
        </div>
        <a
          href="https://t.me/solscanitbot"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm text-[var(--accent)] hover:text-[var(--accent-hover)] transition-colors font-medium"
        >
          Open @solscanitbot on Telegram <span aria-hidden="true">&rarr;</span>
        </a>
      </div>

      {/* SEO Content */}
      <section className="mt-6 text-sm text-[var(--text-secondary)] space-y-4">
        <h2 className="text-xl font-bold text-white">
          How to Check if a Solana Token is Safe
        </h2>
        <p>
          Before buying any Solana memecoin or SPL token, you should always check for common rug pull indicators. This free Solana token scanner lets you instantly look up any token's price, trading volume, liquidity depth, and market activity using data from Jupiter and DexScreener.
        </p>

        <h3 className="text-base font-semibold text-white pt-2">
          What This Free Scanner Shows
        </h3>
        <ul className="list-disc list-inside space-y-1">
          <li>
            <strong>Live Price</strong> -- Current USD price via Jupiter aggregator
          </li>
          <li>
            <strong>24h Volume</strong> -- Total trading volume across all DEX pairs
          </li>
          <li>
            <strong>Liquidity</strong> -- Total liquidity available across pools
          </li>
          <li>
            <strong>Market Cap / FDV</strong> -- Fully diluted valuation
          </li>
          <li>
            <strong>24h Transactions</strong> -- Buy vs sell pressure analysis
          </li>
          <li>
            <strong>Top DEX Pairs</strong> -- Where the token is most actively traded
          </li>
          <li>
            <strong>Pair Age</strong> -- How long the token has been trading
          </li>
        </ul>

        <h3 className="text-base font-semibold text-white pt-2">
          What to Look for in a Rug Pull
        </h3>
        <p>
          Low liquidity, very few transactions, and brand-new pair age are warning signs. If a token has less than $10K in liquidity, fewer than 100 transactions per day, or was created within the last few hours, proceed with extreme caution. For deeper analysis including mint authority, freeze authority, holder concentration, and LP lock status, use <a href="https://t.me/solscanitbot" target="_blank" rel="noopener noreferrer" className="text-[var(--accent)] hover:text-[var(--accent-hover)] underline">@solscanitbot on Telegram</a>.
        </p>

        <h3 className="text-base font-semibold text-white pt-2">
          Solana Token Safety Checklist
        </h3>
        <ul className="list-disc list-inside space-y-1">
          <li>Mint authority should be revoked (prevents infinite minting)</li>
          <li>Freeze authority should be revoked (prevents account freezing)</li>
          <li>No single wallet should hold more than 20% of supply</li>
          <li>Liquidity should be locked (prevents LP rug pulls)</li>
          <li>Look for at least $50K+ in liquidity for safer entries</li>
          <li>Check for consistent trading volume, not just a few whale trades</li>
        </ul>
        <p>
          Use the scanner above to check basic token data, then run a full safety analysis on <a href="https://t.me/solscanitbot" target="_blank" rel="noopener noreferrer" className="text-[var(--accent)] hover:text-[var(--accent-hover)] underline">@solscanitbot</a> before making any trade.
        </p>

        <h3 className="text-base font-semibold text-white pt-2">
          Frequently Asked Questions
        </h3>
        <div className="space-y-3">
          <div>
            <p className="font-medium text-gray-300">Is this Solana token scanner free?</p>
            <p>Yes, looking up token prices, volume, and liquidity on this page is 100% free. No wallet connection or payment required. For advanced safety analysis (mint authority, freeze authority, holder analysis), use our free Telegram bot @solscanitbot.</p>
          </div>
          <div>
            <p className="font-medium text-gray-300">How do I know if a Solana token is a scam?</p>
            <p>Check for revoked mint and freeze authorities, locked liquidity, distributed token holders, and sufficient trading volume. Very new tokens with low liquidity and concentrated holders are the highest risk. Our Telegram bot provides an automated safety score based on all these factors.</p>
          </div>
          <div>
            <p className="font-medium text-gray-300">What is mint authority on Solana?</p>
            <p>Mint authority is a permission that allows the token creator to mint (create) unlimited new tokens, diluting existing holders. Safe tokens have this authority revoked. Check this with @solscanitbot on Telegram.</p>
          </div>
          <div>
            <p className="font-medium text-gray-300">What is freeze authority on Solana?</p>
            <p>Freeze authority allows the token creator to freeze any holder's token account, preventing them from selling. This is a major red flag if still enabled on a memecoin. Check this with @solscanitbot on Telegram.</p>
          </div>
        </div>
      </section>

      {/* JSON-LD Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "Solana Token Scanner",
            "description": "Free Solana token scanner and rug pull checker. Look up any SPL token's price, liquidity, volume, and safety analysis.",
            "url": "https://devtools.run/sol-scan",
            "applicationCategory": "FinanceApplication",
            "operatingSystem": "Any",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            },
            "creator": {
              "@type": "Organization",
              "name": "DevTools.run"
            }
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "Is this Solana token scanner free?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes, looking up token prices, volume, and liquidity is 100% free. No wallet connection required. For advanced safety analysis, use the free Telegram bot @solscanitbot."
                }
              },
              {
                "@type": "Question",
                "name": "How do I know if a Solana token is a scam?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Check for revoked mint and freeze authorities, locked liquidity, distributed token holders, and sufficient trading volume. Use the @solscanitbot Telegram bot for automated safety scoring."
                }
              },
              {
                "@type": "Question",
                "name": "What is mint authority on Solana?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Mint authority allows the token creator to mint unlimited new tokens, diluting existing holders. Safe tokens have this revoked."
                }
              },
              {
                "@type": "Question",
                "name": "What is freeze authority on Solana?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Freeze authority allows the token creator to freeze any holder's token account, preventing them from selling. This is a major red flag if enabled."
                }
              }
            ]
          }),
        }}
      />
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Results sub-component                                              */
/* ------------------------------------------------------------------ */

function ScanResults({ result }: { result: ScanResult }) {
  const {
    tokenName,
    tokenSymbol,
    tokenLogo,
    mintAddress,
    priceUsd,
    priceChange24h,
    volume24h,
    liquidity,
    fdv,
    marketCap,
    txns24h,
    topDex,
    pairAge,
    pairCount,
    pairs,
  } = result;

  const priceChangeColor =
    priceChange24h === null
      ? "text-[var(--text-secondary)]"
      : priceChange24h >= 0
        ? "text-green-400"
        : "text-red-400";

  // Quick risk indicators based on public data
  const quickFlags: { label: string; status: "good" | "warning" | "danger"; detail: string }[] = [];

  if (liquidity !== null) {
    if (liquidity >= 50000) {
      quickFlags.push({ label: "Liquidity", status: "good", detail: `${formatUsd(liquidity)} across ${pairCount} pool${pairCount !== 1 ? "s" : ""}` });
    } else if (liquidity >= 10000) {
      quickFlags.push({ label: "Liquidity", status: "warning", detail: `${formatUsd(liquidity)} -- moderate, use caution` });
    } else {
      quickFlags.push({ label: "Liquidity", status: "danger", detail: `${formatUsd(liquidity)} -- very low, high slippage risk` });
    }
  }

  if (volume24h !== null) {
    if (volume24h >= 100000) {
      quickFlags.push({ label: "24h Volume", status: "good", detail: `${formatUsd(volume24h)} -- actively traded` });
    } else if (volume24h >= 10000) {
      quickFlags.push({ label: "24h Volume", status: "warning", detail: `${formatUsd(volume24h)} -- moderate activity` });
    } else {
      quickFlags.push({ label: "24h Volume", status: "danger", detail: `${formatUsd(volume24h)} -- very low trading activity` });
    }
  }

  if (txns24h !== null) {
    const totalTxns = txns24h.buys + txns24h.sells;
    if (totalTxns >= 500) {
      quickFlags.push({ label: "24h Transactions", status: "good", detail: `${formatNumber(totalTxns)} trades (${formatNumber(txns24h.buys)} buys / ${formatNumber(txns24h.sells)} sells)` });
    } else if (totalTxns >= 50) {
      quickFlags.push({ label: "24h Transactions", status: "warning", detail: `${formatNumber(totalTxns)} trades -- moderate` });
    } else {
      quickFlags.push({ label: "24h Transactions", status: "danger", detail: `Only ${formatNumber(totalTxns)} trades in 24h -- suspicious` });
    }
  }

  if (pairAge !== null) {
    if (pairAge >= 30) {
      quickFlags.push({ label: "Token Age", status: "good", detail: `First pair created ${pairAge} days ago` });
    } else if (pairAge >= 3) {
      quickFlags.push({ label: "Token Age", status: "warning", detail: `Only ${pairAge} days old -- relatively new` });
    } else {
      quickFlags.push({ label: "Token Age", status: "danger", detail: `Less than 3 days old -- extremely new` });
    }
  }

  function flagIcon(status: "good" | "warning" | "danger"): string {
    if (status === "good") return "\u2705";
    if (status === "warning") return "\u26a0\ufe0f";
    return "\u274c";
  }

  function flagBorder(status: "good" | "warning" | "danger"): string {
    if (status === "good") return "border-green-500/30";
    if (status === "warning") return "border-yellow-500/30";
    return "border-red-500/30";
  }

  return (
    <div className="space-y-6 mb-6">
      {/* Token Header */}
      <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] p-6">
        <div className="flex items-center gap-4 mb-4">
          {tokenLogo ? (
            <img
              src={tokenLogo}
              alt={tokenName}
              className="w-14 h-14 rounded-full border border-[var(--border)]"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          ) : (
            <div className="w-14 h-14 rounded-full bg-[var(--bg-tertiary)] border border-[var(--border)] flex items-center justify-center text-xl font-bold text-[var(--accent)]">
              {tokenSymbol.charAt(0)}
            </div>
          )}
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-2xl font-bold text-white">{tokenName}</h2>
              <span className="text-sm text-[var(--text-secondary)] bg-[var(--bg-tertiary)] px-2 py-0.5 rounded font-mono">
                {tokenSymbol}
              </span>
            </div>
            <div className="flex items-center gap-3 mt-1 flex-wrap">
              <span className="text-2xl font-bold text-white">
                {formatPrice(priceUsd)}
              </span>
              {priceChange24h !== null && (
                <span className={`text-sm font-semibold ${priceChangeColor}`}>
                  {priceChange24h >= 0 ? "+" : ""}{priceChange24h.toFixed(2)}% (24h)
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border)] p-3">
            <div className="text-xs text-[var(--text-secondary)] mb-1">Market Cap</div>
            <div className="text-sm font-mono font-semibold text-white">
              {formatUsd(marketCap)}
            </div>
          </div>
          <div className="rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border)] p-3">
            <div className="text-xs text-[var(--text-secondary)] mb-1">FDV</div>
            <div className="text-sm font-mono font-semibold text-white">
              {formatUsd(fdv)}
            </div>
          </div>
          <div className="rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border)] p-3">
            <div className="text-xs text-[var(--text-secondary)] mb-1">24h Volume</div>
            <div className="text-sm font-mono font-semibold text-white">
              {formatUsd(volume24h)}
            </div>
          </div>
          <div className="rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border)] p-3">
            <div className="text-xs text-[var(--text-secondary)] mb-1">Liquidity</div>
            <div className="text-sm font-mono font-semibold text-white">
              {formatUsd(liquidity)}
            </div>
          </div>
        </div>

        {/* Mint Address */}
        <div className="mt-4 pt-4 border-t border-[var(--border)]">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-[var(--text-secondary)]">Contract:</span>
            <code className="text-xs font-mono text-[var(--accent)] break-all select-all">
              {mintAddress}
            </code>
          </div>
          <div className="flex items-center gap-4 mt-2">
            <a
              href={`https://solscan.io/token/${mintAddress}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors"
            >
              Solscan <span aria-hidden="true">&rarr;</span>
            </a>
            <a
              href={`https://dexscreener.com/solana/${mintAddress}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors"
            >
              DexScreener <span aria-hidden="true">&rarr;</span>
            </a>
            <a
              href={`https://birdeye.so/token/${mintAddress}?chain=solana`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors"
            >
              Birdeye <span aria-hidden="true">&rarr;</span>
            </a>
          </div>
        </div>
      </div>

      {/* Transaction Details */}
      {txns24h && (
        <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] p-6">
          <h3 className="text-base font-semibold text-white mb-4">
            Trading Activity (24h)
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border)] p-3">
              <div className="text-xs text-[var(--text-secondary)] mb-1">Total Trades</div>
              <div className="text-sm font-mono font-semibold text-white">
                {formatNumber(txns24h.buys + txns24h.sells)}
              </div>
            </div>
            <div className="rounded-lg bg-[var(--bg-tertiary)] border border-green-500/20 p-3">
              <div className="text-xs text-green-400 mb-1">Buys</div>
              <div className="text-sm font-mono font-semibold text-green-400">
                {formatNumber(txns24h.buys)}
              </div>
            </div>
            <div className="rounded-lg bg-[var(--bg-tertiary)] border border-red-500/20 p-3">
              <div className="text-xs text-red-400 mb-1">Sells</div>
              <div className="text-sm font-mono font-semibold text-red-400">
                {formatNumber(txns24h.sells)}
              </div>
            </div>
          </div>
          {/* Buy/sell ratio bar */}
          {txns24h.buys + txns24h.sells > 0 && (
            <div className="mt-3">
              <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)] mb-1">
                <span>Buy/Sell Ratio</span>
                <span className="ml-auto">
                  {((txns24h.buys / (txns24h.buys + txns24h.sells)) * 100).toFixed(1)}% buys
                </span>
              </div>
              <div className="h-2 rounded-full bg-[var(--bg-tertiary)] overflow-hidden flex">
                <div
                  className="h-full bg-green-500 rounded-l-full transition-all"
                  style={{
                    width: `${(txns24h.buys / (txns24h.buys + txns24h.sells)) * 100}%`,
                  }}
                />
                <div
                  className="h-full bg-red-500 rounded-r-full transition-all"
                  style={{
                    width: `${(txns24h.sells / (txns24h.buys + txns24h.sells)) * 100}%`,
                  }}
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Quick Risk Indicators */}
      {quickFlags.length > 0 && (
        <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] p-6">
          <h3 className="text-base font-semibold text-white mb-1">
            Quick Risk Indicators
          </h3>
          <p className="text-xs text-[var(--text-secondary)] mb-4">
            Based on publicly available market data. For full safety analysis, use the Telegram bot below.
          </p>
          <div className="space-y-3">
            {quickFlags.map((flag) => (
              <div
                key={flag.label}
                className={`rounded-lg border bg-[var(--bg-tertiary)] p-4 ${flagBorder(flag.status)}`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-base">{flagIcon(flag.status)}</span>
                  <span className="text-sm font-semibold text-white">
                    {flag.label}
                  </span>
                </div>
                <p className="text-xs text-[var(--text-secondary)] ml-7">
                  {flag.detail}
                </p>
              </div>
            ))}
          </div>

          {/* Gated features CTA */}
          <div className="mt-4 pt-4 border-t border-[var(--border)]">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm text-yellow-500">&#128274;</span>
              <span className="text-sm font-semibold text-white">Full Safety Analysis Available on Telegram</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
              {[
                "Mint Authority Check",
                "Freeze Authority Check",
                "Top 10 Holder Analysis",
                "LP Lock Verification",
                "Safety Score (0-100)",
                "Holder Distribution",
              ].map((item) => (
                <div key={item} className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
                  <span className="text-[var(--accent)]">&#8594;</span>
                  {item}
                </div>
              ))}
            </div>
            <a
              href="https://t.me/solscanitbot"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-5 rounded-lg text-sm transition-colors"
            >
              Get Full Analysis on @solscanitbot
            </a>
          </div>
        </div>
      )}

      {/* Top Pairs */}
      {pairs.length > 0 && (
        <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] p-6">
          <h3 className="text-base font-semibold text-white mb-4">
            Top DEX Pairs ({pairCount} total)
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-[var(--text-secondary)] border-b border-[var(--border)]">
                  <th className="pb-2 pr-4">DEX</th>
                  <th className="pb-2 pr-4">Pair</th>
                  <th className="pb-2 pr-4 text-right">Liquidity</th>
                  <th className="pb-2 pr-4 text-right">24h Vol</th>
                  <th className="pb-2 text-right">Created</th>
                </tr>
              </thead>
              <tbody>
                {pairs.map((pair, i) => (
                  <tr
                    key={pair.pairAddress}
                    className="border-b border-[var(--border)] last:border-b-0"
                  >
                    <td className="py-2.5 pr-4 text-white font-medium capitalize">
                      {pair.dexId}
                    </td>
                    <td className="py-2.5 pr-4 font-mono text-[var(--text-secondary)]">
                      <a
                        href={`https://dexscreener.com/solana/${pair.pairAddress}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-[var(--accent)] transition-colors"
                      >
                        {pair.baseToken.symbol}/{pair.quoteToken.symbol}
                      </a>
                    </td>
                    <td className="py-2.5 pr-4 text-right font-mono text-white">
                      {formatUsd(pair.liquidity?.usd)}
                    </td>
                    <td className="py-2.5 pr-4 text-right font-mono text-white">
                      {formatUsd(pair.volume?.h24)}
                    </td>
                    <td className="py-2.5 text-right text-[var(--text-secondary)]">
                      {pair.pairCreatedAt ? timeAgo(pair.pairCreatedAt) : "N/A"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
