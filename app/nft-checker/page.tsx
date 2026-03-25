"use client";
import { useState } from "react";

export default function NFTCheckerPage() {
  const [address, setAddress] = useState("");
  const [nfts, setNfts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [checked, setChecked] = useState(false);

  async function check() {
    if (!address || address.length < 32) return;
    setLoading(true);
    setChecked(false);
    try {
      const res = await fetch("https://mainnet.helius-rpc.com/?api-key=d56fdc82-51fb-4718-b521-6af1e99b83ea", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "getTokenAccountsByOwner",
          params: [address, { programId: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA" }, { encoding: "jsonParsed" }] }),
      });
      const data = await res.json();
      const nftLike = (data.result?.value || [])
        .filter((t: any) => {
          const info = t.account.data.parsed.info.tokenAmount;
          return info.decimals === 0 && info.uiAmount === 1;
        })
        .map((t: any) => ({ mint: t.account.data.parsed.info.mint }));
      setNfts(nftLike);
      setChecked(true);
    } catch { setNfts([]); setChecked(true); }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-3xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-extrabold mb-2 text-center">Solana NFT Checker</h1>
        <p className="text-gray-400 text-center mb-8">See all NFTs in any Solana wallet. Find rare holdings and check collections.</p>
        <div className="flex gap-2 mb-8">
          <input type="text" value={address} onChange={e => setAddress(e.target.value)}
            placeholder="Enter wallet address..." onKeyDown={e => e.key === "Enter" && check()}
            className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500" />
          <button onClick={check} disabled={loading}
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-6 py-3 rounded-lg disabled:opacity-50">
            {loading ? "Scanning..." : "Check NFTs"}
          </button>
        </div>
        {checked && (
          <div className="bg-gray-900 rounded-xl p-6 mb-6">
            <h2 className="font-bold mb-3">Found {nfts.length} NFT{nfts.length !== 1 ? "s" : ""}</h2>
            {nfts.length === 0 ? (
              <p className="text-gray-400 text-sm">No NFTs found in this wallet.</p>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {nfts.slice(0, 30).map((n, i) => (
                  <a key={i} href={`https://solscan.io/token/${n.mint}`} target="_blank"
                    className="bg-gray-800 rounded-lg p-3 hover:bg-gray-700 transition-colors">
                    <div className="font-mono text-xs text-purple-400">{n.mint.slice(0,8)}...{n.mint.slice(-4)}</div>
                    <div className="text-xs text-gray-500 mt-1">View on Solscan</div>
                  </a>
                ))}
              </div>
            )}
          </div>
        )}
        <div className="bg-gray-900 rounded-xl p-6 text-center mb-8">
          <p className="text-gray-400 text-sm mb-3">Track any wallet and get alerts when they buy or sell NFTs</p>
          <a href="https://t.me/solscanitbot" target="_blank" className="inline-block bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-6 rounded-lg">Open Sol Scanner Bot</a>
        </div>
        <div className="text-center text-gray-500 text-sm">
          <a href="/sol-balance" className="text-purple-400 hover:underline">Balance</a>{" | "}
          <a href="/sol-price" className="text-purple-400 hover:underline">Price</a>{" | "}
          <a href="/airdrop-checker" className="text-purple-400 hover:underline">Airdrops</a>{" | "}
          <a href="/whale-tracker" className="text-purple-400 hover:underline">Whales</a>{" | "}
          <a href="/sol-pay" className="text-purple-400 hover:underline">Payments</a>{" | "}
          <a href="/templates" className="text-purple-400 hover:underline">Templates</a>
        </div>
      </div>
    </div>
  );
}
