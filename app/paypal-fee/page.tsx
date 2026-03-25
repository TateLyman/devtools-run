"use client";
import { useState } from "react";

export default function PayPalFeeCalculator() {
  const [amount, setAmount] = useState(100);
  const [type, setType] = useState("domestic");

  const fees: Record<string, { rate: number; fixed: number; label: string }> = {
    domestic: { rate: 2.99, fixed: 0.49, label: "Domestic (2.99% + $0.49)" },
    international: { rate: 4.49, fixed: 0.49, label: "International (4.49% + $0.49)" },
    micropayment: { rate: 5.0, fixed: 0.05, label: "Micropayment (5% + $0.05)" },
    friends: { rate: 0, fixed: 0, label: "Friends & Family (free)" },
  };

  const fee = fees[type];
  const paypalFee = amount * (fee.rate / 100) + fee.fixed;
  const youReceive = amount - paypalFee;
  const chargeForNet = fee.rate > 0 ? (amount + fee.fixed) / (1 - fee.rate / 100) : amount;

  const fmt = (n: number) => "$" + n.toFixed(2);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">PayPal Fee Calculator</h1>
        <p className="text-[var(--text-secondary)]">
          Calculate PayPal fees for domestic, international, and micropayments. See what you receive and what to charge.
        </p>
      </div>

      <div className="max-w-lg mx-auto space-y-4">
        <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-4 space-y-3">
          <div className="relative">
            <span className="absolute left-3 top-3 text-gray-400">$</span>
            <input type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded pl-8 pr-3 py-2.5 text-white text-lg font-mono" min={0} step={0.01} />
          </div>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(fees).map(([k, v]) => (
              <button key={k} onClick={() => setType(k)} className={`px-3 py-2 rounded text-xs text-left ${type === k ? "bg-purple-600 text-white" : "bg-[var(--bg-primary)] text-[var(--text-secondary)]"}`}>{v.label}</button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-center">
            <p className="text-xs text-gray-400">PayPal Fee</p>
            <p className="text-2xl font-bold text-red-400">{fmt(paypalFee)}</p>
          </div>
          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-4 text-center">
            <p className="text-xs text-gray-400">You Receive</p>
            <p className="text-2xl font-bold text-emerald-400">{fmt(youReceive)}</p>
          </div>
        </div>

        {fee.rate > 0 && (
          <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
            <p className="text-sm text-gray-400 mb-1">To receive exactly <span className="text-white font-bold">{fmt(amount)}</span>, charge:</p>
            <p className="text-3xl font-bold text-purple-400">{fmt(chargeForNet)}</p>
          </div>
        )}
      </div>
    </div>
  );
}
