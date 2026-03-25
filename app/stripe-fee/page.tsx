"use client";
import { useState } from "react";

export default function StripeFeeCalculator() {
  const [amount, setAmount] = useState(100);
  const [country, setCountry] = useState("us");

  const fees: Record<string, { rate: number; fixed: number; label: string }> = {
    us: { rate: 2.9, fixed: 0.30, label: "US (2.9% + $0.30)" },
    eu: { rate: 1.5, fixed: 0.25, label: "EU (1.5% + €0.25)" },
    uk: { rate: 1.5, fixed: 0.20, label: "UK (1.5% + £0.20)" },
    intl: { rate: 3.9, fixed: 0.30, label: "International (3.9% + $0.30)" },
  };

  const fee = fees[country];
  const stripeFee = amount * (fee.rate / 100) + fee.fixed;
  const youReceive = amount - stripeFee;
  const chargeForNet = (amount + fee.fixed) / (1 - fee.rate / 100);
  const feeForNet = chargeForNet - amount;

  const fmt = (n: number) => "$" + n.toFixed(2);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Stripe Fee Calculator</h1>
        <p className="text-[var(--text-secondary)]">
          Calculate Stripe processing fees. See what you receive after fees, or find how much to charge to receive a specific amount.
        </p>
      </div>

      <div className="max-w-lg mx-auto space-y-4">
        <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-4 space-y-3">
          <div>
            <label className="block text-sm mb-1">Transaction Amount</label>
            <div className="relative">
              <span className="absolute left-3 top-3 text-gray-400">$</span>
              <input type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded pl-8 pr-3 py-2.5 text-white text-lg font-mono" min={0} step={0.01} />
            </div>
          </div>
          <div>
            <label className="block text-sm mb-1">Region</label>
            <select value={country} onChange={(e) => setCountry(e.target.value)} className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded px-3 py-2 text-white text-sm">
              {Object.entries(fees).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-center">
            <p className="text-xs text-gray-400">Stripe Fee</p>
            <p className="text-2xl font-bold text-red-400">{fmt(stripeFee)}</p>
            <p className="text-xs text-gray-500">{(stripeFee / amount * 100).toFixed(2)}% effective rate</p>
          </div>
          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-4 text-center">
            <p className="text-xs text-gray-400">You Receive</p>
            <p className="text-2xl font-bold text-emerald-400">{fmt(youReceive)}</p>
            <p className="text-xs text-gray-500">{(youReceive / amount * 100).toFixed(1)}% of charge</p>
          </div>
        </div>

        <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
          <p className="text-sm text-gray-400 mb-1">To receive exactly <span className="text-white font-bold">{fmt(amount)}</span>, charge:</p>
          <p className="text-3xl font-bold text-purple-400">{fmt(chargeForNet)}</p>
          <p className="text-xs text-gray-500">Fee on that amount: {fmt(feeForNet)}</p>
        </div>

        <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-4 text-xs text-[var(--text-secondary)]">
          <h3 className="font-bold text-white mb-2">Fee Breakdown</h3>
          <table className="w-full">
            <tbody>
              {[10, 25, 50, 100, 250, 500, 1000].map((a) => {
                const f = a * (fee.rate / 100) + fee.fixed;
                return (
                  <tr key={a} className="border-b border-[var(--border)] last:border-0">
                    <td className="py-1">{fmt(a)}</td>
                    <td className="text-red-400">{fmt(f)}</td>
                    <td className="text-emerald-400">{fmt(a - f)}</td>
                    <td className="text-gray-500">{(f / a * 100).toFixed(2)}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
