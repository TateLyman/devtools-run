"use client";

import { useState, useCallback } from "react";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface TokenAccount {
  mint: string;
  amount: string;
  decimals: number;
  uiAmount: number;
}

interface TokenPriceInfo {
  mint: string;
  price: number | null;
  symbol: string | null;
  name: string | null;
}

interface Transaction {
  signature: string;
  slot: number;
  blockTime: number | null;
  err: unknown | null;
}

interface WalletData {
  solBalance: number;
  solPrice: number | null;
  tokens: TokenAccount[];
  tokenPrices: Map<string, TokenPriceInfo>;
  transactions: Transaction[];
  totalTokenValueUsd: number;
}

type PageStatus =
  | { type: "idle" }
  | { type: "loading" }
  | { type: "done"; data: WalletData }
  | { type: "error"; message: string };

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const SOLANA_RPC = "https://api.mainnet-beta.solana.com";
const TOKEN_PROGRAM_ID = "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA";
const MAX_TOKENS_DISPLAY = 25;
const MAX_TOKENS_PRICE_LOOKUP = 20;

const EXAMPLE_WALLETS = [
  {
    label: "Toly (Solana co-founder)",
    address: "toly.sol",
    resolved: "86xCnPeV69n6t3DnyGvkKobf9FdN2H9oiVDdRrbukVu",
  },
  {
    label: "Example Whale",
    address: "5tzFkiKscXHK5ZXCGbXZxdw7gTjjD1mBwuoFbhUvuAi9",
    resolved: "5tzFkiKscXHK5ZXCGbXZxdw7gTjjD1mBwuoFbhUvuAi9",
  },
];

/* ------------------------------------------------------------------ */
/*  RPC helper                                                         */
/* ------------------------------------------------------------------ */

async function rpcCall(method: string, params: unknown[]) {
  const res = await fetch(SOLANA_RPC, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ jsonrpc: "2.0", id: 1, method, params }),
  });
  if (!res.ok) throw new Error(`RPC error: ${res.status}`);
  const data = await res.json();
  if (data.error) throw new Error(data.error.message || "RPC error");
  return data.result;
}

/* ------------------------------------------------------------------ */
/*  Formatting helpers                                                 */
/* ------------------------------------------------------------------ */

function formatSol(value: number): string {
  if (value >= 1_000_000)
    return value.toLocaleString(undefined, { maximumFractionDigits: 2 });
  if (value >= 1)
    return value.toLocaleString(undefined, {
      minimumFractionDigits: 4,
      maximumFractionDigits: 4,
    });
  return value.toLocaleString(undefined, {
    minimumFractionDigits: 4,
    maximumFractionDigits: 9,
  });
}

