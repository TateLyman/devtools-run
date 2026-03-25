"use client";
import { useState } from "react";

export default function TxHistoryPage() {
  const [address, setAddress] = useState("");
  const [txs, setTxs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  async function check() {
    if (!address || address.length < 32) return;
    setLoading(true);
    try {
      const res = await fetch("https://mainnet.helius-rpc.com/?api-key=d56fdc82-51fb-4718-b521-6af1e99b83ea", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "getSignaturesForAddress", params: [address, { limit: 20 }] }),
      });
      const data = await res.json();
      setTxs(data.result || []);
    } catch { setTxs([]); }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-extrabold mb-2 text-center">Solana Transaction History</h1>
        <p className="text-gray-400 text-center mb-8">View recent transactions for any Solana wallet.</p>
        <div className="flex gap-2 mb-8">
          <input type="text" value={address} onChange={e => setAddress(e.target.value)}
            placeholder="Enter wallet address..." onKeyDown={e => e.key === "Enter" && check()}
            className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500" />
          <button onClick={check} disabled={loading}
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-6 py-3 rounded-lg disabled:opacity-50">
            {loading ? "Loading..." : "View TXs"}
          </button>
        </div>
        {txs.length > 0 && (
          <div className="bg-gray-900 rounded-xl p-6">
            <h2 className="font-bold mb-3">Last {txs.length} Transactions</h2>
            <div className="space-y-2">
              {txs.map((tx: any, i: number) => (
                <a key={i} href={`https://solscan.io/tx/${tx.signature}`} target="_blank"
                  className="flex justify-between items-center py-3 px-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors">
                  <div>
                    <div className="font-mono text-sm text-purple-400">{tx.signature.slice(0,16)}...{tx.signature.slice(-8)}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      {tx.blockTime ? new Date(tx.blockTime * 1000).toLocaleString() : "Pending"}
                      {tx.err ? " | Failed" : " | Success"}
                    </div>
                  </div>
                  <div className="text-xs text-gray-400">View</div>
                </a>
              ))}
            </div>
          </div>
        )}
        <div className="mt-8 bg-gray-900 rounded-xl p-6 text-center">
          <p className="text-gray-400 text-sm mb-3">Trade tokens and track your portfolio in one place</p>
          <a href="https://t.me/solscanitbot" target="_blank" className="inline-block bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-6 rounded-lg">Open Sol Scanner Bot</a>
        </div>
        <div className="mt-8 text-center text-gray-500 text-sm">
          <a href="/sol-balance" className="text-purple-400 hover:underline">Balance</a>{" | "}
          <a href="/sol-price" className="text-purple-400 hover:underline">Price</a>{" | "}
          <a href="/airdrop-checker" className="text-purple-400 hover:underline">Airdrops</a>{" | "}
          <a href="/nft-checker" className="text-purple-400 hover:underline">NFTs</a>{" | "}
          <a href="/whale-tracker" className="text-purple-400 hover:underline">Whales</a>{" | "}
          <a href="/templates" className="text-purple-400 hover:underline">Templates</a>
        </div>
      </div>
    </div>
  );
}
