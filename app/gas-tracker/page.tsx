"use client";

import { useState, useEffect, useMemo } from "react";

export default function GasTrackerPage() {
  const [solPrice, setSolPrice] = useState<number | null>(null);
  const [ethPrice, setEthPrice] = useState<number | null>(null);
  const [ethGas, setEthGas] = useState<number | null>(null);
  const [lastUpdated, setLastUpdated] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [txCount, setTxCount] = useState("10");

  // Solana fee constants (lamports)
  const SOL_BASE_FEE_LAMPORTS = 5000; // 5000 lamports = 0.000005 SOL
  const SOL_PRIORITY_LOW = 10000;
  const SOL_PRIORITY_MED = 100000;
  const SOL_PRIORITY_HIGH = 1000000;
  const LAMPORTS_PER_SOL = 1_000_000_000;

  async function fetchData() {
    try {
      setLoading(true);
      setError("");

      const [priceRes, gasRes] = await Promise.all([
        fetch(
          "https://api.coingecko.com/api/v3/simple/price?ids=solana,ethereum&vs_currencies=usd"
        ),
        fetch(
          "https://api.etherscan.io/api?module=gastracker&action=gasoracle"
        ).catch(() => null),
      ]);

      if (!priceRes.ok) throw new Error("Failed to fetch prices");
      const priceData = await priceRes.json();
      setSolPrice(priceData.solana.usd);
      setEthPrice(priceData.ethereum.usd);

      if (gasRes && gasRes.ok) {
        const gasData = await gasRes.json();
        if (gasData.result && gasData.result.ProposeGasPrice) {
          setEthGas(parseFloat(gasData.result.ProposeGasPrice));
        }
      }

      setLastUpdated(new Date().toLocaleTimeString());
    } catch {
      setError("Failed to fetch data. Try again in a moment.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, []);

  function lamportsToUSD(lamports: number) {
    if (!solPrice) return null;
    return (lamports / LAMPORTS_PER_SOL) * solPrice;
  }

  function formatUSD(v: number | null) {
    if (v === null) return "—";
    if (v < 0.01) return "$" + v.toFixed(6);
    return "$" + v.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  // Ethereum tx costs (21000 gas for simple transfer, ~65000 for ERC-20, ~150000 for swap)
  const ethCosts = useMemo(() => {
    if (!ethGas || !ethPrice) return null;
    const gweiToEth = 1e-9;
    return {
      simple: 21000 * ethGas * gweiToEth * ethPrice,
      erc20: 65000 * ethGas * gweiToEth * ethPrice,
      swap: 150000 * ethGas * gweiToEth * ethPrice,
    };
  }, [ethGas, ethPrice]);

  const numTx = parseInt(txCount) || 0;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Solana Gas Fee Tracker",
    description:
      "Track Solana gas fees in real-time and compare with Ethereum. See how much you save trading on Solana.",
    url: "https://devtools-site-delta.vercel.app/gas-tracker",
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
        <h1 className="text-2xl font-bold mb-1">Solana Gas Fee Tracker</h1>
        <p className="text-[var(--text-secondary)] text-sm">
          Real-time Solana transaction fees compared to Ethereum. See why
          Solana is the cheapest chain for crypto trading.
        </p>
      </div>

      {/* AD SLOT - Top */}
      <div className="ad-slot mb-6">
        <span>Ad Space</span>
      </div>

      {error && (
        <div className="rounded-lg border border-[var(--error)] bg-[var(--error)]/10 p-3 text-sm text-[var(--error)] mb-6">
          {error}
        </div>
      )}

      {/* Fee Overview Cards */}
      <div className="grid gap-4 sm:grid-cols-2 mb-6">
        {/* Solana Fees */}
        <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold">Solana Fees</h2>
            <span className="px-2 py-0.5 rounded text-xs bg-green-900/50 text-green-400 border border-green-800/30">
              Ultra Low
            </span>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-[var(--text-secondary)]">
                Base Fee
              </span>
              <div className="text-right">
                <div className="text-lg font-bold text-green-400">
                  {formatUSD(lamportsToUSD(SOL_BASE_FEE_LAMPORTS))}
                </div>
                <div className="text-xs text-[var(--text-secondary)]">
                  0.000005 SOL
                </div>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-[var(--text-secondary)]">
                + Low Priority
              </span>
              <div className="text-right">
                <div className="font-medium text-green-400">
                  {formatUSD(
                    lamportsToUSD(SOL_BASE_FEE_LAMPORTS + SOL_PRIORITY_LOW)
                  )}
                </div>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-[var(--text-secondary)]">
                + Medium Priority
              </span>
              <div className="text-right">
                <div className="font-medium text-green-400">
                  {formatUSD(
                    lamportsToUSD(SOL_BASE_FEE_LAMPORTS + SOL_PRIORITY_MED)
                  )}
                </div>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-[var(--text-secondary)]">
                + High Priority
              </span>
              <div className="text-right">
                <div className="font-medium text-yellow-400">
                  {formatUSD(
                    lamportsToUSD(SOL_BASE_FEE_LAMPORTS + SOL_PRIORITY_HIGH)
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Ethereum Fees */}
        <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold">Ethereum Fees</h2>
            <span className="px-2 py-0.5 rounded text-xs bg-red-900/50 text-red-400 border border-red-800/30">
              {ethGas ? `${ethGas} Gwei` : "Loading..."}
            </span>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-[var(--text-secondary)]">
                Simple Transfer
              </span>
              <div className="text-right">
                <div className="text-lg font-bold text-red-400">
                  {ethCosts ? formatUSD(ethCosts.simple) : "—"}
                </div>
                <div className="text-xs text-[var(--text-secondary)]">
                  21,000 gas
                </div>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-[var(--text-secondary)]">
                ERC-20 Transfer
              </span>
              <div className="text-right">
                <div className="font-medium text-red-400">
                  {ethCosts ? formatUSD(ethCosts.erc20) : "—"}
                </div>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-[var(--text-secondary)]">
                DEX Swap
              </span>
              <div className="text-right">
                <div className="font-medium text-red-400">
                  {ethCosts ? formatUSD(ethCosts.swap) : "—"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Refresh */}
      <div className="flex items-center justify-between mb-8">
        <div className="text-xs text-[var(--text-secondary)]">
          {lastUpdated && `Updated ${lastUpdated}`}
        </div>
        <button
          onClick={fetchData}
          disabled={loading}
          className="px-3 py-1.5 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border)] hover:border-[var(--accent)] text-sm transition-colors disabled:opacity-50"
        >
          {loading ? "..." : "Refresh"}
        </button>
      </div>

      {/* Fee Savings Calculator */}
      <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] p-6 mb-8 max-w-2xl">
        <h2 className="text-lg font-semibold mb-4">Fee Savings Calculator</h2>
        <p className="text-sm text-[var(--text-secondary)] mb-4">
          See how much you save by trading on Solana instead of Ethereum.
        </p>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">
            Number of Transactions
          </label>
          <input
            type="number"
            step="1"
            min="1"
            value={txCount}
            onChange={(e) => setTxCount(e.target.value)}
            placeholder="Number of transactions"
            className="text-lg max-w-xs"
          />
        </div>
        {numTx > 0 && solPrice && (
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-lg bg-[var(--bg-tertiary)] p-3">
              <div className="text-xs text-[var(--text-secondary)] mb-1">
                Solana Cost ({numTx} txs)
              </div>
              <div className="text-lg font-bold text-green-400">
                {formatUSD(
                  numTx *
                    ((SOL_BASE_FEE_LAMPORTS + SOL_PRIORITY_MED) /
                      LAMPORTS_PER_SOL) *
                    solPrice
                )}
              </div>
            </div>
            <div className="rounded-lg bg-[var(--bg-tertiary)] p-3">
              <div className="text-xs text-[var(--text-secondary)] mb-1">
                Ethereum Cost ({numTx} swaps)
              </div>
              <div className="text-lg font-bold text-red-400">
                {ethCosts ? formatUSD(numTx * ethCosts.swap) : "—"}
              </div>
            </div>
            <div className="rounded-lg bg-[var(--bg-tertiary)] p-3">
              <div className="text-xs text-[var(--text-secondary)] mb-1">
                You Save
              </div>
              <div className="text-lg font-bold text-[var(--accent)]">
                {ethCosts
                  ? formatUSD(
                      numTx * ethCosts.swap -
                        numTx *
                          ((SOL_BASE_FEE_LAMPORTS + SOL_PRIORITY_MED) /
                            LAMPORTS_PER_SOL) *
                          (solPrice || 0)
                    )
                  : "—"}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Comparison Table */}
      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-4">
          Solana vs Ethereum: Full Comparison
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse max-w-2xl">
            <thead>
              <tr className="border-b border-[var(--border)]">
                <th className="text-left py-2 pr-4 text-[var(--text-secondary)]">
                  Feature
                </th>
                <th className="text-left py-2 pr-4 text-[var(--text-secondary)]">
                  Solana
                </th>
                <th className="text-left py-2 text-[var(--text-secondary)]">
                  Ethereum
                </th>
              </tr>
            </thead>
            <tbody className="text-[var(--text-secondary)]">
              <tr className="border-b border-[var(--border)]/50">
                <td className="py-2 pr-4 text-white">Avg Transaction Fee</td>
                <td className="py-2 pr-4 text-green-400">~$0.00025</td>
                <td className="py-2 text-red-400">$1 - $20+</td>
              </tr>
              <tr className="border-b border-[var(--border)]/50">
                <td className="py-2 pr-4 text-white">DEX Swap Fee</td>
                <td className="py-2 pr-4 text-green-400">~$0.001 - $0.01</td>
                <td className="py-2 text-red-400">$5 - $50+</td>
              </tr>
              <tr className="border-b border-[var(--border)]/50">
                <td className="py-2 pr-4 text-white">Block Time</td>
                <td className="py-2 pr-4">~400ms</td>
                <td className="py-2">~12 seconds</td>
              </tr>
              <tr className="border-b border-[var(--border)]/50">
                <td className="py-2 pr-4 text-white">TPS (Theoretical)</td>
                <td className="py-2 pr-4">65,000+</td>
                <td className="py-2">~30</td>
              </tr>
              <tr className="border-b border-[var(--border)]/50">
                <td className="py-2 pr-4 text-white">Finality</td>
                <td className="py-2 pr-4">~400ms</td>
                <td className="py-2">~6 minutes</td>
              </tr>
              <tr className="border-b border-[var(--border)]/50">
                <td className="py-2 pr-4 text-white">Consensus</td>
                <td className="py-2 pr-4">Proof of Stake + PoH</td>
                <td className="py-2">Proof of Stake</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 text-white">Cost for 100 trades</td>
                <td className="py-2 pr-4 text-green-400">~$0.025</td>
                <td className="py-2 text-red-400">$500 - $5,000+</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* AD SLOT - Bottom */}
      <div className="ad-slot mt-8">
        <span>Ad Space</span>
      </div>

      {/* CTA */}
      <div className="mt-8 bg-gradient-to-r from-blue-900/50 to-purple-900/50 rounded-xl p-6 border border-blue-800/30">
        <h3 className="text-lg font-bold text-white mb-2">
          Trade with Low Fees on Solana
        </h3>
        <p className="text-gray-300 text-sm mb-3">
          Why pay $10+ in Ethereum gas when Solana transactions cost fractions
          of a penny? Trade any Solana token from Telegram with MEV protection
          and 0.5% fees on Premium.
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
          Understanding Solana Gas Fees
        </h2>
        <p>
          Solana uses a unique fee structure with two components: a base fee
          (currently 5,000 lamports or 0.000005 SOL) and an optional priority
          fee. Even with maximum priority fees, Solana transactions rarely cost
          more than a fraction of a cent.
        </p>
        <h3 className="text-base font-semibold text-white mt-4">
          Why Are Solana Fees So Low?
        </h3>
        <p>
          Solana achieves low fees through its unique Proof of History (PoH)
          consensus mechanism combined with Proof of Stake, enabling the
          network to process thousands of transactions per second. Higher
          throughput means lower cost per transaction.
        </p>
        <h3 className="text-base font-semibold text-white mt-4">
          Solana Priority Fees
        </h3>
        <p>
          During high network activity, you can add priority fees to get your
          transaction processed faster. Priority fees are measured in
          micro-lamports per compute unit. Even high-priority Solana
          transactions cost far less than a standard Ethereum transfer.
        </p>
        <h3 className="text-base font-semibold text-white mt-4">
          Best Way to Trade on Solana
        </h3>
        <p>
          For the fastest, cheapest trading experience on Solana, use{" "}
          <a
            href="https://t.me/solscanitbot"
            className="text-[var(--accent)] hover:underline"
          >
            @solscanitbot
          </a>{" "}
          on Telegram. It handles priority fees automatically, includes MEV
          protection, and lets you buy, sell, snipe, and copy trade any Solana
          token.
        </p>
      </section>
    </>
  );
}
