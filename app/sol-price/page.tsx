"use client";
import { useState, useEffect } from "react";

export default function SolPricePage() {
  const [price, setPrice] = useState<number | null>(null);
  const [change, setChange] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [tokenResult, setTokenResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd&include_24hr_change=true")
      .then(r => r.json())
      .then(d => { setPrice(d.solana?.usd); setChange(d.solana?.usd_24h_change); })
      .catch(() => {});
  }, []);

  async function searchToken() {
    if (!search || search.length < 32) return;
    setLoading(true);
    try {
      const res = await fetch(`https://api.jup.ag/price/v2?ids=${search}`);
      const data = await res.json();
      const p = data.data?.[search];
      if (p) setTokenResult({ mint: search, price: p.price, name: p.mintSymbol || search.slice(0,8) });
      else setTokenResult({ error: "Token not found" });
    } catch { setTokenResult({ error: "Failed to fetch" }); }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-3xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-extrabold mb-2 text-center">Solana Price Tracker</h1>
        <p className="text-gray-400 text-center mb-8">Live SOL price + look up any token by mint address.</p>
        <div className="bg-gray-900 rounded-xl p-8 mb-8 text-center">
          <div className="text-sm text-gray-400 mb-1">SOL / USD</div>
          <div className="text-5xl font-extrabold">{price ? `$${price.toFixed(2)}` : "Loading..."}</div>
          {change !== null && (
            <div className={`text-lg font-bold mt-2 ${change >= 0 ? "text-green-400" : "text-red-400"}`}>
              {change >= 0 ? "+" : ""}{change.toFixed(2)}% (24h)
            </div>
          )}
        </div>
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-3">Look Up Any Token</h2>
          <div className="flex gap-2">
            <input type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Paste token mint address..."
              className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500"
              onKeyDown={e => e.key === "Enter" && searchToken()} />
            <button onClick={searchToken} disabled={loading}
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-6 py-3 rounded-lg disabled:opacity-50">
              {loading ? "..." : "Price"}
            </button>
          </div>
          {tokenResult && !tokenResult.error && (
            <div className="bg-gray-900 rounded-xl p-6 mt-4">
              <div className="text-sm text-gray-400">{tokenResult.name}</div>
              <div className="text-3xl font-extrabold">${Number(tokenResult.price) < 0.01 ? Number(tokenResult.price).toExponential(4) : Number(tokenResult.price).toFixed(6)}</div>
              <div className="mt-3 flex gap-2">
                <a href="https://t.me/solscanitbot" className="text-sm bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg font-bold">Buy on Sol Scanner</a>
                <a href={`https://dexscreener.com/solana/${tokenResult.mint}`} target="_blank" className="text-sm bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg font-bold">DexScreener</a>
              </div>
            </div>
          )}
          {tokenResult?.error && <div className="text-red-400 text-sm mt-2">{tokenResult.error}</div>}
        </div>
        <div className="bg-gray-900 rounded-xl p-6 text-center mb-8">
          <p className="text-gray-400 text-sm mb-3">Trade any Solana token with 1-tap buying, copy trading, and DCA</p>
          <a href="https://t.me/solscanitbot" target="_blank" className="inline-block bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-6 rounded-lg">Open Sol Scanner Bot</a>
        </div>
        <div className="text-center text-gray-500 text-sm">
          <a href="/sol-balance" className="text-purple-400 hover:underline">Balance Checker</a>{" | "}
          <a href="/sniper" className="text-purple-400 hover:underline">Sniper Service</a>{" | "}
          <a href="/whale-tracker" className="text-purple-400 hover:underline">Whale Tracker</a>{" | "}
          <a href="/sol-pay" className="text-purple-400 hover:underline">Pay Buttons</a>{" | "}
          <a href="/templates" className="text-purple-400 hover:underline">Bot Templates</a>
        </div>
      </div>
    </div>
  );
}
