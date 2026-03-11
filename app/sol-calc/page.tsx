"use client";

import { useState, useEffect } from "react";

export default function SolCalcPage() {
  const [solPrice, setSolPrice] = useState<number | null>(null);
  const [solAmount, setSolAmount] = useState("1");
  const [usdAmount, setUsdAmount] = useState("");
  const [lastUpdated, setLastUpdated] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function fetchPrice() {
    try {
      setLoading(true);
      setError("");
      const res = await fetch(
        "https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd"
      );
      if (!res.ok) throw new Error("Failed to fetch price");
      const data = await res.json();
      const price: number = data.solana.usd;
      setSolPrice(price);
      setLastUpdated(new Date().toLocaleTimeString());
    } catch {
      setError(
        "Failed to fetch SOL price. CoinGecko API may be rate-limited. Try again in a moment."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchPrice();
    const interval = setInterval(fetchPrice, 60000);
    return () => clearInterval(interval);
  }, []);

  // Recalculate USD when price changes
  useEffect(() => {
    if (solPrice !== null && solAmount && !isNaN(parseFloat(solAmount))) {
      setUsdAmount((parseFloat(solAmount) * solPrice).toFixed(2));
    }
  }, [solPrice, solAmount]);

  function handleSolChange(value: string) {
    setSolAmount(value);
    if (!value || isNaN(parseFloat(value)) || solPrice === null) {
      setUsdAmount("");
      return;
    }
    setUsdAmount((parseFloat(value) * solPrice).toFixed(2));
  }

  function handleUsdChange(value: string) {
    setUsdAmount(value);
    if (!value || isNaN(parseFloat(value)) || solPrice === null) {
      setSolAmount("");
      return;
    }
    setSolAmount((parseFloat(value) / solPrice).toFixed(6));
  }

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">SOL / USD Calculator</h1>
        <p className="text-[var(--text-secondary)] text-sm">
          Convert between Solana (SOL) and USD with live prices from CoinGecko.
        </p>
      </div>

      {/* AD SLOT - Top */}
      <div className="ad-slot mb-6">
        {/* AD SLOT: in-content ad */}
        <span>Ad Space</span>
      </div>

      {solPrice !== null && (
        <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] p-4 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm text-[var(--text-secondary)]">
                SOL Price:
              </span>
              <span className="ml-2 text-xl font-bold text-[var(--accent)]">
                $
                {solPrice.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            </div>
            <div className="text-right">
              <button
                onClick={fetchPrice}
                disabled={loading}
                className="px-3 py-1.5 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border)] hover:border-[var(--accent)] text-sm transition-colors disabled:opacity-50"
              >
                {loading ? "..." : "Refresh"}
              </button>
              {lastUpdated && (
                <div className="text-xs text-[var(--text-secondary)] mt-1">
                  Updated {lastUpdated}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="rounded-lg border border-[var(--error)] bg-[var(--error)]/10 p-3 text-sm text-[var(--error)] mb-6">
          {error}
        </div>
      )}

      <div className="grid gap-6 sm:grid-cols-2 max-w-2xl">
        <div>
          <label className="block text-sm font-medium mb-2">SOL</label>
          <input
            type="number"
            step="any"
            value={solAmount}
            onChange={(e) => handleSolChange(e.target.value)}
            placeholder="Enter SOL amount"
            className="text-lg"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">USD</label>
          <input
            type="number"
            step="any"
            value={usdAmount}
            onChange={(e) => handleUsdChange(e.target.value)}
            placeholder="Enter USD amount"
            className="text-lg"
          />
        </div>
      </div>

      {solPrice !== null && solAmount && !isNaN(parseFloat(solAmount)) && (
        <div className="mt-6 text-sm text-[var(--text-secondary)] space-y-1">
          <p>
            {solAmount} SOL = ${usdAmount} USD
          </p>
          <p>
            Rate: 1 SOL = $
            {solPrice.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}{" "}
            USD
          </p>
        </div>
      )}

      {/* AD SLOT - Bottom */}
      <div className="ad-slot mt-8">
        {/* AD SLOT: in-content ad */}
        <span>Ad Space</span>
      </div>

      <div className="mt-8 bg-gradient-to-r from-blue-900/50 to-purple-900/50 rounded-xl p-6 border border-blue-800/30">
        <h3 className="text-lg font-bold text-white mb-2">Trade Solana Tokens on Telegram</h3>
        <p className="text-gray-300 text-sm mb-3">Buy, sell, copy trade, snipe new tokens, and DCA — all from Telegram. MEV-protected. 0.5% fees with Premium.</p>
        <a href="https://t.me/solscanitbot" target="_blank" rel="noopener noreferrer" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg text-sm transition-colors">Open @solscanitbot</a>
      </div>

      <section className="mt-10 text-sm text-[var(--text-secondary)] space-y-2">
        <h2 className="text-lg font-semibold text-white">
          About SOL / USD Conversion
        </h2>
        <p>
          Solana (SOL) is a high-performance blockchain cryptocurrency. This
          calculator fetches the latest SOL/USD price from the CoinGecko API and
          auto-refreshes every 60 seconds.
        </p>
      </section>
    </>
  );
}
