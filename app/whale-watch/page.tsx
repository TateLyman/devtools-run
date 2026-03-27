"use client";
import { useState } from "react";
export default function WhaleWatch() {
  const [wallet, setWallet] = useState("");
  const [txns, setTxns] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const track = async () => {
    if (!wallet) return;
    setLoading(true);
    try {
      const res = await fetch(`https://api.helius.xyz/v0/addresses/${wallet}/transactions?api-key=d56fdc82-51fb-4718-b521-6af1e99b83ea&limit=10`);
      const data = await res.json();
      setTxns(Array.isArray(data) ? data.slice(0, 10) : []);
    } catch { setTxns([]); }
    setLoading(false);
  };
  return (
    <div className="space-y-6">
      <section className="text-center"><h1 className="text-4xl font-bold mb-2">Solana Whale Tracker</h1><p className="text-[var(--text-secondary)]">Monitor any wallet's recent activity</p></section>
      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-4 flex gap-2">
        <input value={wallet} onChange={e=>setWallet(e.target.value)} placeholder="Paste Solana wallet address..." className="flex-1 bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg px-3 py-2 font-mono text-sm" />
        <button onClick={track} disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-bold">{loading?"...":"Track"}</button>
      </div>
      {txns.length > 0 && (
        <div className="space-y-2">
          <div className="text-sm text-[var(--text-secondary)]">{txns.length} recent transactions</div>
          {txns.map((tx, i) => (
            <div key={i} className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-3">
              <div className="flex justify-between text-xs">
                <span className="font-mono text-blue-400">{tx.signature?.slice(0,20)}...</span>
                <span className="text-[var(--text-secondary)]">{tx.timestamp ? new Date(tx.timestamp*1000).toLocaleString() : "?"}</span>
              </div>
              <div className="text-xs text-[var(--text-secondary)] mt-1">Type: {tx.type || "unknown"} | Fee: {tx.fee ? (tx.fee/1e9).toFixed(6) : "?"} SOL</div>
            </div>
          ))}
        </div>
      )}
      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-4 text-center text-sm">
        <p>Want auto-alerts when whales make moves?</p>
        <a href="https://t.me/solscanitbot" className="text-blue-400 font-bold">Try @solscanitbot</a>
        <p className="text-[var(--text-secondary)] text-xs">Copy-trade any wallet automatically. Set alerts for large transactions.</p>
      </div>
    </div>
  );
}
