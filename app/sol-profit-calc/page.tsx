"use client";
import { useState, useEffect } from "react";
export default function SolProfitCalc() {
  const [buyPrice, setBuyPrice] = useState("100");
  const [sellPrice, setSellPrice] = useState("200");
  const [amount, setAmount] = useState("1");
  const [solPrice, setSolPrice] = useState(150);
  useEffect(() => { fetch("https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd").then(r=>r.json()).then(d=>setSolPrice(d.solana?.usd||150)).catch(()=>{}); }, []);
  const buy = parseFloat(buyPrice)||0, sell = parseFloat(sellPrice)||0, amt = parseFloat(amount)||0;
  const invested = buy * amt;
  const value = sell * amt;
  const profit = value - invested;
  const pct = invested > 0 ? (profit / invested * 100) : 0;
  const profitSol = profit / solPrice;
  return (
    <div className="space-y-6">
      <section className="text-center"><h1 className="text-4xl font-bold mb-2">SOL Profit Calculator</h1><p className="text-[var(--text-secondary)]">SOL price: ${solPrice.toFixed(2)}</p></section>
      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-6 grid gap-4 md:grid-cols-3">
        <div><label className="text-xs text-[var(--text-secondary)]">Buy Price ($)</label><input value={buyPrice} onChange={e=>setBuyPrice(e.target.value)} type="number" className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg px-3 py-2 font-mono" /></div>
        <div><label className="text-xs text-[var(--text-secondary)]">Sell Price ($)</label><input value={sellPrice} onChange={e=>setSellPrice(e.target.value)} type="number" className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg px-3 py-2 font-mono" /></div>
        <div><label className="text-xs text-[var(--text-secondary)]">Amount (SOL)</label><input value={amount} onChange={e=>setAmount(e.target.value)} type="number" className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg px-3 py-2 font-mono" /></div>
      </div>
      <div className="grid gap-4 md:grid-cols-4">
        <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-4 text-center"><div className="text-xs text-[var(--text-secondary)]">Invested</div><div className="text-xl font-bold">${invested.toFixed(2)}</div></div>
        <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-4 text-center"><div className="text-xs text-[var(--text-secondary)]">Current Value</div><div className="text-xl font-bold">${value.toFixed(2)}</div></div>
        <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-4 text-center"><div className="text-xs text-[var(--text-secondary)]">Profit/Loss</div><div className={`text-xl font-bold ${profit>=0?"text-emerald-400":"text-red-400"}`}>${profit>=0?"+":""}${profit.toFixed(2)}</div></div>
        <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-4 text-center"><div className="text-xs text-[var(--text-secondary)]">ROI</div><div className={`text-xl font-bold ${pct>=0?"text-emerald-400":"text-red-400"}`}>{pct>=0?"+":""}{pct.toFixed(1)}%</div></div>
      </div>
      <div className="text-center text-sm text-[var(--text-secondary)]">Profit in SOL: {profitSol>=0?"+":""}{profitSol.toFixed(4)} SOL</div>
      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-4 text-center text-sm">
        <p>Try our Solana trading bot: <a href="https://t.me/solscanitbot" className="text-blue-400">@solscanitbot</a></p>
        <p className="text-[var(--text-secondary)]">Token scanner, sniper, copy-trader, portfolio tracker — all in Telegram</p>
      </div>
    </div>
  );
}
