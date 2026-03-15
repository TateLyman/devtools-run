"use client";

import { useState } from "react";

const RECIPIENT = "NaTTUfDDQ8U1RBqb9q5rz6vJ22cWrrT5UAsXuxnb2Wr";
const PRICE_SOL = 0.3;

export default function SolDefiToolkitPage() {
  const [showPayment, setShowPayment] = useState(false);
  const [txSig, setTxSig] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState("");

  const [downloadUrl, setDownloadUrl] = useState("");

  async function verifyPayment() {
    if (!txSig.trim()) return;
    setVerifying(true);
    setError("");
    try {
      const res = await fetch("/api/verify-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ txSig: txSig.trim(), product: "sol-defi-toolkit" }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Verification failed.");
        setVerifying(false);
        return;
      }
      setDownloadUrl(`/api/download?token=${data.token}`);
      setVerified(true);
    } catch {
      setError("Verification failed. Please try again.");
    }
    setVerifying(false);
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Solana DeFi Toolkit</h1>
          <p className="text-xl text-gray-400 mb-2">
            10 production-ready Node.js scripts for Solana developers
          </p>
          <p className="text-2xl font-bold text-cyan-400 mb-6">
            Wallet monitor, token scanner, Jupiter swaps, whale tracker &amp; more
          </p>
          <button
            onClick={() => setShowPayment(true)}
            className="inline-block bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition-colors cursor-pointer"
          >
            Get the Toolkit — {PRICE_SOL} SOL
          </button>
          <p className="text-gray-500 text-sm mt-2">Pay with SOL. Instant delivery.</p>
        </div>

        {showPayment && !verified && (
          <div className="bg-gray-900 rounded-xl p-8 mb-12 border border-cyan-800/50">
            <h2 className="text-xl font-bold mb-4 text-center">Pay with SOL</h2>
            <div className="space-y-4">
              <div>
                <p className="text-gray-300 mb-2">Send <strong>{PRICE_SOL} SOL</strong> to:</p>
                <div className="bg-gray-800 rounded-lg p-3 font-mono text-sm break-all select-all border border-gray-700">{RECIPIENT}</div>
              </div>
              <div>
                <p className="text-gray-300 mb-2">After sending, paste your transaction signature:</p>
                <input type="text" value={txSig} onChange={(e) => setTxSig(e.target.value)} placeholder="Paste transaction signature..." className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white font-mono text-sm" />
              </div>
              {error && <p className="text-red-400 text-sm">{error}</p>}
              <button onClick={verifyPayment} disabled={verifying || !txSig.trim()} className="w-full bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-700 text-white font-bold py-3 rounded-lg transition-colors">
                {verifying ? "Verifying..." : "Verify Payment & Get Download"}
              </button>
            </div>
          </div>
        )}

        {verified && (
          <div className="bg-cyan-900/30 border border-cyan-600 rounded-xl p-8 mb-12 text-center">
            <h2 className="text-2xl font-bold mb-4 text-cyan-400">Payment Verified!</h2>
            <p className="text-gray-300 mb-6">Download your toolkit below:</p>
            <a href={downloadUrl} className="inline-block bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition-colors">Download DeFi Toolkit</a>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <Feature title="Wallet Monitor" desc="Real-time transaction monitoring on any Solana wallet. Logs all incoming/outgoing with token amounts and USD values." />
          <Feature title="Token Scanner" desc="Comprehensive safety check: mint authority, freeze authority, top holder concentration, liquidity, metadata. Instant rug pull detection." />
          <Feature title="Jupiter Swap CLI" desc="Execute Jupiter swaps from command line with configurable slippage and Jito MEV protection. Perfect for scripting trades." />
          <Feature title="Pump.fun Monitor" desc="Monitor new Pump.fun token launches in real-time. Filter by market cap, volume, and holder count." />
          <Feature title="Whale Tracker" desc="Follow known whale wallets. Polls every 60s for position changes. Logs all buy/sell activity." />
          <Feature title="Portfolio Tracker" desc="Multi-wallet portfolio overview. Total SOL, all tokens, USD values via Jupiter Price API. Formatted table output." />
          <Feature title="Bulk Transfer" desc="Send SOL or SPL tokens to hundreds of wallets from CSV. Perfect for airdrops, payroll, or prize distribution." />
          <Feature title="Airdrop Checker" desc="Check multiple wallets for token airdrops. Batch checking against known airdrop tokens." />
          <Feature title="NFT Holder Snapshot" desc="Snapshot all holders of any NFT collection. Export to CSV with holder addresses and counts." />
          <Feature title="RPC Benchmark" desc="Test multiple Solana RPC endpoints for latency, throughput, and reliability. Find the fastest provider." />
        </div>

        <div className="bg-gray-900 rounded-xl p-8 mb-12">
          <h2 className="text-2xl font-bold mb-4">What You Get</h2>
          <ul className="space-y-2 text-gray-300">
            <li>10 standalone Node.js scripts — each works independently</li>
            <li>Full documentation with usage examples</li>
            <li>Environment template for easy setup</li>
            <li>Works with any Solana RPC (Helius, QuickNode, etc.)</li>
            <li>Production error handling and logging</li>
          </ul>
        </div>

        <div className="text-center mb-12">
          <button onClick={() => setShowPayment(true)} className="inline-block bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition-colors cursor-pointer">
            Get the DeFi Toolkit — {PRICE_SOL} SOL
          </button>
        </div>

        <div className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 rounded-xl p-6 border border-blue-800/30">
          <h3 className="text-lg font-bold text-white mb-2">Want a full trading bot instead?</h3>
          <p className="text-gray-300 text-sm mb-3">4,100-line Telegram trading bot with 42 commands and 7 revenue streams. Or try the free bot.</p>
          <div className="flex gap-3 flex-wrap">
            <a href="/sol-bot-source" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg text-sm transition-colors">Bot Source — 2 SOL</a>
            <a href="https://t.me/solscanitbot" target="_blank" rel="noopener noreferrer" className="inline-block bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-6 rounded-lg text-sm transition-colors">Try Free Bot</a>
          </div>
        </div>
      </div>
    </div>
  );
}

function Feature({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="bg-gray-900 rounded-xl p-6">
      <h3 className="text-lg font-bold mb-2">{title}</h3>
      <p className="text-gray-400 text-sm">{desc}</p>
    </div>
  );
}
