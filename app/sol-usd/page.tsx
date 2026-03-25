"use client";
import { useState, useEffect } from "react";

export default function SolUsdPage() {
  const [solAmount, setSolAmount] = useState("1");
  const [price, setPrice] = useState(150);
  const [change, setChange] = useState(0);

  useEffect(() => {
    fetch("https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd&include_24hr_change=true")
      .then(r => r.json()).then(d => { if(d.solana){setPrice(d.solana.usd);setChange(d.solana.usd_24h_change||0);} }).catch(() => {});
  }, []);

  const sol = parseFloat(solAmount) || 0;
  const usd = sol * price;

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-3xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-extrabold mb-2 text-center">SOL to USD Converter</h1>
        <p className="text-gray-400 text-center mb-8">Convert Solana (SOL) to US Dollars at the live market rate.</p>
        <div className="bg-gray-900 rounded-xl p-8 mb-6">
          <div className="grid grid-cols-2 gap-4 items-end mb-6">
            <div>
              <label className="text-sm text-gray-400 block mb-2">SOL</label>
              <input type="number" value={solAmount} onChange={e => setSolAmount(e.target.value)} step="0.01"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white text-2xl font-bold" />
            </div>
            <div>
              <label className="text-sm text-gray-400 block mb-2">USD</label>
              <div className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-2xl font-bold text-green-400">
                ${usd.toFixed(2)}
              </div>
            </div>
          </div>
          <div className="text-center">
            <div className="text-lg">1 SOL = <span className="font-bold">${price.toFixed(2)}</span></div>
            <div className={`text-sm ${change >= 0 ? "text-green-400" : "text-red-400"}`}>
              {change >= 0 ? "+" : ""}{change.toFixed(2)}% (24h)
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {[0.1, 0.5, 1, 5, 10, 50, 100, 1000].map(v => (
            <button key={v} onClick={() => setSolAmount(String(v))}
              className="bg-gray-800 hover:bg-gray-700 rounded-lg py-2 text-sm font-bold transition-colors">
              {v} SOL = ${(v * price).toFixed(0)}
            </button>
          ))}
        </div>
        <div className="bg-gray-900 rounded-xl p-6 text-center mb-8">
          <p className="text-gray-400 text-sm mb-3">Buy and sell SOL tokens on Telegram with 1-tap trading</p>
          <a href="https://t.me/solscanitbot" target="_blank" className="inline-block bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-6 rounded-lg">Trade SOL Now</a>
        </div>
        <div className="text-center text-gray-500 text-sm">
          <a href="/sol-price" className="text-purple-400 hover:underline">Price Tracker</a>{" | "}
          <a href="/staking-calc" className="text-purple-400 hover:underline">Staking Calc</a>{" | "}
          <a href="/sol-balance" className="text-purple-400 hover:underline">Balance Checker</a>{" | "}
          <a href="/airdrop-checker" className="text-purple-400 hover:underline">Airdrops</a>{" | "}
          <a href="/sol-pay" className="text-purple-400 hover:underline">Payments</a>
        </div>
      </div>
    </div>
  );
}
