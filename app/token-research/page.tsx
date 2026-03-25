"use client";
import { useState } from "react";

export default function TokenResearchPage() {
  const [mint, setMint] = useState("");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  async function research() {
    if (!mint || mint.length < 32) return;
    setLoading(true);
    try {
      const [priceRes, infoRes, holdersRes] = await Promise.all([
        fetch(`https://api.jup.ag/price/v2?ids=${mint}`).then(r=>r.json()).catch(()=>null),
        fetch("https://mainnet.helius-rpc.com/?api-key=d56fdc82-51fb-4718-b521-6af1e99b83ea",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({jsonrpc:"2.0",id:1,method:"getAccountInfo",params:[mint,{encoding:"jsonParsed"}]})}).then(r=>r.json()).catch(()=>null),
        fetch("https://mainnet.helius-rpc.com/?api-key=d56fdc82-51fb-4718-b521-6af1e99b83ea",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({jsonrpc:"2.0",id:2,method:"getTokenLargestAccounts",params:[mint]})}).then(r=>r.json()).catch(()=>null),
      ]);

      const price = priceRes?.data?.[mint]?.price;
      const info = infoRes?.result?.value?.data?.parsed?.info;
      const holders = holdersRes?.result?.value || [];
      const totalSupply = holders.reduce((s:number,h:any)=>s+parseFloat(h.uiAmountString||0),0);
      const topPct = totalSupply>0?(parseFloat(holders[0]?.uiAmountString||0)/totalSupply*100):0;

      let score = 100;
      if (info?.mintAuthority) score -= 30;
      if (info?.freezeAuthority) score -= 20;
      if (topPct > 50) score -= 30;
      else if (topPct > 20) score -= 15;
      if (holders.length < 10) score -= 10;

      setData({ price, info, holders: holders.length, topPct, totalSupply, score: Math.max(0, score), mintAuth: !!info?.mintAuthority, freezeAuth: !!info?.freezeAuthority });
    } catch (e: any) { setData({ error: e.message }); }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-3xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-extrabold mb-2 text-center">Token Research</h1>
        <p className="text-gray-400 text-center mb-8">Deep-dive into any Solana token. Price, safety score, holder analysis.</p>
        <div className="flex gap-2 mb-8">
          <input type="text" value={mint} onChange={e=>setMint(e.target.value)} placeholder="Paste token mint address..." onKeyDown={e=>e.key==="Enter"&&research()}
            className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white font-mono text-sm" />
          <button onClick={research} disabled={loading} className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-lg font-bold disabled:opacity-50">{loading?"...":"Research"}</button>
        </div>
        {data && !data.error && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-gray-900 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-green-400">{data.price ? `$${Number(data.price)<0.01?Number(data.price).toExponential(3):Number(data.price).toFixed(6)}` : "N/A"}</div>
                <div className="text-xs text-gray-400">Price</div>
              </div>
              <div className="bg-gray-900 rounded-xl p-4 text-center">
                <div className={`text-2xl font-bold ${data.score>=70?"text-green-400":data.score>=40?"text-yellow-400":"text-red-400"}`}>{data.score}/100</div>
                <div className="text-xs text-gray-400">Safety Score</div>
              </div>
              <div className="bg-gray-900 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-purple-400">{data.holders}</div>
                <div className="text-xs text-gray-400">Top Holders</div>
              </div>
              <div className="bg-gray-900 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold">{data.topPct.toFixed(1)}%</div>
                <div className="text-xs text-gray-400">Top Holder %</div>
              </div>
            </div>
            <div className="bg-gray-900 rounded-xl p-4">
              <h2 className="font-bold mb-2">Security Flags</h2>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm"><span className={data.mintAuth?"text-red-400":"text-green-400"}>{data.mintAuth?"⚠":"✓"}</span>Mint Authority: {data.mintAuth?"Enabled (risky)":"Disabled (safe)"}</div>
                <div className="flex items-center gap-2 text-sm"><span className={data.freezeAuth?"text-red-400":"text-green-400"}>{data.freezeAuth?"⚠":"✓"}</span>Freeze Authority: {data.freezeAuth?"Enabled (risky)":"Disabled (safe)"}</div>
              </div>
            </div>
            <div className="flex gap-2">
              <a href={`https://solscan.io/token/${mint}`} target="_blank" className="flex-1 bg-gray-800 hover:bg-gray-700 py-2 rounded-lg text-center text-sm font-bold">Solscan</a>
              <a href={`https://dexscreener.com/solana/${mint}`} target="_blank" className="flex-1 bg-gray-800 hover:bg-gray-700 py-2 rounded-lg text-center text-sm font-bold">DexScreener</a>
              <a href="https://t.me/solscanitbot" className="flex-1 bg-purple-600 hover:bg-purple-700 py-2 rounded-lg text-center text-sm font-bold">Trade on Bot</a>
            </div>
          </div>
        )}
        {data?.error && <div className="text-red-400 text-center">{data.error}</div>}
        <div className="mt-8 text-center text-gray-500 text-sm">
          <a href="/is-safe" className="text-purple-400 hover:underline">Token Scanner</a>{" | "}
          <a href="/sol-price" className="text-purple-400 hover:underline">Price Tracker</a>{" | "}
          <a href="/portfolio" className="text-purple-400 hover:underline">Portfolio</a>{" | "}
          <a href="/sol-bot" className="text-purple-400 hover:underline">Trading Bot</a>
        </div>
      </div>
    </div>
  );
}
