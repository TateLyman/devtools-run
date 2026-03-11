"use client";

import { useState } from "react";

interface TokenData {
  name: string;
  symbol: string;
  logoURI: string | null;
  decimals: number;
  supply: string;
  price: number | null;
  mintAddress: string;
}

const EXAMPLE_TOKENS = [
  {
    label: "SOL (Wrapped)",
    mint: "So11111111111111111111111111111111111111112",
  },
  {
    label: "USDC",
    mint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
  },
  {
    label: "BONK",
    mint: "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263",
  },
];

export default function SolTokenPage() {
  const [mintInput, setMintInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [tokenData, setTokenData] = useState<TokenData | null>(null);

  async function lookupToken(mint?: string) {
    const address = (mint ?? mintInput).trim();
    if (!address) {
      setError("Please enter a mint address.");
      return;
    }

    setLoading(true);
    setError("");
    setTokenData(null);

    try {
      // Fetch on-chain account info from Solana RPC
      const rpcRes = await fetch("https://api.mainnet-beta.solana.com", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: 1,
          method: "getAccountInfo",
          params: [
            address,
            { encoding: "jsonParsed" },
          ],
        }),
      });

      const rpcData = await rpcRes.json();

      if (rpcData.error) {
        throw new Error(rpcData.error.message || "RPC error");
      }

      const accountInfo = rpcData.result?.value;
      if (!accountInfo) {
        throw new Error(
          "Account not found. Make sure the mint address is valid."
        );
      }

      const parsed = accountInfo.data?.parsed;
      if (!parsed || parsed.type !== "mint") {
        throw new Error(
          "This account is not a token mint. Please enter a valid SPL token mint address."
        );
      }

      const mintInfo = parsed.info;
      const decimals: number = mintInfo.decimals;
      const rawSupply: string = mintInfo.supply;
      const adjustedSupply = (
        Number(BigInt(rawSupply)) / Math.pow(10, decimals)
      ).toLocaleString(undefined, {
        maximumFractionDigits: decimals,
      });

      // Fetch metadata from Jupiter API
      let name = "Unknown";
      let symbol = "???";
      let logoURI: string | null = null;
      let price: number | null = null;

      try {
        const jupRes = await fetch(
          `https://tokens.jup.ag/token/${address}`
        );
        if (jupRes.ok) {
          const jupData = await jupRes.json();
          name = jupData.name || name;
          symbol = jupData.symbol || symbol;
          logoURI = jupData.logoURI || null;
        }
      } catch {
        // Jupiter metadata is optional, continue without it
      }

      // Fetch price from Jupiter price API
      try {
        const priceRes = await fetch(
          `https://api.jup.ag/price/v2?ids=${address}`
        );
        if (priceRes.ok) {
          const priceData = await priceRes.json();
          const tokenPrice = priceData.data?.[address]?.price;
          if (tokenPrice) {
            price = parseFloat(tokenPrice);
          }
        }
      } catch {
        // Price is optional, continue without it
      }

      setTokenData({
        name,
        symbol,
        logoURI,
        decimals,
        supply: adjustedSupply,
        price,
        mintAddress: address,
      });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to look up token."
      );
    } finally {
      setLoading(false);
    }
  }

  function handleExampleClick(mint: string) {
    setMintInput(mint);
    lookupToken(mint);
  }

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">Solana Token Lookup</h1>
        <p className="text-[var(--text-secondary)] text-sm">
          Look up any Solana token by mint address. See name, symbol, supply,
          decimals, price, and more.
        </p>
      </div>

      {/* AD SLOT - Top */}
      <div className="ad-slot mb-6">
        {/* AD SLOT: in-content ad */}
        <span>Ad Space</span>
      </div>

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
            onKeyDown={(e) => e.key === "Enter" && lookupToken()}
            placeholder="Enter a Solana token mint address..."
            className="flex-1"
          />
          <button
            onClick={() => lookupToken()}
            disabled={loading}
            className="px-5 py-2 rounded-lg bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white text-sm font-medium transition-colors disabled:opacity-50 shrink-0"
          >
            {loading ? "Looking up..." : "Lookup"}
          </button>
        </div>
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
            className="px-3 py-1.5 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border)] hover:border-[var(--accent)] text-sm transition-colors text-[var(--text-secondary)] hover:text-white"
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-lg border border-[var(--error)] bg-[var(--error)]/10 p-3 text-sm text-[var(--error)] mb-6">
          {error}
        </div>
      )}

      {/* Results */}
      {tokenData && (
        <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] p-6 mb-6">
          {/* Header with logo, name, symbol */}
          <div className="flex items-center gap-4 mb-6">
            {tokenData.logoURI ? (
              <img
                src={tokenData.logoURI}
                alt={tokenData.name}
                className="w-12 h-12 rounded-full border border-[var(--border)]"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-[var(--bg-tertiary)] border border-[var(--border)] flex items-center justify-center text-lg font-bold text-[var(--accent)]">
                {tokenData.symbol.charAt(0)}
              </div>
            )}
            <div>
              <h2 className="text-xl font-bold text-white">
                {tokenData.name}
              </h2>
              <span className="text-sm text-[var(--text-secondary)]">
                {tokenData.symbol}
              </span>
            </div>
            {tokenData.price !== null && (
              <div className="ml-auto text-right">
                <div className="text-xl font-bold text-[var(--accent)]">
                  $
                  {tokenData.price < 0.01
                    ? tokenData.price.toFixed(8)
                    : tokenData.price.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 6,
                      })}
                </div>
                <div className="text-xs text-[var(--text-secondary)]">
                  USD Price
                </div>
              </div>
            )}
          </div>

          {/* Data grid */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border)] p-4">
              <div className="text-xs text-[var(--text-secondary)] mb-1">
                Total Supply
              </div>
              <div className="text-sm font-mono font-medium text-white break-all">
                {tokenData.supply}
              </div>
            </div>
            <div className="rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border)] p-4">
              <div className="text-xs text-[var(--text-secondary)] mb-1">
                Decimals
              </div>
              <div className="text-sm font-mono font-medium text-white">
                {tokenData.decimals}
              </div>
            </div>
            <div className="rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border)] p-4 sm:col-span-2">
              <div className="text-xs text-[var(--text-secondary)] mb-1">
                Mint Address
              </div>
              <div className="text-sm font-mono font-medium text-white break-all">
                {tokenData.mintAddress}
              </div>
            </div>
          </div>

          {/* Solscan link */}
          <div className="mt-4 pt-4 border-t border-[var(--border)]">
            <a
              href={`https://solscan.io/token/${tokenData.mintAddress}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-[var(--accent)] hover:text-[var(--accent-hover)] transition-colors"
            >
              View on Solscan
              <span aria-hidden="true">&rarr;</span>
            </a>
          </div>
        </div>
      )}

      {/* AD SLOT - Bottom */}
      <div className="ad-slot mt-8">
        {/* AD SLOT: in-content ad */}
        <span>Ad Space</span>
      </div>

      <section className="mt-10 text-sm text-[var(--text-secondary)] space-y-2">
        <h2 className="text-lg font-semibold text-white">
          About Solana Token Lookup
        </h2>
        <p>
          Enter any SPL token mint address to fetch on-chain data directly from
          the Solana mainnet RPC. Token metadata (name, symbol, logo) and price
          data are fetched from the Jupiter API. Everything runs client-side in
          your browser — no signup or API key required.
        </p>
      </section>
    </>
  );
}
