"use client";

import { useState } from "react";

export default function SolBalancePage() {
  const [address, setAddress] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  async function check() {
    if (!address || address.length < 32) return;
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("https://mainnet.helius-rpc.com/?api-key=d56fdc82-51fb-4718-b521-6af1e99b83ea", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jsonrpc: "2.0", id: 1,
          method: "getBalance",
          params: [address],
        }),
      });
      const data = await res.json();
      const sol = (data.result?.value || 0) / 1e9;

      // Get token accounts
      const tokRes = await fetch("https://mainnet.helius-rpc.com/?api-key=d56fdc82-51fb-4718-b521-6af1e99b83ea", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jsonrpc: "2.0", id: 2,
          method: "getTokenAccountsByOwner",
          params: [address, { programId: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA" }, { encoding: "jsonParsed" }],
        }),
      });
      const tokData = await tokRes.json();
      const tokens = (tokData.result?.value || [])
        .map((t: any) => ({
          mint: t.account.data.parsed.info.mint,
          amount: t.account.data.parsed.info.tokenAmount.uiAmountString || "0",
        }))
        .filter((t: any) => parseFloat(t.amount) > 0)
        .sort((a: any, b: any) => parseFloat(b.amount) - parseFloat(a.amount))
        .slice(0, 20);

      setResult({ sol, tokens, address });
    } catch (e: any) {
      setResult({ error: e.message });
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-3xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-extrabold mb-2 text-center">Solana Wallet Balance Checker</h1>
        <p className="text-gray-400 text-center mb-8">Check any Solana wallet&apos;s SOL balance and token holdings instantly.</p>

        <div className="flex gap-2 mb-8">
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter Solana wallet address..."
            className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500"
            onKeyDown={(e) => e.key === "Enter" && check()}
          />
          <button
            onClick={check}
            disabled={loading}
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-6 py-3 rounded-lg transition-colors disabled:opacity-50"
          >
            {loading ? "..." : "Check"}
          </button>
        </div>

        {result?.error && (
          <div className="bg-red-900/30 border border-red-700 rounded-lg p-4 text-red-300">
            {result.error}
          </div>
        )}

        {result && !result.error && (
          <div className="space-y-4">
            <div className="bg-gray-900 rounded-xl p-6">
              <div className="text-sm text-gray-400 mb-1">SOL Balance</div>
              <div className="text-3xl font-extrabold">{result.sol.toFixed(4)} SOL</div>
              <div className="text-gray-400 text-sm mt-1">
                ~${(result.sol * 150).toFixed(2)} USD
              </div>
              <a
                href={`https://solscan.io/account/${result.address}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-400 text-sm hover:underline mt-2 inline-block"
              >
                View on Solscan
              </a>
            </div>

            {result.tokens.length > 0 && (
              <div className="bg-gray-900 rounded-xl p-6">
                <div className="text-sm text-gray-400 mb-3">Token Holdings ({result.tokens.length})</div>
                <div className="space-y-2">
                  {result.tokens.map((t: any, i: number) => (
                    <div key={i} className="flex justify-between items-center py-2 border-b border-gray-800 last:border-0">
                      <div className="font-mono text-sm text-gray-300">
                        {t.mint.slice(0, 6)}...{t.mint.slice(-4)}
                      </div>
                      <div className="font-bold">{t.amount}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-gray-900 rounded-xl p-6 text-center">
              <p className="text-gray-400 text-sm mb-3">Want to trade these tokens?</p>
              <a
                href="https://t.me/solscanitbot"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-6 rounded-lg transition-colors"
              >
                Open Sol Scanner Bot
              </a>
            </div>
          </div>
        )}

        <div className="mt-12 text-center text-gray-500 text-sm">
          <p>Free, unlimited checks. Powered by Helius RPC.</p>
          <p className="mt-2">
            <a href="/sol-bot" className="text-purple-400 hover:underline">Trading Bot</a>
            {" | "}
            <a href="/sniper" className="text-purple-400 hover:underline">Sniper Service</a>
            {" | "}
            <a href="/whale-tracker" className="text-purple-400 hover:underline">Whale Tracker</a>
            {" | "}
            <a href="/sol-pay" className="text-purple-400 hover:underline">Pay Buttons</a>
            {" | "}
            <a href="/templates" className="text-purple-400 hover:underline">Bot Templates</a>
          </p>
        </div>
      </div>
    </div>
  );
}
