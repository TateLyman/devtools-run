"use client";
import { useState } from "react";

export default function PortfolioPage() {
  const [address, setAddress] = useState("");
  const [portfolio, setPortfolio] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  async function check() {
    if (!address || address.length < 32) return;
    setLoading(true);
    try {
      const [balRes, tokRes, priceRes] = await Promise.all([
        fetch("https://mainnet.helius-rpc.com/?api-key=d56fdc82-51fb-4718-b521-6af1e99b83ea", {
          method: "POST", headers: {"Content-Type": "application/json"},
          body: JSON.stringify({jsonrpc:"2.0",id:1,method:"getBalance",params:[address]}),
        }).then(r => r.json()),
        fetch("https://mainnet.helius-rpc.com/?api-key=d56fdc82-51fb-4718-b521-6af1e99b83ea", {
          method: "POST", headers: {"Content-Type": "application/json"},
          body: JSON.stringify({jsonrpc:"2.0",id:2,method:"getTokenAccountsByOwner",params:[address,{programId:"TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"},{encoding:"jsonParsed"}]}),
        }).then(r => r.json()),
        fetch("https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd").then(r => r.json()).catch(() => ({solana:{usd:150}})),
      ]);
      
      const solBalance = (balRes.result?.value || 0) / 1e9;
      const solPrice = priceRes.solana?.usd || 150;
      const solValue = solBalance * solPrice;
      
      const tokens = (tokRes.result?.value || [])
        .map((t: any) => ({
          mint: t.account.data.parsed.info.mint,
          amount: parseFloat(t.account.data.parsed.info.tokenAmount.uiAmountString || "0"),
          decimals: t.account.data.parsed.info.tokenAmount.decimals,
        }))
        .filter((t: any) => t.amount > 0)
        .sort((a: any, b: any) => b.amount - a.amount);

      setPortfolio({ sol: solBalance, solValue, solPrice, tokens, totalTokens: tokens.length });
    } catch (e: any) {
      setPortfolio({ error: e.message });
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-3xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-extrabold mb-2 text-center">Solana Portfolio Tracker</h1>
        <p className="text-gray-400 text-center mb-8">View your complete Solana portfolio — SOL balance and all token holdings.</p>
        
        <div className="flex gap-2 mb-8">
          <input type="text" value={address} onChange={e => setAddress(e.target.value)}
            placeholder="Enter Solana wallet address..." onKeyDown={e => e.key === "Enter" && check()}
            className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500" />
          <button onClick={check} disabled={loading}
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-6 py-3 rounded-lg disabled:opacity-50">
            {loading ? "Loading..." : "Track"}
          </button>
        </div>

        {portfolio && !portfolio.error && (
          <div className="space-y-4">
            <div className="bg-gray-900 rounded-xl p-6">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-3xl font-extrabold">{portfolio.sol.toFixed(4)}</div>
                  <div className="text-sm text-gray-400">SOL</div>
                </div>
                <div>
                  <div className="text-3xl font-extrabold text-green-400">${portfolio.solValue.toFixed(2)}</div>
                  <div className="text-sm text-gray-400">USD Value</div>
                </div>
                <div>
                  <div className="text-3xl font-extrabold text-purple-400">{portfolio.totalTokens}</div>
                  <div className="text-sm text-gray-400">Tokens</div>
                </div>
              </div>
            </div>

            {portfolio.tokens.length > 0 && (
              <div className="bg-gray-900 rounded-xl p-6">
                <h2 className="font-bold mb-3">Token Holdings</h2>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {portfolio.tokens.slice(0, 25).map((t: any, i: number) => (
                    <div key={i} className="flex justify-between items-center py-2 border-b border-gray-800 last:border-0">
                      <a href={`https://solscan.io/token/${t.mint}`} target="_blank"
                        className="font-mono text-sm text-purple-400 hover:underline">
                        {t.mint.slice(0, 8)}...{t.mint.slice(-4)}
                      </a>
                      <div className="font-bold text-sm">
                        {t.amount > 1e9 ? (t.amount/1e9).toFixed(2)+"B" : t.amount > 1e6 ? (t.amount/1e6).toFixed(2)+"M" : t.amount > 1e3 ? (t.amount/1e3).toFixed(1)+"K" : t.amount.toFixed(t.decimals > 4 ? 4 : 2)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-gray-900 rounded-xl p-6 text-center">
              <p className="text-gray-400 text-sm mb-3">Want real-time PnL tracking, trade execution, and auto-sell alerts?</p>
              <a href="https://t.me/solscanitbot" target="_blank"
                className="inline-block bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-6 rounded-lg">
                Open Sol Scanner Bot
              </a>
            </div>
          </div>
        )}

        {portfolio?.error && <div className="bg-red-900/30 border border-red-700 rounded-lg p-4 text-red-300">{portfolio.error}</div>}

        <div className="mt-12 text-center text-gray-500 text-sm">
          <a href="/sol-balance" className="text-purple-400 hover:underline">Balance</a>{" | "}
          <a href="/sol-price" className="text-purple-400 hover:underline">Price</a>{" | "}
          <a href="/airdrop-checker" className="text-purple-400 hover:underline">Airdrops</a>{" | "}
          <a href="/nft-checker" className="text-purple-400 hover:underline">NFTs</a>{" | "}
          <a href="/whale-tracker" className="text-purple-400 hover:underline">Whale Tracker</a>{" | "}
          <a href="/launch-token" className="text-purple-400 hover:underline">Launch Token</a>
        </div>
      </div>
    </div>
  );
}