function formatUsd(value: number | null | undefined): string {
  if (value === null || value === undefined) return "--";
  if (value >= 1_000_000_000) return `$${(value / 1_000_000_000).toFixed(2)}B`;
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(2)}M`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(2)}K`;
  if (value >= 0.01)
    return `$${value.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  if (value > 0) return `<$0.01`;
  return "$0.00";
}

function formatTokenAmount(amount: number): string {
  if (amount >= 1_000_000_000)
    return (amount / 1_000_000_000).toFixed(2) + "B";
  if (amount >= 1_000_000) return (amount / 1_000_000).toFixed(2) + "M";
  if (amount >= 1_000) return amount.toLocaleString(undefined, { maximumFractionDigits: 2 });
  if (amount >= 1) return amount.toLocaleString(undefined, { maximumFractionDigits: 4 });
  if (amount > 0) return amount.toLocaleString(undefined, { maximumFractionDigits: 6 });
  return "0";
}

function shortenAddress(addr: string): string {
  if (addr.length <= 12) return addr;
  return addr.slice(0, 6) + "..." + addr.slice(-4);
}

function shortenSig(sig: string): string {
  return sig.slice(0, 8) + "..." + sig.slice(-8);
}

function formatTime(blockTime: number | null): string {
  if (!blockTime) return "--";
  const date = new Date(blockTime * 1000);
  const now = Date.now();
  const diff = now - blockTime * 1000;
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString();
}

function isValidSolanaAddress(address: string): boolean {
  return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(address);
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function SolWalletPage() {
  const [addressInput, setAddressInput] = useState("");
  const [resolvedAddress, setResolvedAddress] = useState("");
  const [status, setStatus] = useState<PageStatus>({ type: "idle" });

  const runLookup = useCallback(async (walletAddress: string) => {
    setStatus({ type: "loading" });
    setResolvedAddress(walletAddress);

    try {
      // Step 1: Fetch SOL balance, token accounts, and recent transactions in parallel
      const [balanceResult, tokenResult, txResult, priceResult] =
        await Promise.allSettled([
          rpcCall("getBalance", [walletAddress]),
          rpcCall("getTokenAccountsByOwner", [
            walletAddress,
            { programId: TOKEN_PROGRAM_ID },
            { encoding: "jsonParsed" },
          ]),
          rpcCall("getSignaturesForAddress", [walletAddress, { limit: 10 }]),
          fetch(
            "https://api.jup.ag/price/v2?ids=So11111111111111111111111111111111111111112"
          ).then((r) => r.json()),
        ]);

      // Parse SOL balance
      let solBalance = 0;
      if (balanceResult.status === "fulfilled") {
        solBalance = balanceResult.value.value / 1e9;
      } else {
        throw new Error(
          "Could not fetch wallet balance. The address may be invalid."
        );
      }

      // Parse SOL price from Jupiter
      let solPrice: number | null = null;
      if (priceResult.status === "fulfilled") {
        const solData =
          priceResult.value?.data?.[
            "So11111111111111111111111111111111111111112"
          ];
        if (solData?.price) solPrice = parseFloat(solData.price);
      }

      // Fallback to CoinGecko if Jupiter didn't return SOL price
      if (solPrice === null) {
        try {
          const cgRes = await fetch(
            "https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd"
          );
          const cgData = await cgRes.json();
          solPrice = cgData?.solana?.usd ?? null;
        } catch {
          /* skip */
        }
      }

      // Parse token accounts
      let tokens: TokenAccount[] = [];
      if (tokenResult.status === "fulfilled" && tokenResult.value?.value) {
        tokens = tokenResult.value.value
          .map(
            (acct: {
              account: {
                data: {
                  parsed: {
                    info: {
                      mint: string;
                      tokenAmount: {
                        amount: string;
                        decimals: number;
                        uiAmount: number;
                      };
                    };
                  };
                };
              };
            }) => {
              const info = acct.account.data.parsed.info;
              return {
                mint: info.mint,
                amount: info.tokenAmount.amount,
                decimals: info.tokenAmount.decimals,
                uiAmount: info.tokenAmount.uiAmount,
              };
            }
          )
          .filter((t: TokenAccount) => t.amount !== "0" && t.uiAmount > 0)
          .sort((a: TokenAccount, b: TokenAccount) => b.uiAmount - a.uiAmount)
          .slice(0, MAX_TOKENS_DISPLAY);
      }

      // Parse transactions
      let transactions: Transaction[] = [];
      if (txResult.status === "fulfilled" && Array.isArray(txResult.value)) {
        transactions = txResult.value.map(
          (tx: {
            signature: string;
            slot: number;
            blockTime: number | null;
            err: unknown | null;
          }) => ({
            signature: tx.signature,
            slot: tx.slot,
            blockTime: tx.blockTime,
            err: tx.err,
          })
        );
      }

      // Step 2: Fetch token prices from Jupiter for top tokens
      const tokenPrices = new Map<string, TokenPriceInfo>();
      let totalTokenValueUsd = 0;

      if (tokens.length > 0) {
        const topMints = tokens
          .slice(0, MAX_TOKENS_PRICE_LOOKUP)
          .map((t) => t.mint);
        try {
          const jupRes = await fetch(
            `https://api.jup.ag/price/v2?ids=${topMints.join(",")}`
          );
          if (jupRes.ok) {
            const jupData = await jupRes.json();
            for (const mint of topMints) {
              const pData = jupData?.data?.[mint];
              if (pData) {
                const price = pData.price ? parseFloat(pData.price) : null;
                tokenPrices.set(mint, {
                  mint,
                  price,
                  symbol: null,
                  name: null,
                });
                if (price !== null) {
                  const token = tokens.find((t) => t.mint === mint);
                  if (token) {
                    totalTokenValueUsd += token.uiAmount * price;
                  }
                }
              }
            }
          }
        } catch {
          /* skip price lookup failure */
        }
      }

      setStatus({
        type: "done",
        data: {
          solBalance,
          solPrice,
          tokens,
          tokenPrices,
          transactions,
          totalTokenValueUsd,
        },
      });
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Failed to fetch wallet data. Check the address and try again.";
      setStatus({ type: "error", message });
    }
  }, []);

  const handleLookup = useCallback(
    (addressOverride?: string) => {
      const raw = (addressOverride ?? addressInput).trim();
      if (!raw) {
        setStatus({
          type: "error",
          message: "Please enter a Solana wallet address.",
        });
        return;
      }
      if (!isValidSolanaAddress(raw)) {
        setStatus({
          type: "error",
          message:
            "Invalid Solana address format. Please enter a valid base58 wallet address (32-44 characters).",
        });
        return;
      }
      runLookup(raw);
    },
    [addressInput, runLookup]
  );

  function handleExampleClick(resolved: string) {
    setAddressInput(resolved);
    handleLookup(resolved);
  }

  const isLoading = status.type === "loading";

  /* ---------------------------------------------------------------- */
  /*  Render                                                          */
  /* ---------------------------------------------------------------- */

  return (
    <>
      {/* Hero Section */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-3 leading-tight">
          Solana Wallet Tracker
        </h1>
        <p className="text-[var(--text-secondary)] text-base max-w-2xl">
          Free Solana portfolio checker. Paste any wallet address to see SOL
          balance, token holdings with USD values, and recent transaction
          history. No wallet connection required.
        </p>
      </div>

      {/* Search Input */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2 text-[var(--text-secondary)]">
          Wallet Address
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={addressInput}
            onChange={(e) => setAddressInput(e.target.value)}
            onKeyDown={(e) =>
              e.key === "Enter" && !isLoading && handleLookup()
            }
            placeholder="Enter a Solana wallet address..."
            className="flex-1"
            spellCheck={false}
            autoComplete="off"
          />
          <button
            onClick={() => handleLookup()}
            disabled={isLoading}
            className="px-6 py-2 rounded-lg bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white text-sm font-semibold transition-colors disabled:opacity-50 shrink-0 cursor-pointer"
          >
            {isLoading ? "Loading..." : "Track Wallet"}
          </button>
        </div>
        <p className="text-xs text-[var(--text-secondary)] mt-1.5">
          100% free -- no wallet connection required. Balance data from Solana
          RPC, prices from Jupiter.
        </p>
      </div>

      {/* Example Wallets */}
      <div className="mb-8 flex flex-wrap gap-2">
        <span className="text-xs text-[var(--text-secondary)] self-center mr-1">
          Examples:
        </span>
        {EXAMPLE_WALLETS.map((w) => (
          <button
            key={w.resolved}
            onClick={() => handleExampleClick(w.resolved)}
            disabled={isLoading}
            className="px-3 py-1.5 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border)] hover:border-[var(--accent)] text-sm transition-colors text-[var(--text-secondary)] hover:text-white disabled:opacity-50 cursor-pointer"
          >
            {w.label}
          </button>
        ))}
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] p-10 mb-6 text-center">
          <div className="inline-block w-8 h-8 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-sm text-[var(--text-secondary)]">
            Fetching wallet data from Solana mainnet...
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
      {status.type === "done" && (
        <WalletResults data={status.data} address={resolvedAddress} />
      )}

      {/* CTA - Wallet Alerts */}
      <div className="mt-8 mb-6 rounded-xl overflow-hidden">
        <div className="bg-gradient-to-r from-blue-900/60 to-purple-900/60 p-6 sm:p-8 border border-blue-700/40 rounded-xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 border border-green-500/30">
                  REAL-TIME TRACKING
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white mb-2">
                Track this wallet automatically with @solscanitbot
              </h3>
              <p className="text-gray-300 text-sm mb-1">
                Get instant Telegram alerts for any wallet&apos;s activity:
              </p>
              <ul className="text-gray-400 text-sm space-y-1 mb-4 list-none">
                <li className="flex items-center gap-2">
                  <span className="text-green-400 text-xs">&#9679;</span>
                  <span>
                    <strong className="text-gray-200">Buy/Sell Alerts</strong>{" "}
                    -- Know the instant a wallet makes a trade
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-400 text-xs">&#9679;</span>
                  <span>
                    <strong className="text-gray-200">Copy Trading</strong> --
                    Automatically mirror any wallet&apos;s trades
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-400 text-xs">&#9679;</span>
                  <span>
                    <strong className="text-gray-200">
                      Portfolio Monitoring
                    </strong>{" "}
                    -- Track holdings, PnL, and portfolio changes
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-400 text-xs">&#9679;</span>
                  <span>
                    <strong className="text-gray-200">Whale Detection</strong>{" "}
                    -- Spot large buys before the pump
                  </span>
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
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                </svg>
                Set Up Wallet Alerts
              </a>
              <p className="text-xs text-gray-500 mt-2 text-center">
                Free to start
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA - Copy Trading */}
      <div className="mb-8 rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] p-6">
        <h3 className="text-lg font-bold text-white mb-2">
          Copy Trade Any Wallet on Telegram
        </h3>
        <p className="text-gray-400 text-sm mb-4">
          Found a profitable wallet? Copy every trade automatically with
          @solscanitbot. Use <code className="text-[var(--accent)]">/copy</code>{" "}
          to set up copy trading in seconds -- buy when they buy, with custom
          position sizing and MEV protection.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
          {[
            { title: "Copy Trade", desc: "Mirror any wallet" },
            { title: "Buy / Sell", desc: "Instant swaps" },
            { title: "Sniper", desc: "New launches" },
            { title: "DCA", desc: "Auto-invest" },
          ].map((f) => (
            <div
              key={f.title}
              className="rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border)] p-3 text-center"
            >
              <div className="text-sm font-semibold text-white">{f.title}</div>
              <div className="text-xs text-[var(--text-secondary)]">
                {f.desc}
              </div>
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
          How to Track a Solana Wallet
        </h2>
        <p>
          This free Solana wallet tracker lets you check any wallet address on
          the Solana blockchain. Simply paste a wallet address above to see the
          SOL balance, SPL token holdings with live USD prices, and recent
          transaction history. All data is fetched directly from the Solana
          mainnet RPC and Jupiter price API -- nothing is stored on our servers.
        </p>

        <h3 className="text-base font-semibold text-white pt-2">
          What This Free Wallet Tracker Shows
        </h3>
        <ul className="list-disc list-inside space-y-1">
          <li>
            <strong>SOL Balance</strong> -- Native SOL holdings with live USD
            conversion
          </li>
          <li>
            <strong>Token Holdings</strong> -- All SPL tokens in the wallet with
            balances
          </li>
          <li>
            <strong>Token Prices</strong> -- Live USD prices for top tokens via
            Jupiter
          </li>
          <li>
            <strong>Portfolio Value</strong> -- Total estimated value of SOL +
            token holdings
          </li>
          <li>
            <strong>Recent Transactions</strong> -- Last 10 transactions with
            status and timestamps
          </li>
        </ul>

        <h3 className="text-base font-semibold text-white pt-2">
          Why Track Solana Wallets?
        </h3>
        <p>
          Tracking Solana wallets is essential for copy trading, whale watching,
          and monitoring your own portfolio. By watching what successful traders
          buy and sell, you can spot opportunities before the crowd. Use this
          tool for quick lookups, and set up real-time alerts with{" "}
          <a
            href="https://t.me/solscanitbot"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--accent)] hover:text-[var(--accent-hover)] underline"
          >
            @solscanitbot on Telegram
          </a>{" "}
          for automated monitoring and copy trading.
        </p>

        <h3 className="text-base font-semibold text-white pt-2">
          Solana Wallet Tracking Tips
        </h3>
        <ul className="list-disc list-inside space-y-1">
          <li>
            Look for wallets with consistent profits across multiple tokens
          </li>
          <li>
            Check if a wallet&apos;s recent activity aligns with market trends
          </li>
          <li>
            Watch for large SOL balances -- whales often signal upcoming moves
          </li>
          <li>
            Monitor wallet activity before and after major token launches
          </li>
          <li>
            Use copy trading to automatically follow profitable wallets via{" "}
            <code className="text-[var(--accent)]">/copy</code> on @solscanitbot
          </li>
        </ul>

        <h3 className="text-base font-semibold text-white pt-2">
          Frequently Asked Questions
        </h3>
        <div className="space-y-3">
          <div>
            <p className="font-medium text-gray-300">
              Is this Solana wallet tracker free?
            </p>
            <p>
              Yes, checking any wallet&apos;s balance, token holdings, and
              recent transactions is completely free. No wallet connection,
              signup, or payment required. For real-time alerts and copy trading,
              use the free Telegram bot @solscanitbot.
            </p>
          </div>
          <div>
            <p className="font-medium text-gray-300">
              How do I check my Solana wallet balance?
            </p>
            <p>
              Paste your Solana wallet address (the base58 public key) into the
              search box above and click &quot;Track Wallet&quot;. You&apos;ll
              instantly see your SOL balance, all token holdings, and recent
              transaction history. No wallet connection needed.
            </p>
          </div>
          <div>
            <p className="font-medium text-gray-300">
              Can I track any Solana wallet?
            </p>
            <p>
              Yes, all Solana wallet data is public on the blockchain. You can
              look up any wallet address to see its SOL balance, token holdings,
              and transactions. This is how whale tracking and copy trading work
              -- everything is transparent on-chain.
            </p>
          </div>
          <div>
            <p className="font-medium text-gray-300">
              How do I copy trade a Solana wallet?
            </p>
            <p>
              After finding a profitable wallet here, use{" "}
              <code className="text-[var(--accent)]">/copy</code> in{" "}
              <a
                href="https://t.me/solscanitbot"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--accent)] hover:text-[var(--accent-hover)] underline"
              >
                @solscanitbot
              </a>{" "}
              to automatically copy their trades. Set your position size, and
              the bot will buy when they buy -- with MEV protection and
              customizable settings.
            </p>
          </div>
          <div>
            <p className="font-medium text-gray-300">
              Where do token prices come from?
            </p>
            <p>
              Token prices are fetched from the Jupiter Price API v2, which
              aggregates prices across all major Solana DEXs. SOL/USD price uses
              Jupiter with CoinGecko as a fallback. Prices are fetched in
              real-time when you look up a wallet.
            </p>
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
            name: "Solana Wallet Tracker",
            description:
              "Free Solana wallet tracker and portfolio checker. Check any wallet's SOL balance, token holdings, and portfolio value.",
            url: "https://devtools.run/sol-wallet",
            applicationCategory: "FinanceApplication",
            operatingSystem: "Any",
            offers: {
              "@type": "Offer",
              price: "0",
              priceCurrency: "USD",
            },
            creator: {
              "@type": "Organization",
              name: "DevTools.run",
            },
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              {
                "@type": "Question",
                name: "Is this Solana wallet tracker free?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Yes, checking any wallet's balance, token holdings, and recent transactions is completely free. No wallet connection required. For real-time alerts and copy trading, use @solscanitbot on Telegram.",
                },
              },
              {
                "@type": "Question",
                name: "How do I check my Solana wallet balance?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Paste your Solana wallet address into the search box and click Track Wallet. You'll see your SOL balance, token holdings, and transaction history instantly.",
                },
              },
              {
                "@type": "Question",
                name: "Can I track any Solana wallet?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Yes, all Solana wallet data is public on the blockchain. You can look up any address to see SOL balance, tokens, and transactions.",
                },
              },
              {
                "@type": "Question",
                name: "How do I copy trade a Solana wallet?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Use /copy in @solscanitbot on Telegram to automatically mirror any wallet's trades with custom position sizing and MEV protection.",
                },
              },
            ],
          }),
        }}
      />
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Results sub-component                                              */
/* ------------------------------------------------------------------ */

