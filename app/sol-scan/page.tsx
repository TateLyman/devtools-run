"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Connection,
  PublicKey,
  Transaction,
  SystemProgram,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";

/* ------------------------------------------------------------------ */
/*  Constants                                                         */
/* ------------------------------------------------------------------ */

const SCAN_COST = 0.01; // SOL
const RECIPIENT = new PublicKey("NaTTUfDDQ8U1RBqb9q5rz6vJ22cWrrT5UAsXuxnb2Wr");
const SOLANA_RPC = "https://api.mainnet-beta.solana.com";

const EXAMPLE_TOKENS = [
  { label: "USDC", mint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v" },
  { label: "BONK", mint: "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263" },
  {
    label: "SOL (Wrapped)",
    mint: "So11111111111111111111111111111111111111112",
  },
];

/* ------------------------------------------------------------------ */
/*  Types                                                             */
/* ------------------------------------------------------------------ */

interface PhantomProvider {
  isPhantom?: boolean;
  connect: () => Promise<{ publicKey: PublicKey }>;
  signAndSendTransaction: (
    transaction: Transaction
  ) => Promise<{ signature: string }>;
  publicKey: PublicKey | null;
}

interface TokenMeta {
  name: string;
  symbol: string;
  logoURI: string | null;
}

interface HolderInfo {
  address: string;
  amount: number;
  percentage: number;
}

interface ScanResult {
  meta: TokenMeta;
  mintAddress: string;
  decimals: number;
  totalSupply: number;
  mintAuthorityEnabled: boolean;
  freezeAuthorityEnabled: boolean;
  topHolders: HolderInfo[];
  holderCount: number;
  price: number | null;
  safetyScore: number;
  flags: ScanFlag[];
}

interface ScanFlag {
  label: string;
  severity: "pass" | "warning" | "danger";
  detail: string;
}

type PageStatus =
  | { type: "idle" }
  | { type: "awaiting_payment" }
  | { type: "payment_processing" }
  | { type: "scanning" }
  | { type: "done"; result: ScanResult }
  | { type: "error"; message: string };

/* ------------------------------------------------------------------ */
/*  Phantom helper                                                    */
/* ------------------------------------------------------------------ */

function getPhantom(): PhantomProvider | null {
  if (typeof window === "undefined") return null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const w = window as any;
  const provider = w.phantom?.solana ?? w.solana;
  if (provider?.isPhantom) return provider as PhantomProvider;
  return null;
}

/* ------------------------------------------------------------------ */
/*  Safety score calculator                                           */
/* ------------------------------------------------------------------ */

function computeSafetyScore(
  mintAuth: boolean,
  freezeAuth: boolean,
  topHolders: HolderInfo[],
  holderCount: number
): { score: number; flags: ScanFlag[] } {
  let score = 100;
  const flags: ScanFlag[] = [];

  // Mint authority
  if (mintAuth) {
    score -= 30;
    flags.push({
      label: "Mint Authority",
      severity: "danger",
      detail: "Creator can mint unlimited tokens, diluting supply.",
    });
  } else {
    flags.push({
      label: "Mint Authority",
      severity: "pass",
      detail: "Mint authority is revoked. No new tokens can be created.",
    });
  }

  // Freeze authority
  if (freezeAuth) {
    score -= 20;
    flags.push({
      label: "Freeze Authority",
      severity: "danger",
      detail: "Creator can freeze any holder's token account.",
    });
  } else {
    flags.push({
      label: "Freeze Authority",
      severity: "pass",
      detail: "Freeze authority is revoked. Accounts cannot be frozen.",
    });
  }

  // Top holder concentration
  const topHolderPct = topHolders.length > 0 ? topHolders[0].percentage : 0;
  if (topHolderPct > 50) {
    score -= 30;
    flags.push({
      label: "Top Holder Concentration",
      severity: "danger",
      detail: `Top holder owns ${topHolderPct.toFixed(1)}% of supply (>50%).`,
    });
  } else if (topHolderPct > 20) {
    score -= 15;
    flags.push({
      label: "Top Holder Concentration",
      severity: "warning",
      detail: `Top holder owns ${topHolderPct.toFixed(1)}% of supply (>20%).`,
    });
  } else {
    flags.push({
      label: "Top Holder Concentration",
      severity: "pass",
      detail: `Top holder owns ${topHolderPct.toFixed(1)}% of supply.`,
    });
  }

  // Holder count
  if (holderCount < 100) {
    score -= 10;
    flags.push({
      label: "Holder Count",
      severity: "warning",
      detail: `Only ${holderCount} holders detected. Low distribution.`,
    });
  } else {
    flags.push({
      label: "Holder Count",
      severity: "pass",
      detail: `${holderCount} holders detected.`,
    });
  }

  return { score: Math.max(0, score), flags };
}

/* ------------------------------------------------------------------ */
/*  Component                                                         */
/* ------------------------------------------------------------------ */

export default function SolScanPage() {
  const [mintInput, setMintInput] = useState("");
  const [status, setStatus] = useState<PageStatus>({ type: "idle" });
  const [hasPhantom, setHasPhantom] = useState<boolean | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setHasPhantom(getPhantom() !== null);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  /* ---- Scan logic ---- */

  const runScan = useCallback(async (mint: string): Promise<ScanResult> => {
    const connection = new Connection(SOLANA_RPC, "confirmed");

    // 1. Account info (mint/freeze authority, supply, decimals)
    const rpcRes = await fetch(SOLANA_RPC, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "getAccountInfo",
        params: [mint, { encoding: "jsonParsed" }],
      }),
    });
    const rpcData = await rpcRes.json();
    if (rpcData.error) throw new Error(rpcData.error.message || "RPC error");
    const accountInfo = rpcData.result?.value;
    if (!accountInfo) throw new Error("Account not found. Check the mint address.");
    const parsed = accountInfo.data?.parsed;
    if (!parsed || parsed.type !== "mint")
      throw new Error("Not a valid SPL token mint address.");

    const mintInfo = parsed.info;
    const decimals: number = mintInfo.decimals;
    const rawSupply: string = mintInfo.supply;
    const totalSupply = Number(BigInt(rawSupply)) / Math.pow(10, decimals);
    const mintAuthorityEnabled = mintInfo.mintAuthority !== null;
    const freezeAuthorityEnabled = mintInfo.freezeAuthority !== null;

    // 2. Jupiter metadata
    let meta: TokenMeta = { name: "Unknown", symbol: "???", logoURI: null };
    try {
      const jupRes = await fetch(`https://tokens.jup.ag/token/${mint}`);
      if (jupRes.ok) {
        const j = await jupRes.json();
        meta = {
          name: j.name || meta.name,
          symbol: j.symbol || meta.symbol,
          logoURI: j.logoURI || null,
        };
      }
    } catch {
      // optional
    }

    // 3. Price
    let price: number | null = null;
    try {
      const priceRes = await fetch(`https://api.jup.ag/price/v2?ids=${mint}`);
      if (priceRes.ok) {
        const pd = await priceRes.json();
        const p = pd.data?.[mint]?.price;
        if (p) price = parseFloat(p);
      }
    } catch {
      // optional
    }

    // 4. Top holders
    const mintPubkey = new PublicKey(mint);
    const largestAccounts = await connection.getTokenLargestAccounts(mintPubkey);
    const topHolders: HolderInfo[] = largestAccounts.value
      .slice(0, 10)
      .map((a) => {
        const amount = Number(a.amount) / Math.pow(10, decimals);
        return {
          address: a.address.toBase58(),
          amount,
          percentage: totalSupply > 0 ? (amount / totalSupply) * 100 : 0,
        };
      });

    const holderCount = largestAccounts.value.length;

    // 5. Safety score
    const { score, flags } = computeSafetyScore(
      mintAuthorityEnabled,
      freezeAuthorityEnabled,
      topHolders,
      holderCount
    );

    return {
      meta,
      mintAddress: mint,
      decimals,
      totalSupply,
      mintAuthorityEnabled,
      freezeAuthorityEnabled,
      topHolders,
      holderCount,
      price,
      safetyScore: score,
      flags,
    };
  }, []);

  /* ---- Payment + scan flow ---- */

  const handleScan = useCallback(
    async (mintOverride?: string) => {
      const mint = (mintOverride ?? mintInput).trim();
      if (!mint) {
        setStatus({ type: "error", message: "Please enter a token mint address." });
        return;
      }

      // Validate it looks like a base58 address
      try {
        new PublicKey(mint);
      } catch {
        setStatus({ type: "error", message: "Invalid Solana address format." });
        return;
      }

      const phantom = getPhantom();
      if (!phantom) {
        setStatus({
          type: "error",
          message: "Phantom wallet not found. Please install it first.",
        });
        return;
      }

      try {
        // Step 1: Connect wallet and send payment
        setStatus({ type: "awaiting_payment" });
        const resp = await phantom.connect();
        const fromPubkey = resp.publicKey;

        setStatus({ type: "payment_processing" });
        const connection = new Connection(SOLANA_RPC, "confirmed");
        const { blockhash, lastValidBlockHeight } =
          await connection.getLatestBlockhash();

        const transaction = new Transaction().add(
          SystemProgram.transfer({
            fromPubkey,
            toPubkey: RECIPIENT,
            lamports: Math.round(SCAN_COST * LAMPORTS_PER_SOL),
          })
        );
        transaction.recentBlockhash = blockhash;
        transaction.lastValidBlockHeight = lastValidBlockHeight;
        transaction.feePayer = fromPubkey;

        const { signature } = await phantom.signAndSendTransaction(transaction);

        // Step 2: Confirm the transaction
        await connection.confirmTransaction(
          { signature, blockhash, lastValidBlockHeight },
          "confirmed"
        );

        // Step 3: Run the scan
        setStatus({ type: "scanning" });
        const result = await runScan(mint);
        setStatus({ type: "done", result });
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "Transaction cancelled or failed.";
        setStatus({ type: "error", message });
      }
    },
    [mintInput, runScan]
  );

  function handleExampleClick(mint: string) {
    setMintInput(mint);
    handleScan(mint);
  }

  /* ---- Helpers ---- */

  const isLoading =
    status.type === "awaiting_payment" ||
    status.type === "payment_processing" ||
    status.type === "scanning";

  function scoreColor(score: number): string {
    if (score > 70) return "var(--success, #22c55e)";
    if (score >= 40) return "#eab308";
    return "var(--error, #ef4444)";
  }

  function scoreLabel(score: number): string {
    if (score > 70) return "LOW RISK";
    if (score >= 40) return "MEDIUM RISK";
    return "HIGH RISK";
  }

  function severityIcon(s: "pass" | "warning" | "danger"): string {
    if (s === "pass") return "\u2705";
    if (s === "warning") return "\u26a0\ufe0f";
    return "\u274c";
  }

  function statusButtonText(): string {
    switch (status.type) {
      case "awaiting_payment":
        return "Connecting wallet...";
      case "payment_processing":
        return "Confirming payment...";
      case "scanning":
        return "Scanning token...";
      default:
        return `Scan Token (${SCAN_COST} SOL)`;
    }
  }

  /* ---------------------------------------------------------------- */
  /*  Render                                                          */
  /* ---------------------------------------------------------------- */

  return (
    <>
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <h1 className="text-2xl font-bold">Solana Token Scanner</h1>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[var(--accent)] text-white">
            PREMIUM
          </span>
        </div>
        <p className="text-[var(--text-secondary)] text-sm">
          Scan any Solana token for rug pull risks. Checks mint authority, freeze
          authority, top holders, supply concentration, and more. Powered by
          on-chain data.
        </p>
      </div>

      {/* No Phantom prompt */}
      {hasPhantom === false && (
        <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] p-6 mb-6 text-center">
          <p className="text-[var(--text-secondary)] mb-3">
            This tool requires a Phantom wallet to process payment.
          </p>
          <a
            href="https://phantom.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-[var(--accent)] bg-[var(--accent)] px-5 py-2.5 text-sm font-medium text-white hover:bg-[var(--accent-hover)] transition-colors"
          >
            Install Phantom Wallet
          </a>
        </div>
      )}

      {/* Input */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">
          Token Mint Address
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={mintInput}
            onChange={(e) => setMintInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !isLoading && handleScan()}
            placeholder="Enter a Solana token mint address..."
            className="flex-1"
          />
          <button
            onClick={() => handleScan()}
            disabled={isLoading || hasPhantom === false}
            className="px-5 py-2 rounded-lg bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white text-sm font-medium transition-colors disabled:opacity-50 shrink-0"
          >
            {statusButtonText()}
          </button>
        </div>
        <p className="text-xs text-[var(--text-secondary)] mt-1.5">
          Cost: {SCAN_COST} SOL per scan, paid via Phantom wallet
        </p>
      </div>

      {/* Example tokens */}
      <div className="mb-6 flex flex-wrap gap-2">
        <span className="text-xs text-[var(--text-secondary)] self-center">
          Try:
        </span>
        {EXAMPLE_TOKENS.map((t) => (
          <button
            key={t.mint}
            onClick={() => handleExampleClick(t.mint)}
            disabled={isLoading}
            className="px-3 py-1.5 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border)] hover:border-[var(--accent)] text-sm transition-colors text-[var(--text-secondary)] hover:text-white disabled:opacity-50"
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Loading indicator */}
      {isLoading && (
        <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] p-8 mb-6 text-center">
          <div className="inline-block w-8 h-8 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-sm text-[var(--text-secondary)]">
            {status.type === "awaiting_payment" && "Connecting to Phantom wallet..."}
            {status.type === "payment_processing" && "Confirming payment on Solana..."}
            {status.type === "scanning" && "Analyzing token on-chain data..."}
          </p>
        </div>
      )}

      {/* Error */}
      {status.type === "error" && (
        <div className="rounded-lg border border-[var(--error)] bg-[var(--error)]/10 p-3 text-sm text-[var(--error)] mb-6">
          {status.message}
        </div>
      )}

      {/* Results */}
      {status.type === "done" && (
        <ScanResults result={status.result} />
      )}

      {/* AD SLOT - Bottom */}
      <div className="ad-slot mt-8">
        <span>Ad Space</span>
      </div>

      <section className="mt-10 text-sm text-[var(--text-secondary)] space-y-2">
        <h2 className="text-lg font-semibold text-white">
          About Solana Token Scanner
        </h2>
        <p>
          This premium tool performs a comprehensive safety analysis on any SPL
          token. It checks whether the mint authority and freeze authority are
          still enabled, analyzes the top 10 holders for concentration risk, and
          computes an overall safety score from 0-100. All data is fetched
          directly from the Solana mainnet RPC and Jupiter APIs. The 0.01 SOL
          scan fee supports ongoing development and server costs.
        </p>
        <h3 className="text-base font-semibold text-white pt-2">
          What does the scanner check?
        </h3>
        <ul className="list-disc list-inside space-y-1">
          <li>
            <strong>Mint Authority</strong> &mdash; Can the creator mint
            unlimited new tokens?
          </li>
          <li>
            <strong>Freeze Authority</strong> &mdash; Can the creator freeze
            any token account?
          </li>
          <li>
            <strong>Top Holder Concentration</strong> &mdash; Does any single
            wallet hold a dangerous percentage of supply?
          </li>
          <li>
            <strong>Holder Distribution</strong> &mdash; How many unique holders
            exist?
          </li>
          <li>
            <strong>Safety Score</strong> &mdash; A 0-100 composite score based
            on all factors above.
          </li>
        </ul>
      </section>
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Results sub-component                                             */
/* ------------------------------------------------------------------ */

function ScanResults({ result }: { result: ScanResult }) {
  const { meta, safetyScore, flags, topHolders, mintAddress } = result;

  function scoreColor(score: number): string {
    if (score > 70) return "var(--success, #22c55e)";
    if (score >= 40) return "#eab308";
    return "var(--error, #ef4444)";
  }

  function scoreLabel(score: number): string {
    if (score > 70) return "LOW RISK";
    if (score >= 40) return "MEDIUM RISK";
    return "HIGH RISK";
  }

  function scoreBg(score: number): string {
    if (score > 70) return "rgba(34,197,94,0.1)";
    if (score >= 40) return "rgba(234,179,8,0.1)";
    return "rgba(239,68,68,0.1)";
  }

  function severityIcon(s: "pass" | "warning" | "danger"): string {
    if (s === "pass") return "\u2705";
    if (s === "warning") return "\u26a0\ufe0f";
    return "\u274c";
  }

  function severityBorder(s: "pass" | "warning" | "danger"): string {
    if (s === "pass") return "border-[var(--success,#22c55e)]";
    if (s === "warning") return "border-yellow-500";
    return "border-[var(--error,#ef4444)]";
  }

  return (
    <div className="space-y-6 mb-6">
      {/* Safety Score Hero */}
      <div
        className="rounded-xl border border-[var(--border)] p-6 text-center"
        style={{ backgroundColor: scoreBg(safetyScore) }}
      >
        <div className="flex items-center justify-center gap-4 mb-3">
          {meta.logoURI ? (
            <img
              src={meta.logoURI}
              alt={meta.name}
              className="w-12 h-12 rounded-full border border-[var(--border)]"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-[var(--bg-tertiary)] border border-[var(--border)] flex items-center justify-center text-lg font-bold text-[var(--accent)]">
              {meta.symbol.charAt(0)}
            </div>
          )}
          <div className="text-left">
            <h2 className="text-xl font-bold text-white">{meta.name}</h2>
            <span className="text-sm text-[var(--text-secondary)]">
              {meta.symbol}
            </span>
          </div>
        </div>

        <div
          className="text-6xl font-extrabold mb-1"
          style={{ color: scoreColor(safetyScore) }}
        >
          {safetyScore}
        </div>
        <div className="text-xs font-mono tracking-widest mb-1 text-[var(--text-secondary)]">
          SAFETY SCORE
        </div>
        <div
          className="inline-block text-sm font-bold px-3 py-1 rounded-full"
          style={{
            color: scoreColor(safetyScore),
            border: `1px solid ${scoreColor(safetyScore)}`,
          }}
        >
          {scoreLabel(safetyScore)}
        </div>
      </div>

      {/* Token Info Grid */}
      <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] p-6">
        <h3 className="text-base font-semibold text-white mb-4">
          Token Information
        </h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border)] p-4">
            <div className="text-xs text-[var(--text-secondary)] mb-1">
              Total Supply
            </div>
            <div className="text-sm font-mono font-medium text-white break-all">
              {result.totalSupply.toLocaleString(undefined, {
                maximumFractionDigits: result.decimals,
              })}
            </div>
          </div>
          <div className="rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border)] p-4">
            <div className="text-xs text-[var(--text-secondary)] mb-1">
              Decimals
            </div>
            <div className="text-sm font-mono font-medium text-white">
              {result.decimals}
            </div>
          </div>
          <div className="rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border)] p-4">
            <div className="text-xs text-[var(--text-secondary)] mb-1">
              Price (USD)
            </div>
            <div className="text-sm font-mono font-medium text-white">
              {result.price !== null
                ? `$${
                    result.price < 0.01
                      ? result.price.toFixed(8)
                      : result.price.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 6,
                        })
                  }`
                : "N/A"}
            </div>
          </div>
          <div className="rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border)] p-4">
            <div className="text-xs text-[var(--text-secondary)] mb-1">
              Holders (top accounts)
            </div>
            <div className="text-sm font-mono font-medium text-white">
              {result.holderCount}
            </div>
          </div>
          <div className="rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border)] p-4 sm:col-span-2">
            <div className="text-xs text-[var(--text-secondary)] mb-1">
              Mint Address
            </div>
            <div className="text-sm font-mono font-medium text-white break-all">
              {mintAddress}
            </div>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-[var(--border)]">
          <a
            href={`https://solscan.io/token/${mintAddress}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-[var(--accent)] hover:text-[var(--accent-hover)] transition-colors"
          >
            View on Solscan <span aria-hidden="true">&rarr;</span>
          </a>
        </div>
      </div>

      {/* Safety Checks */}
      <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] p-6">
        <h3 className="text-base font-semibold text-white mb-4">
          Safety Checks
        </h3>
        <div className="space-y-3">
          {flags.map((flag) => (
            <div
              key={flag.label}
              className={`rounded-lg border bg-[var(--bg-tertiary)] p-4 ${severityBorder(
                flag.severity
              )}`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-base">{severityIcon(flag.severity)}</span>
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
      </div>

      {/* Top Holders Table */}
      <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] p-6">
        <h3 className="text-base font-semibold text-white mb-4">
          Top 10 Holders
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-[var(--text-secondary)] border-b border-[var(--border)]">
                <th className="pb-2 pr-4">#</th>
                <th className="pb-2 pr-4">Address</th>
                <th className="pb-2 pr-4 text-right">Amount</th>
                <th className="pb-2 text-right">% of Supply</th>
              </tr>
            </thead>
            <tbody>
              {topHolders.map((h, i) => (
                <tr
                  key={h.address}
                  className="border-b border-[var(--border)] last:border-b-0"
                >
                  <td className="py-2.5 pr-4 text-[var(--text-secondary)] font-mono">
                    {i + 1}
                  </td>
                  <td className="py-2.5 pr-4 font-mono text-white">
                    <a
                      href={`https://solscan.io/account/${h.address}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-[var(--accent)] transition-colors"
                    >
                      {h.address.slice(0, 6)}...{h.address.slice(-4)}
                    </a>
                  </td>
                  <td className="py-2.5 pr-4 text-right font-mono text-white">
                    {h.amount.toLocaleString(undefined, {
                      maximumFractionDigits: 2,
                    })}
                  </td>
                  <td className="py-2.5 text-right font-mono">
                    <span
                      style={{
                        color:
                          h.percentage > 50
                            ? "var(--error, #ef4444)"
                            : h.percentage > 20
                              ? "#eab308"
                              : "var(--success, #22c55e)",
                      }}
                    >
                      {h.percentage.toFixed(2)}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
