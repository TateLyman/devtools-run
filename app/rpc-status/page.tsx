"use client";
import { useState, useEffect } from "react";

const RPCS = [
  { name: "Solana Mainnet", url: "https://api.mainnet-beta.solana.com", free: true },
  { name: "Helius", url: "https://mainnet.helius-rpc.com/?api-key=d56fdc82-51fb-4718-b521-6af1e99b83ea", free: false },
  { name: "Solana Devnet", url: "https://api.devnet.solana.com", free: true },
];

export default function RPCStatusPage() {
  const [results, setResults] = useState<any[]>([]);
  const [checking, setChecking] = useState(false);

  async function checkAll() {
    setChecking(true);
    const checks = await Promise.all(RPCS.map(async (rpc) => {
      const start = Date.now();
      try {
        const res = await fetch(rpc.url, {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "getSlot" }),
          signal: AbortSignal.timeout(5000),
        });
        const data = await res.json();
        const latency = Date.now() - start;
        return { ...rpc, status: "up", latency, slot: data.result };
      } catch {
        return { ...rpc, status: "down", latency: Date.now() - start };
      }
    }));
    setResults(checks);
    setChecking(false);
  }

  useEffect(() => { checkAll(); }, []);

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-3xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-extrabold mb-2 text-center">Solana RPC Status</h1>
        <p className="text-gray-400 text-center mb-8">Real-time health check of Solana RPC endpoints.</p>
        <button onClick={checkAll} disabled={checking}
          className="block mx-auto mb-8 bg-purple-600 hover:bg-purple-700 text-white font-bold px-6 py-2 rounded-lg disabled:opacity-50">
          {checking ? "Checking..." : "Refresh"}
        </button>
        <div className="space-y-3 mb-8">
          {results.map((r, i) => (
            <div key={i} className="bg-gray-900 rounded-xl p-5 flex items-center justify-between">
              <div>
                <div className="font-bold flex items-center gap-2">
                  <span className={`w-3 h-3 rounded-full ${r.status === "up" ? "bg-green-400" : "bg-red-400"}`}></span>
                  {r.name}
                  {r.free && <span className="text-xs bg-gray-700 px-2 py-0.5 rounded">Free</span>}
                </div>
                {r.slot && <div className="text-xs text-gray-500 mt-1">Slot: {r.slot.toLocaleString()}</div>}
              </div>
              <div className="text-right">
                <div className={`font-bold ${r.latency < 500 ? "text-green-400" : r.latency < 1000 ? "text-yellow-400" : "text-red-400"}`}>
                  {r.latency}ms
                </div>
                <div className="text-xs text-gray-500">{r.status === "up" ? "Operational" : "Down"}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="bg-gray-900 rounded-xl p-6 text-center mb-8">
          <p className="text-gray-400 text-sm mb-3">Our trading bot uses Helius RPC for sub-500ms trade execution</p>
          <a href="https://t.me/solscanitbot" target="_blank" className="inline-block bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-6 rounded-lg">Try Sol Scanner Bot</a>
        </div>
        <div className="text-center text-gray-500 text-sm">
          <a href="/sol-price" className="text-purple-400 hover:underline">Price</a>{" | "}
          <a href="/sol-balance" className="text-purple-400 hover:underline">Balance</a>{" | "}
          <a href="/staking-calc" className="text-purple-400 hover:underline">Staking</a>{" | "}
          <a href="/sol-pay" className="text-purple-400 hover:underline">Payments</a>{" | "}
          <a href="/sniper" className="text-purple-400 hover:underline">Sniper</a>
        </div>
      </div>
    </div>
  );
}
