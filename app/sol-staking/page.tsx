"use client";

import { useState, useEffect, useMemo } from "react";

export default function SolStakingPage() {
  const [solPrice, setSolPrice] = useState<number | null>(null);
  const [solAmount, setSolAmount] = useState("100");
  const [apy, setApy] = useState("7");
  const [lastUpdated, setLastUpdated] = useState("");
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
      setSolPrice(data.solana.usd);
      setLastUpdated(new Date().toLocaleTimeString());
    } catch {
      setError("Failed to fetch SOL price. Try again in a moment.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchPrice();
    const interval = setInterval(fetchPrice, 60000);
    return () => clearInterval(interval);
  }, []);

  const rewards = useMemo(() => {
    const amount = parseFloat(solAmount);
    const apyRate = parseFloat(apy);
    if (isNaN(amount) || isNaN(apyRate) || amount <= 0 || apyRate <= 0)
      return null;

    const yearlySOL = amount * (apyRate / 100);
    const monthlySOL = yearlySOL / 12;
    const weeklySOL = yearlySOL / 52;
    const dailySOL = yearlySOL / 365;

    return {
      daily: { sol: dailySOL, usd: solPrice ? dailySOL * solPrice : null },
      weekly: { sol: weeklySOL, usd: solPrice ? weeklySOL * solPrice : null },
      monthly: {
        sol: monthlySOL,
        usd: solPrice ? monthlySOL * solPrice : null,
      },
      yearly: { sol: yearlySOL, usd: solPrice ? yearlySOL * solPrice : null },
    };
  }, [solAmount, apy, solPrice]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Solana Staking Calculator",
    description:
      "Calculate Solana staking rewards based on APY. Estimate daily, weekly, monthly, and yearly SOL earnings.",
    url: "https://devtools-site-delta.vercel.app/sol-staking",
    applicationCategory: "FinanceApplication",
    operatingSystem: "Any",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  };

  function formatSOL(v: number) {
    return v < 0.0001 ? v.toExponential(4) : v.toFixed(6);
  }
  function formatUSD(v: number | null) {
    if (v === null) return "—";
    return "$" + v.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">Solana Staking Calculator</h1>
        <p className="text-[var(--text-secondary)] text-sm">
          Estimate your Solana staking rewards. Enter your SOL amount and APY to
          see projected daily, weekly, monthly, and yearly earnings.
        </p>
      </div>

      {/* AD SLOT - Top */}
      <div className="ad-slot mb-6">
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
          <label className="block text-sm font-medium mb-2">
            SOL Amount to Stake
          </label>
          <input
            type="number"
            step="any"
            min="0"
            value={solAmount}
            onChange={(e) => setSolAmount(e.target.value)}
            placeholder="Enter SOL amount"
            className="text-lg"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">
            APY (%)
          </label>
          <input
            type="number"
            step="0.1"
            min="0"
            max="100"
            value={apy}
            onChange={(e) => setApy(e.target.value)}
            placeholder="Staking APY %"
            className="text-lg"
          />
        </div>
      </div>

      {rewards && (
        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-4">Estimated Staking Rewards</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {(
              [
                ["Daily", rewards.daily],
                ["Weekly", rewards.weekly],
                ["Monthly", rewards.monthly],
                ["Yearly", rewards.yearly],
              ] as const
            ).map(([label, r]) => (
              <div
                key={label}
                className="rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] p-4"
              >
                <div className="text-sm text-[var(--text-secondary)] mb-1">
                  {label}
                </div>
                <div className="text-xl font-bold text-[var(--accent)]">
                  {formatSOL(r.sol)} SOL
                </div>
                <div className="text-sm text-[var(--text-secondary)] mt-1">
                  {formatUSD(r.usd)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {rewards && solPrice !== null && (
        <div className="mt-6 rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] p-4">
          <h3 className="text-sm font-semibold mb-3">Staking Summary</h3>
          <div className="text-sm text-[var(--text-secondary)] space-y-1">
            <p>
              Staking <strong className="text-white">{solAmount} SOL</strong>{" "}
              (worth{" "}
              <strong className="text-white">
                {formatUSD(parseFloat(solAmount) * solPrice)}
              </strong>
              ) at <strong className="text-white">{apy}% APY</strong>
            </p>
            <p>
              After 1 year you would have{" "}
              <strong className="text-[var(--accent)]">
                {(parseFloat(solAmount) + rewards.yearly.sol).toFixed(4)} SOL
              </strong>{" "}
              (
              {formatUSD(
                (parseFloat(solAmount) + rewards.yearly.sol) * solPrice
              )}
              )
            </p>
          </div>
        </div>
      )}

      {/* Common APY Reference */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-4">
          Current Solana Staking APY Ranges
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-[var(--border)]">
                <th className="text-left py-2 pr-4 text-[var(--text-secondary)]">
                  Staking Method
                </th>
                <th className="text-left py-2 pr-4 text-[var(--text-secondary)]">
                  Typical APY
                </th>
                <th className="text-left py-2 text-[var(--text-secondary)]">
                  Notes
                </th>
              </tr>
            </thead>
            <tbody className="text-[var(--text-secondary)]">
              <tr className="border-b border-[var(--border)]/50">
                <td className="py-2 pr-4 text-white">Native Staking</td>
                <td className="py-2 pr-4">6-8%</td>
                <td className="py-2">Delegate to a validator directly</td>
              </tr>
              <tr className="border-b border-[var(--border)]/50">
                <td className="py-2 pr-4 text-white">Liquid Staking (mSOL, jitoSOL)</td>
                <td className="py-2 pr-4">6-8%</td>
                <td className="py-2">Stake while keeping liquidity</td>
              </tr>
              <tr className="border-b border-[var(--border)]/50">
                <td className="py-2 pr-4 text-white">DeFi Yield Farming</td>
                <td className="py-2 pr-4">10-30%+</td>
                <td className="py-2">Higher risk, variable returns</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 text-white">Active Trading</td>
                <td className="py-2 pr-4">Variable</td>
                <td className="py-2">Potentially much higher with bots</td>
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
          Earn More with Active Trading
        </h3>
        <p className="text-gray-300 text-sm mb-3">
          Staking earns 6-8% APY. Active trading with our Telegram bot can earn
          significantly more. Buy, sell, snipe, copy trade, and DCA — all
          MEV-protected with 0.5% fees on Premium.
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
          About Solana Staking
        </h2>
        <p>
          Solana uses a Proof-of-Stake consensus mechanism where SOL holders can
          stake their tokens with validators to help secure the network and earn
          rewards. The current staking APY on Solana typically ranges from 6% to
          8%, depending on the validator and network conditions.
        </p>
        <p>
          This staking calculator helps you estimate your potential rewards based
          on the amount of SOL you plan to stake and the expected APY. Rewards
          are calculated assuming constant APY and SOL price — actual returns may
          vary based on network conditions and price fluctuations.
        </p>
        <h3 className="text-base font-semibold text-white mt-4">
          How to Stake SOL
        </h3>
        <ol className="list-decimal list-inside space-y-1">
          <li>Choose a Solana wallet (Phantom, Solflare, etc.)</li>
          <li>Transfer SOL to your wallet</li>
          <li>Select a validator with good uptime and commission</li>
          <li>Delegate your SOL to the validator</li>
          <li>Rewards accrue each epoch (~2-3 days)</li>
        </ol>
        <h3 className="text-base font-semibold text-white mt-4">
          Staking vs. Active Trading
        </h3>
        <p>
          While staking offers a safe, passive return of 6-8% APY, active
          trading on Solana can provide higher returns. Tools like{" "}
          <a
            href="https://t.me/solscanitbot"
            className="text-[var(--accent)] hover:underline"
          >
            @solscanitbot
          </a>{" "}
          enable automated trading, copy trading, token sniping, and DCA
          strategies directly from Telegram.
        </p>
      </section>
    </>
  );
}
