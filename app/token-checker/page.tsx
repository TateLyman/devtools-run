"use client";
import { useState } from "react";
export default function TokenChecker() {
  const [address, setAddress] = useState("");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const check = async () => {
    if (!address) return;
    setLoading(true);
    try {
      const res = await fetch(`https://api.dexscreener.com/latest/dex/tokens/${address}`);
      const d = await res.json();
      setData(d.pairs?.[0] || null);
    } catch { setData(null); }
    setLoading(false);
  };
  return (
    <div className="space-y-6">
      <section className="text-center"><h1 className="text-4xl font-bold mb-2">Solana Token Checker</h1><p className="text-[var(--text-secondary)]">Check any token before you buy</p></section>
      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-4 flex gap-2">
        <input value={address} onChange={e=>setAddress(e.target.value)} placeholder="Paste token address..." className="flex-1 bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg px-3 py-2 font-mono text-sm" />
        <button onClick={check} disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-bold">{loading ? "..." : "Check"}</button>
      </div>
      {data && (
        <div className="space-y-3">
          <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-blue-500/20 rounded-xl p-6 text-center">
            <div className="text-2xl font-bold">{data.baseToken?.name} ({data.baseToken?.symbol})</div>
            <div className="text-3xl font-bold text-blue-400 mt-1">${parseFloat(data.priceUsd || 0).toFixed(8)}</div>
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            {[
              ["24h Change", `${data.priceChange?.h24 || 0}%`, parseFloat(data.priceChange?.h24||0) >= 0 ? "text-emerald-400" : "text-red-400"],
              ["Liquidity", `$${parseInt(data.liquidity?.usd||0).toLocaleString()}`, parseInt(data.liquidity?.usd||0) > 10000 ? "text-emerald-400" : "text-red-400"],
              ["Volume 24h", `$${parseInt(data.volume?.h24||0).toLocaleString()}`, "text-blue-400"],
              ["Market Cap", data.marketCap ? `$${parseInt(data.marketCap).toLocaleString()}` : "N/A", "text-blue-400"],
              ["Buys/Sells 24h", `${data.txns?.h24?.buys||0}/${data.txns?.h24?.sells||0}`, "text-[var(--text-secondary)]"],
              ["Pair Age", data.pairCreatedAt ? `${Math.floor((Date.now()-data.pairCreatedAt)/86400000)}d` : "?", "text-[var(--text-secondary)]"],
            ].map(([l,v,c]) => (
              <div key={l as string} className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-3 text-center">
                <div className="text-xs text-[var(--text-secondary)]">{l as string}</div>
                <div className={`text-lg font-bold ${c}`}>{v as string}</div>
              </div>
            ))}
          </div>
          <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-4 text-center text-sm">
            <p>Want deeper analysis? Use our full scanner bot:</p>
            <a href="https://t.me/solscanitbot" className="text-blue-400 font-bold">@solscanitbot on Telegram</a>
            <p className="text-[var(--text-secondary)] text-xs mt-1">Honeypot detection, holder analysis, risk scoring, and more</p>
          </div>
        </div>
      )}
      {!data && !loading && address && <div className="text-center text-red-400">Token not found on DexScreener</div>}
    </div>
  );
}
