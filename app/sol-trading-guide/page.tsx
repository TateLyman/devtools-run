"use client";

import { useState } from "react";

const RECIPIENT = "NaTTUfDDQ8U1RBqb9q5rz6vJ22cWrrT5UAsXuxnb2Wr";
const PRICE_SOL = 0.2;
const SOLANA_RPC = "https://api.mainnet-beta.solana.com";

export default function SolTradingGuidePage() {
  const [showPayment, setShowPayment] = useState(false);
  const [txSig, setTxSig] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState("");

  async function verifyPayment() {
    if (!txSig.trim()) return;
    setVerifying(true);
    setError("");
    try {
      const res = await fetch(SOLANA_RPC, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jsonrpc: "2.0", id: 1, method: "getTransaction",
          params: [txSig.trim(), { encoding: "jsonParsed", maxSupportedTransactionVersion: 0 }],
        }),
      });
      const data = await res.json();
      if (!data.result) { setError("Transaction not found. Wait and retry."); setVerifying(false); return; }
      const instructions = data.result.transaction?.message?.instructions || [];
      let paid = false;
      for (const ix of instructions) {
        if (ix.parsed?.type === "transfer" && ix.parsed?.info?.destination === RECIPIENT) {
          if (ix.parsed.info.lamports >= PRICE_SOL * 1e9 * 0.95) { paid = true; break; }
        }
      }
      if (paid) setVerified(true);
      else setError(`Payment insufficient. Expected ${PRICE_SOL} SOL.`);
    } catch { setError("Verification failed."); }
    setVerifying(false);
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">The Complete Solana Trading Guide</h1>
          <p className="text-xl text-gray-400 mb-2">From zero to profitable trader — 8 chapters, 15,000+ words</p>
          <p className="text-2xl font-bold text-yellow-400 mb-6">Sniping, copy trading, DCA, rug detection, MEV protection</p>
          <button onClick={() => setShowPayment(true)} className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition-colors cursor-pointer">
            Get the Guide — {PRICE_SOL} SOL
          </button>
          <p className="text-gray-500 text-sm mt-2">Instant download after payment verification.</p>
        </div>

        {showPayment && !verified && (
          <div className="bg-gray-900 rounded-xl p-8 mb-12 border border-yellow-800/50">
            <h2 className="text-xl font-bold mb-4 text-center">Pay with SOL</h2>
            <div className="space-y-4">
              <div>
                <p className="text-gray-300 mb-2">Send <strong>{PRICE_SOL} SOL</strong> to:</p>
                <div className="bg-gray-800 rounded-lg p-3 font-mono text-sm break-all select-all border border-gray-700">{RECIPIENT}</div>
              </div>
              <div>
                <p className="text-gray-300 mb-2">Paste your transaction signature:</p>
                <input type="text" value={txSig} onChange={(e) => setTxSig(e.target.value)} placeholder="Transaction signature..." className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white font-mono text-sm" />
              </div>
              {error && <p className="text-red-400 text-sm">{error}</p>}
              <button onClick={verifyPayment} disabled={verifying || !txSig.trim()} className="w-full bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-700 text-white font-bold py-3 rounded-lg transition-colors">
                {verifying ? "Verifying..." : "Verify & Download"}
              </button>
            </div>
          </div>
        )}

        {verified && (
          <div className="bg-yellow-900/30 border border-yellow-600 rounded-xl p-8 mb-12 text-center">
            <h2 className="text-2xl font-bold mb-4 text-yellow-400">Payment Verified!</h2>
            <a href="https://github.com/TateLyman/sol-trading-guide/archive/refs/heads/main.zip" className="inline-block bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition-colors">Download Trading Guide</a>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <div className="bg-gray-900 rounded-xl p-6">
            <h3 className="text-lg font-bold mb-2">Ch 1-2: Fundamentals</h3>
            <p className="text-gray-400 text-sm">Solana basics, wallet setup, understanding tokens, token lifecycle, where to find opportunities</p>
          </div>
          <div className="bg-gray-900 rounded-xl p-6">
            <h3 className="text-lg font-bold mb-2">Ch 3: Trading Basics</h3>
            <p className="text-gray-400 text-sm">Jupiter DEX, slippage, gas fees, reading charts, executing your first trade</p>
          </div>
          <div className="bg-gray-900 rounded-xl p-6">
            <h3 className="text-lg font-bold mb-2">Ch 4: Advanced Strategies</h3>
            <p className="text-gray-400 text-sm">Sniping launches, copy trading whales, DCA, grid trading, limit orders, auto take-profit</p>
          </div>
          <div className="bg-gray-900 rounded-xl p-6">
            <h3 className="text-lg font-bold mb-2">Ch 5: Risk Management</h3>
            <p className="text-gray-400 text-sm">Position sizing, rug pull detection (5 red flags), managing drawdowns, when to exit</p>
          </div>
          <div className="bg-gray-900 rounded-xl p-6">
            <h3 className="text-lg font-bold mb-2">Ch 6-7: Tools &amp; MEV</h3>
            <p className="text-gray-400 text-sm">DexScreener, Birdeye, trading bots, MEV protection, why Jito matters</p>
          </div>
          <div className="bg-gray-900 rounded-xl p-6">
            <h3 className="text-lg font-bold mb-2">Ch 8: Building Your System</h3>
            <p className="text-gray-400 text-sm">Daily routine, alerts &amp; automation, P&amp;L tracking, scaling your strategy</p>
          </div>
        </div>

        <div className="bg-gray-900 rounded-xl p-8 mb-12">
          <h2 className="text-2xl font-bold mb-4">Who This Is For</h2>
          <ul className="space-y-2 text-gray-300">
            <li>Complete beginners who want to start trading Solana tokens</li>
            <li>Traders moving from CEX to on-chain DEX trading</li>
            <li>Anyone who keeps losing money to rugs and MEV</li>
            <li>People who want a structured system, not random tips</li>
          </ul>
        </div>

        <div className="text-center mb-12">
          <button onClick={() => setShowPayment(true)} className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition-colors cursor-pointer">
            Get the Guide — {PRICE_SOL} SOL
          </button>
        </div>

        <div className="bg-gradient-to-r from-blue-900/50 to-cyan-900/50 rounded-xl p-6 border border-blue-800/30">
          <h3 className="text-lg font-bold text-white mb-2">Ready to start trading?</h3>
          <p className="text-gray-300 text-sm mb-3">Try our free Telegram bot with 44+ commands — buy, sell, snipe, copy trade, DCA, and more.</p>
          <div className="flex gap-3 flex-wrap">
            <a href="https://t.me/solscanitbot" target="_blank" rel="noopener noreferrer" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg text-sm transition-colors">Open @solscanitbot</a>
            <a href="/sol-defi-toolkit" className="inline-block bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-6 rounded-lg text-sm transition-colors">DeFi Toolkit — 0.3 SOL</a>
          </div>
        </div>
      </div>
    </div>
  );
}
