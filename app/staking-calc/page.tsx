"use client";
import { useState, useEffect } from "react";

export default function StakingCalcPage() {
  const [amount, setAmount] = useState("100");
  const [price, setPrice] = useState(150);
  const apy = 7.2;

  useEffect(() => {
    fetch("https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd")
      .then(r => r.json()).then(d => { if (d.solana?.usd) setPrice(d.solana.usd); }).catch(() => {});
  }, []);

  const sol = parseFloat(amount) || 0;
  const yearly = sol * (apy / 100);
  const monthly = yearly / 12;
  const daily = yearly / 365;

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-3xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-extrabold mb-2 text-center">Solana Staking Calculator</h1>
        <p className="text-gray-400 text-center mb-8">Estimate your SOL staking rewards at current rates ({apy}% APY).</p>
        <div className="bg-gray-900 rounded-xl p-8 mb-8">
          <label className="text-sm text-gray-400 block mb-2">Amount to Stake (SOL)</label>
          <input type="number" value={amount} onChange={e => setAmount(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white text-2xl font-bold mb-6" />
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="text-2xl font-extrabold text-green-400">{daily.toFixed(4)}</div>
              <div className="text-xs text-gray-400 mt-1">SOL/day</div>
              <div className="text-xs text-gray-500">${(daily * price).toFixed(2)}/day</div>
            </div>
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="text-2xl font-extrabold text-green-400">{monthly.toFixed(2)}</div>
              <div className="text-xs text-gray-400 mt-1">SOL/month</div>
              <div className="text-xs text-gray-500">${(monthly * price).toFixed(2)}/mo</div>
            </div>
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="text-2xl font-extrabold text-green-400">{yearly.toFixed(2)}</div>
              <div className="text-xs text-gray-400 mt-1">SOL/year</div>
              <div className="text-xs text-gray-500">${(yearly * price).toFixed(2)}/yr</div>
            </div>
          </div>
          <div className="mt-4 text-center text-gray-500 text-xs">
            Based on {apy}% APY at ${price.toFixed(0)}/SOL. JitoSOL earns ~{apy + 0.5}% (staking + MEV tips).
          </div>
        </div>
        <div className="bg-gray-900 rounded-xl p-6 text-center mb-8">
          <p className="text-gray-400 text-sm mb-3">Want higher yield? Our Drift vault targets 24% APY on USDC with zero directional exposure.</p>
          <div className="flex gap-3 justify-center">
            <a href="https://t.me/solscanitbot" target="_blank" className="inline-block bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-6 rounded-lg text-sm">Trade SOL</a>
            <a href="/sniper" className="inline-block bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-6 rounded-lg text-sm">Sniper Service</a>
          </div>
        </div>
        <div className="text-center text-gray-500 text-sm">
          <a href="/sol-balance" className="text-purple-400 hover:underline">Balance</a>{" | "}
          <a href="/sol-price" className="text-purple-400 hover:underline">Price</a>{" | "}
          <a href="/airdrop-checker" className="text-purple-400 hover:underline">Airdrops</a>{" | "}
          <a href="/nft-checker" className="text-purple-400 hover:underline">NFTs</a>{" | "}
          <a href="/tx-history" className="text-purple-400 hover:underline">TX History</a>{" | "}
          <a href="/sol-pay" className="text-purple-400 hover:underline">Payments</a>
        </div>
      </div>
    </div>
  );
}
