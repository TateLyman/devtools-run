"use client";
import { useState } from "react";

export default function AirdropCheckerPage() {
  const [address, setAddress] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  async function check() {
    if (!address || address.length < 32) return;
    setLoading(true);
    try {
      // Check token accounts for any airdropped tokens
      const res = await fetch("https://mainnet.helius-rpc.com/?api-key=d56fdc82-51fb-4718-b521-6af1e99b83ea", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "getTokenAccountsByOwner",
          params: [address, { programId: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA" }, { encoding: "jsonParsed" }] }),
      });
      const data = await res.json();
      const tokens = (data.result?.value || [])
        .map((t: any) => ({ mint: t.account.data.parsed.info.mint, amount: t.account.data.parsed.info.tokenAmount.uiAmountString || "0", decimals: t.account.data.parsed.info.tokenAmount.decimals }))
        .filter((t: any) => parseFloat(t.amount) > 0);

      // Check SOL balance
      const balRes = await fetch("https://mainnet.helius-rpc.com/?api-key=d56fdc82-51fb-4718-b521-6af1e99b83ea", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jsonrpc: "2.0", id: 2, method: "getBalance", params: [address] }),
      });
      const balData = await balRes.json();

      setResult({ tokens, sol: (balData.result?.value || 0) / 1e9, total: tokens.length });
    } catch (e: any) { setResult({ error: e.message }); }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-3xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-extrabold mb-2 text-center">Solana Airdrop Checker</h1>
        <p className="text-gray-400 text-center mb-8">Check what tokens are in any Solana wallet. Find unclaimed airdrops and forgotten tokens.</p>
        <div className="flex gap-2 mb-8">
          <input type="text" value={address} onChange={e => setAddress(e.target.value)}
            placeholder="Enter wallet address..." onKeyDown={e => e.key === "Enter" && check()}
            className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500" />
          <button onClick={check} disabled={loading}
            className="bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-3 rounded-lg disabled:opacity-50">
            {loading ? "Scanning..." : "Check"}
          </button>
        </div>
        {result && !result.error && (
          <div className="space-y-4">
            <div className="bg-gray-900 rounded-xl p-6">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div><div className="text-3xl font-extrabold">{result.sol.toFixed(4)}</div><div className="text-sm text-gray-400">SOL Balance</div></div>
                <div><div className="text-3xl font-extrabold">{result.total}</div><div className="text-sm text-gray-400">Token Holdings</div></div>
              </div>
            </div>
            {result.tokens.length > 0 && (
              <div className="bg-gray-900 rounded-xl p-6">
                <h2 className="font-bold mb-3">Tokens Found</h2>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {result.tokens.slice(0, 30).map((t: any, i: number) => (
                    <div key={i} className="flex justify-between items-center py-2 border-b border-gray-800">
                      <a href={`https://solscan.io/token/${t.mint}`} target="_blank" className="font-mono text-sm text-purple-400 hover:underline">
                        {t.mint.slice(0,8)}...{t.mint.slice(-4)}
                      </a>
                      <div className="font-bold text-sm">{parseFloat(t.amount) > 1e6 ? (parseFloat(t.amount)/1e6).toFixed(1)+"M" : t.amount}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="bg-gray-900 rounded-xl p-6 text-center">
              <p className="text-gray-400 text-sm mb-3">Want to sell these tokens or scan them for safety?</p>
              <a href="https://t.me/solscanitbot" target="_blank" className="inline-block bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-6 rounded-lg">Open Sol Scanner Bot</a>
            </div>
          </div>
        )}
        {result?.error && <div className="bg-red-900/30 border border-red-700 rounded-lg p-4 text-red-300">{result.error}</div>}
        <div className="mt-12 text-center text-gray-500 text-sm">
          <a href="/sol-balance" className="text-purple-400 hover:underline">Balance Checker</a>{" | "}
          <a href="/sol-price" className="text-purple-400 hover:underline">Price Tracker</a>{" | "}
          <a href="/sniper" className="text-purple-400 hover:underline">Sniper</a>{" | "}
          <a href="/whale-tracker" className="text-purple-400 hover:underline">Whale Tracker</a>{" | "}
          <a href="/sol-pay" className="text-purple-400 hover:underline">Pay Buttons</a>
        </div>
      </div>
    </div>
  );
}