function WalletResults({
  data,
  address,
}: {
  data: WalletData;
  address: string;
}) {
  const {
    solBalance,
    solPrice,
    tokens,
    tokenPrices,
    transactions,
    totalTokenValueUsd,
  } = data;

  const solValueUsd = solPrice !== null ? solBalance * solPrice : null;
  const totalPortfolioUsd =
    solValueUsd !== null ? solValueUsd + totalTokenValueUsd : null;

  const pricedTokenCount = Array.from(tokenPrices.values()).filter(
    (p) => p.price !== null
  ).length;
  const unpricedTokenCount = tokens.length - pricedTokenCount;

  return (
    <div className="space-y-6 mb-6">
      {/* Portfolio Overview Card */}
      <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] p-6">
        <div className="flex items-center gap-2 mb-4">
          <h2 className="text-lg font-semibold text-white">
            Portfolio Overview
          </h2>
          <a
            href={`https://solscan.io/account/${address}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors ml-auto"
          >
            View on Solscan &rarr;
          </a>
        </div>

        {/* Wallet Address */}
        <div className="mb-4 pb-4 border-b border-[var(--border)]">
          <span className="text-xs text-[var(--text-secondary)]">
            Wallet Address:
          </span>
          <code className="block text-sm font-mono text-[var(--accent)] break-all select-all mt-1">
            {address}
          </code>
        </div>

        {/* Total Portfolio Value */}
        {totalPortfolioUsd !== null && (
          <div className="mb-4 pb-4 border-b border-[var(--border)]">
            <span className="text-xs text-[var(--text-secondary)]">
              Estimated Portfolio Value
            </span>
            <div className="text-3xl font-bold text-white mt-1">
              {formatUsd(totalPortfolioUsd)}
            </div>
            {unpricedTokenCount > 0 && (
              <p className="text-xs text-[var(--text-secondary)] mt-1">
                * Excludes {unpricedTokenCount} token
                {unpricedTokenCount !== 1 ? "s" : ""} without available pricing
              </p>
            )}
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border)] p-3">
            <div className="text-xs text-[var(--text-secondary)] mb-1">
              SOL Balance
            </div>
            <div className="text-sm font-mono font-semibold text-white">
              {formatSol(solBalance)} SOL
            </div>
          </div>
          <div className="rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border)] p-3">
            <div className="text-xs text-[var(--text-secondary)] mb-1">
              SOL Value
            </div>
            <div className="text-sm font-mono font-semibold text-white">
              {formatUsd(solValueUsd)}
            </div>
          </div>
          <div className="rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border)] p-3">
            <div className="text-xs text-[var(--text-secondary)] mb-1">
              Token Holdings
            </div>
            <div className="text-sm font-mono font-semibold text-white">
              {tokens.length} token{tokens.length !== 1 ? "s" : ""}
            </div>
          </div>
          <div className="rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border)] p-3">
            <div className="text-xs text-[var(--text-secondary)] mb-1">
              Token Value
            </div>
            <div className="text-sm font-mono font-semibold text-white">
              {totalTokenValueUsd > 0 ? formatUsd(totalTokenValueUsd) : "--"}
            </div>
          </div>
        </div>

        {/* SOL Price */}
        {solPrice !== null && (
          <div className="mt-3 text-xs text-[var(--text-secondary)]">
            SOL Price: $
            {solPrice.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </div>
        )}
      </div>

      {/* Token Holdings */}
      <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-white">
            Token Holdings ({tokens.length})
          </h3>
          {tokens.length > 0 && (
            <span className="text-xs text-[var(--text-secondary)]">
              Prices via Jupiter
            </span>
          )}
        </div>
        {tokens.length === 0 ? (
          <p className="text-sm text-[var(--text-secondary)]">
            No SPL token accounts found in this wallet.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-[var(--text-secondary)] border-b border-[var(--border)]">
                  <th className="pb-2 pr-4">Token</th>
                  <th className="pb-2 pr-4 text-right">Balance</th>
                  <th className="pb-2 pr-4 text-right">Price</th>
                  <th className="pb-2 text-right">Value</th>
                </tr>
              </thead>
              <tbody>
                {tokens.map((token) => {
                  const priceInfo = tokenPrices.get(token.mint);
                  const price = priceInfo?.price ?? null;
                  const value =
                    price !== null ? token.uiAmount * price : null;

                  return (
                    <tr
                      key={token.mint}
                      className="border-b border-[var(--border)] last:border-b-0"
                    >
                      <td className="py-2.5 pr-4">
                        <a
                          href={`https://solscan.io/token/${token.mint}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[var(--accent)] hover:underline font-mono text-xs"
                          title={token.mint}
                        >
                          {shortenAddress(token.mint)}
                        </a>
                      </td>
                      <td className="py-2.5 pr-4 text-right font-mono text-white">
                        {formatTokenAmount(token.uiAmount)}
                      </td>
                      <td className="py-2.5 pr-4 text-right font-mono text-[var(--text-secondary)]">
                        {price !== null ? formatTokenPrice(price) : "--"}
                      </td>
                      <td className="py-2.5 text-right font-mono text-white">
                        {value !== null ? formatUsd(value) : "--"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Gated features - full portfolio analysis */}
        {tokens.length > 0 && (
          <div className="mt-4 pt-4 border-t border-[var(--border)]">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm text-yellow-500">&#128274;</span>
              <span className="text-sm font-semibold text-white">
                Full Portfolio Analysis on Telegram
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
              {[
                "Token names and symbols for all holdings",
                "Profit & loss per token",
                "Entry prices and trade history",
                "Real-time portfolio alerts",
                "Token safety scores",
                "Wallet PnL tracking over time",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-2 text-xs text-[var(--text-secondary)]"
                >
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
              Full Analysis on @solscanitbot
            </a>
          </div>
        )}
      </div>

      {/* Recent Transactions */}
      <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-white">
            Recent Transactions
          </h3>
          {transactions.length > 0 && (
            <span className="text-xs text-[var(--text-secondary)]">
              Last {transactions.length}
            </span>
          )}
        </div>
        {transactions.length === 0 ? (
          <p className="text-sm text-[var(--text-secondary)]">
            No recent transactions found.
          </p>
        ) : (
          <>
            {/* Summary bar */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border)] p-3 text-center">
                <div className="text-xs text-[var(--text-secondary)] mb-1">
                  Total
                </div>
                <div className="text-sm font-semibold text-white">
                  {transactions.length}
                </div>
              </div>
              <div className="rounded-lg bg-[var(--bg-tertiary)] border border-green-500/20 p-3 text-center">
                <div className="text-xs text-green-400 mb-1">Successful</div>
                <div className="text-sm font-semibold text-green-400">
                  {transactions.filter((t) => !t.err).length}
                </div>
              </div>
              <div className="rounded-lg bg-[var(--bg-tertiary)] border border-red-500/20 p-3 text-center">
                <div className="text-xs text-red-400 mb-1">Failed</div>
                <div className="text-sm font-semibold text-red-400">
                  {transactions.filter((t) => t.err).length}
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs text-[var(--text-secondary)] border-b border-[var(--border)]">
                    <th className="pb-2 pr-4">Signature</th>
                    <th className="pb-2 pr-4">Time</th>
                    <th className="pb-2 pr-4 text-right">Slot</th>
                    <th className="pb-2 text-right">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((tx) => (
                    <tr
                      key={tx.signature}
                      className="border-b border-[var(--border)] last:border-b-0"
                    >
                      <td className="py-2.5 pr-4 font-mono">
                        <a
                          href={`https://solscan.io/tx/${tx.signature}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[var(--accent)] hover:underline text-xs"
                          title={tx.signature}
                        >
                          {shortenSig(tx.signature)}
                        </a>
                      </td>
                      <td className="py-2.5 pr-4 text-[var(--text-secondary)] whitespace-nowrap text-xs">
                        {formatTime(tx.blockTime)}
                      </td>
                      <td className="py-2.5 pr-4 text-right text-[var(--text-secondary)] font-mono text-xs">
                        {tx.slot.toLocaleString()}
                      </td>
                      <td className="py-2.5 text-right">
                        {tx.err ? (
                          <span className="text-xs font-medium text-red-400 bg-red-500/10 px-2 py-0.5 rounded">
                            Failed
                          </span>
                        ) : (
                          <span className="text-xs font-medium text-green-400 bg-green-500/10 px-2 py-0.5 rounded">
                            Success
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-3 pt-3 border-t border-[var(--border)] text-center">
              <a
                href={`https://solscan.io/account/${address}#txs`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-[var(--accent)] hover:text-[var(--accent-hover)] transition-colors"
              >
                View full transaction history on Solscan &rarr;
              </a>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Price formatting helper                                            */
/* ------------------------------------------------------------------ */

function formatTokenPrice(price: number): string {
  if (price >= 1)
    return `$${price.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 4,
    })}`;
  if (price >= 0.01) return `$${price.toFixed(4)}`;
  if (price >= 0.0001) return `$${price.toFixed(6)}`;
  if (price >= 0.00000001) return `$${price.toFixed(10)}`;
  const str = price.toFixed(20);
  const match = str.match(/^0\.0*[1-9]/);
  if (match) {
    const zeros = match[0].length - 2;
    return `$0.0{${zeros}}${str.slice(match[0].length - 1, match[0].length + 3)}`;
  }
  return `$${price.toExponential(4)}`;
}
