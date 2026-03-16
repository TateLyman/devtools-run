"use client";

import { useState, useEffect } from "react";

interface Prices {
  solana: { usd: number; usd_24h_change: number };
  ethereum: { usd: number; usd_24h_change: number };
  bitcoin: { usd: number; usd_24h_change: number };
}

export default function SolConverterPage() {
  const [prices, setPrices] = useState<Prices | null>(null);
  const [amount, setAmount] = useState("1");
  const [direction, setDirection] = useState<"sol-to-usd" | "usd-to-sol">(
    "sol-to-usd"
  );
  const [lastUpdated, setLastUpdated] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function fetchPrices() {
    try {
      setLoading(true);
      setError("");
      const res = await fetch(
        "https://api.coingecko.com/api/v3/simple/price?ids=solana,ethereum,bitcoin&vs_currencies=usd&include_24hr_change=true"
      );
      if (!res.ok) throw new Error("Failed to fetch prices");
      const data = await res.json();
      setPrices(data);
      setLastUpdated(new Date().toLocaleTimeString());
    } catch {
      setError("Failed to fetch prices. CoinGecko API may be rate-limited.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchPrices();
    const interval = setInterval(fetchPrices, 60000);
    return () => clearInterval(interval);
  }, []);

  const numAmount = parseFloat(amount) || 0;

  const converted =
    prices && numAmount > 0
      ? direction === "sol-to-usd"
        ? numAmount * prices.solana.usd
        : numAmount / prices.solana.usd
      : null;

  function formatUSD(v: number) {
    return "$" + v.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
  function formatChange(v: number) {
    const sign = v >= 0 ? "+" : "";
    return `${sign}${v.toFixed(2)}%`;
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "SOL to USD Converter",
    description:
      "Convert SOL to USD with live prices. Compare Solana with Ethereum and Bitcoin.",
    url: "https://devtools-site-delta.vercel.app/sol-converter",
    applicationCategory: "FinanceApplication",
    operatingSystem: "Any",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">SOL to USD Converter</h1>
        <p className="text-[var(--text-secondary)] text-sm">
          Convert between Solana (SOL) and USD with live prices. Compare with
          ETH and BTC.
        </p>
      </div>

      {/* AD SLOT - Top */}
      <div className="ad-slot mb-6">
        <span>Ad Space</span>
      </div>

      {/* Price Cards */}
      {prices && (
        <div className="grid gap-4 sm:grid-cols-3 mb-6">
          {(
            [
              ["SOL", prices.solana],
              ["ETH", prices.ethereum],
              ["BTC", prices.bitcoin],
            ] as const
          ).map(([symbol, data]) => (
            <div
              key={symbol}
              className="rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] p-4"
            >
              <div className="text-sm text-[var(--text-secondary)] mb-1">
                {symbol}
              </div>
              <div className="text-xl font-bold text-[var(--accent)]">
                {formatUSD(data.usd)}
              </div>
              <div
                className={`text-sm mt-1 ${
                  data.usd_24h_change >= 0
                    ? "text-green-400"
                    : "text-red-400"
                }`}
              >
                {formatChange(data.usd_24h_change)} (24h)
              </div>
            </div>
          ))}
        </div>
      )}

      {error && (
        <div className="rounded-lg border border-[var(--error)] bg-[var(--error)]/10 p-3 text-sm text-[var(--error)] mb-6">
          {error}
        </div>
      )}

      {/* Converter */}
      <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] p-6 mb-6 max-w-2xl">
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={() => setDirection("sol-to-usd")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              direction === "sol-to-usd"
                ? "bg-[var(--accent)] text-white"
                : "bg-[var(--bg-tertiary)] border border-[var(--border)] hover:border-[var(--accent)]"
            }`}
          >
            SOL &rarr; USD
          </button>
          <button
            onClick={() => setDirection("usd-to-sol")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              direction === "usd-to-sol"
                ? "bg-[var(--accent)] text-white"
                : "bg-[var(--bg-tertiary)] border border-[var(--border)] hover:border-[var(--accent)]"
            }`}
          >
            USD &rarr; SOL
          </button>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium mb-2">
              {direction === "sol-to-usd" ? "SOL Amount" : "USD Amount"}
            </label>
            <input
              type="number"
              step="any"
              min="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder={
                direction === "sol-to-usd"
                  ? "Enter SOL amount"
                  : "Enter USD amount"
              }
              className="text-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              {direction === "sol-to-usd" ? "USD Value" : "SOL Value"}
            </label>
            <div className="text-2xl font-bold text-[var(--accent)] mt-2">
              {converted !== null
                ? direction === "sol-to-usd"
                  ? formatUSD(converted)
                  : `${converted.toFixed(6)} SOL`
                : "—"}
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="text-xs text-[var(--text-secondary)]">
            {prices &&
              `Rate: 1 SOL = ${formatUSD(prices.solana.usd)}`}
          </div>
          <button
            onClick={fetchPrices}
            disabled={loading}
            className="px-3 py-1.5 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border)] hover:border-[var(--accent)] text-sm transition-colors disabled:opacity-50"
          >
            {loading ? "..." : "Refresh"}
          </button>
        </div>
        {lastUpdated && (
          <div className="text-xs text-[var(--text-secondary)] mt-1">
            Updated {lastUpdated}
          </div>
        )}
      </div>

      {/* Quick Conversion Table */}
      {prices && (
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-4">
            Quick SOL to USD Conversions
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse max-w-2xl">
              <thead>
                <tr className="border-b border-[var(--border)]">
                  <th className="text-left py-2 pr-4 text-[var(--text-secondary)]">
                    SOL
                  </th>
                  <th className="text-left py-2 pr-4 text-[var(--text-secondary)]">
                    USD
                  </th>
                  <th className="text-left py-2 pr-4 text-[var(--text-secondary)]">
                    ETH Equivalent
                  </th>
                  <th className="text-left py-2 text-[var(--text-secondary)]">
                    BTC Equivalent
                  </th>
                </tr>
              </thead>
              <tbody className="text-[var(--text-secondary)]">
                {[0.1, 0.5, 1, 5, 10, 50, 100, 500, 1000].map((sol) => (
                  <tr
                    key={sol}
                    className="border-b border-[var(--border)]/50"
                  >
                    <td className="py-2 pr-4 text-white">{sol} SOL</td>
                    <td className="py-2 pr-4">
                      {formatUSD(sol * prices.solana.usd)}
                    </td>
                    <td className="py-2 pr-4">
                      {((sol * prices.solana.usd) / prices.ethereum.usd).toFixed(
                        6
                      )}{" "}
                      ETH
                    </td>
                    <td className="py-2">
                      {((sol * prices.solana.usd) / prices.bitcoin.usd).toFixed(
                        8
                      )}{" "}
                      BTC
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Comparison Table */}
      {prices && (
        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-4">
            SOL vs ETH vs BTC Comparison
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse max-w-2xl">
              <thead>
                <tr className="border-b border-[var(--border)]">
                  <th className="text-left py-2 pr-4 text-[var(--text-secondary)]">
                    Metric
                  </th>
                  <th className="text-left py-2 pr-4 text-[var(--text-secondary)]">
                    SOL
                  </th>
                  <th className="text-left py-2 pr-4 text-[var(--text-secondary)]">
                    ETH
                  </th>
                  <th className="text-left py-2 text-[var(--text-secondary)]">
                    BTC
                  </th>
                </tr>
              </thead>
              <tbody className="text-[var(--text-secondary)]">
                <tr className="border-b border-[var(--border)]/50">
                  <td className="py-2 pr-4 text-white">Price</td>
                  <td className="py-2 pr-4">{formatUSD(prices.solana.usd)}</td>
                  <td className="py-2 pr-4">
                    {formatUSD(prices.ethereum.usd)}
                  </td>
                  <td className="py-2">{formatUSD(prices.bitcoin.usd)}</td>
                </tr>
                <tr className="border-b border-[var(--border)]/50">
                  <td className="py-2 pr-4 text-white">24h Change</td>
                  <td
                    className={`py-2 pr-4 ${
                      prices.solana.usd_24h_change >= 0
                        ? "text-green-400"
                        : "text-red-400"
                    }`}
                  >
                    {formatChange(prices.solana.usd_24h_change)}
                  </td>
                  <td
                    className={`py-2 pr-4 ${
                      prices.ethereum.usd_24h_change >= 0
                        ? "text-green-400"
                        : "text-red-400"
                    }`}
                  >
                    {formatChange(prices.ethereum.usd_24h_change)}
                  </td>
                  <td
                    className={`py-2 ${
                      prices.bitcoin.usd_24h_change >= 0
                        ? "text-green-400"
                        : "text-red-400"
                    }`}
                  >
                    {formatChange(prices.bitcoin.usd_24h_change)}
                  </td>
                </tr>
                <tr className="border-b border-[var(--border)]/50">
                  <td className="py-2 pr-4 text-white">Avg Tx Fee</td>
                  <td className="py-2 pr-4">~$0.00025</td>
                  <td className="py-2 pr-4">~$1-20</td>
                  <td className="py-2">~$1-5</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 text-white">Tx Speed</td>
                  <td className="py-2 pr-4">~400ms</td>
                  <td className="py-2 pr-4">~12s</td>
                  <td className="py-2">~10min</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* AD SLOT - Bottom */}
      <div className="ad-slot mt-8">
        <span>Ad Space</span>
      </div>

      {/* CTA */}
      <div className="mt-8 bg-gradient-to-r from-blue-900/50 to-purple-900/50 rounded-xl p-6 border border-blue-800/30">
        <h3 className="text-lg font-bold text-white mb-2">
          Trade Solana Tokens on Telegram
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

      <section className="mt-10 text-sm text-[var(--text-secondary)] space-y-4">
        <h2 className="text-lg font-semibold text-white">
          About SOL to USD Conversion
        </h2>
        <p>
          Solana (SOL) is a high-performance Layer 1 blockchain known for fast
          transactions and low fees. This converter fetches live SOL, ETH, and
          BTC prices from the CoinGecko API, auto-refreshing every 60 seconds.
        </p>
        <p>
          SOL can be traded on major exchanges like Coinbase, Binance, and
          Kraken, or directly on-chain using decentralized exchanges. For the
          fastest trading experience, use{" "}
          <a
            href="https://t.me/solscanitbot"
            className="text-[var(--accent)] hover:underline"
          >
            @solscanitbot
          </a>{" "}
          on Telegram to buy and sell any Solana token instantly.
        </p>
        <h3 className="text-base font-semibold text-white mt-4">
          Why Solana?
        </h3>
        <p>
          Solana processes thousands of transactions per second with fees under
          $0.001, making it ideal for trading, DeFi, NFTs, and payments. Its
          growing ecosystem of dApps and tokens makes SOL one of the most
          actively traded cryptocurrencies.
        </p>
      </section>
    </>
  );
}
