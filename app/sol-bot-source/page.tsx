"use client";

import { useState } from "react";

const RECIPIENT = "NaTTUfDDQ8U1RBqb9q5rz6vJ22cWrrT5UAsXuxnb2Wr";
const PRICE_SOL = 2;
const PRICE_USD = 299;

export default function SolBotSourcePage() {
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
        body: JSON.stringify({ txSig: txSig.trim(), product: "sol-bot-source" }),
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
          <h1 className="text-4xl font-bold mb-4">
            Solana Telegram Trading Bot — Full Source Code
          </h1>
          <p className="text-xl text-gray-400 mb-2">
            4,100+ lines of production Node.js. 42 commands. 12 background workers. Deploy your own bot today.
          </p>
          <p className="text-2xl font-bold text-blue-400 mb-6">
            Running live as @solscanitbot with real users
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={() => setShowPayment(true)}
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition-colors cursor-pointer"
            >
              Pay with SOL — {PRICE_SOL} SOL
            </button>
            <a
              href="/api/stripe-checkout?product=sol-bot-source"
              className="inline-block bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition-colors"
            >
              Pay with Card — ${PRICE_USD}
            </a>
          </div>
          <p className="text-gray-500 text-sm mt-2">SOL or credit/debit card. Instant delivery.</p>
        </div>

        {showPayment && !verified && (
          <div className="bg-gray-900 rounded-xl p-8 mb-12 border border-blue-800/50">
            <h2 className="text-xl font-bold mb-4 text-center">Pay with SOL</h2>
            <div className="space-y-4">
              <div>
                <p className="text-gray-300 mb-2">
                  Send <strong>{PRICE_SOL} SOL</strong> to:
                </p>
                <div className="bg-gray-800 rounded-lg p-3 font-mono text-sm break-all select-all border border-gray-700">
                  {RECIPIENT}
                </div>
              </div>
              <div>
                <p className="text-gray-300 mb-2">
                  After sending, paste your transaction signature below:
                </p>
                <input
                  type="text"
                  value={txSig}
                  onChange={(e) => setTxSig(e.target.value)}
                  placeholder="Paste transaction signature..."
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white font-mono text-sm"
                />
              </div>
              {error && (
                <p className="text-red-400 text-sm">{error}</p>
              )}
              <button
                onClick={verifyPayment}
                disabled={verifying || !txSig.trim()}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 text-white font-bold py-3 rounded-lg transition-colors"
              >
                {verifying ? "Verifying..." : "Verify Payment & Get Download"}
              </button>
            </div>
          </div>
        )}

        {verified && (
          <div className="bg-blue-900/30 border border-blue-600 rounded-xl p-8 mb-12 text-center">
            <h2 className="text-2xl font-bold mb-4 text-blue-400">Payment Verified!</h2>
            <p className="text-gray-300 mb-6">
              Thank you for your purchase. Download your source code below:
            </p>
            <a
              href={downloadUrl}
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition-colors"
            >
              Download Source Code
            </a>
            <p className="text-gray-500 text-sm mt-4">
              Includes complete source, deployment guide, and documentation.
            </p>
          </div>
        )}

        <div className="bg-gray-900 rounded-xl p-8 mb-12">
          <h2 className="text-2xl font-bold mb-6">Stats</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <p className="text-3xl font-bold text-blue-400">4,100+</p>
              <p className="text-gray-400 text-sm">Lines of Code</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-green-400">42</p>
              <p className="text-gray-400 text-sm">Commands</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-purple-400">12</p>
              <p className="text-gray-400 text-sm">Background Workers</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-yellow-400">19</p>
              <p className="text-gray-400 text-sm">Data Files</p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <Feature
            title="Trading Engine"
            desc="Buy/sell any Solana token via Jupiter aggregator. Direct Pump.fun bonding curve trading for new tokens. Configurable slippage, priority fees, and Jito MEV bundles."
          />
          <Feature
            title="Token Sniping"
            desc="Auto-snipe new tokens from DexScreener + Pump.fun graduation detection. Configurable buy amounts, max market cap filters, and auto take-profit."
          />
          <Feature
            title="Copy Trading"
            desc="Mirror any wallet's trades with snapshot-diff monitoring. Configurable buy amounts and position limits per target. Multi-wallet support."
          />
          <Feature
            title="DCA Engine"
            desc="Automated dollar-cost averaging with 5 interval options. Per-order execution with full fee accounting. Persistent across restarts."
          />
          <Feature
            title="Limit Orders & Stop-Loss"
            desc="Price-triggered buy/sell orders. Automated stop-loss. Auto take-profit with configurable percentage targets."
          />
          <Feature
            title="Portfolio Dashboard"
            desc="Real-time portfolio with USD values, per-position P&L, and quick sell buttons. SOL balance tracking with deposit/withdrawal history."
          />
          <Feature
            title="Premium Tier"
            desc="SOL-based subscription system. Payment verification on-chain. Halved trading fees, unlimited snipes. Background expiry checker with renewal reminders."
          />
          <Feature
            title="Token Promotions"
            desc="Paid token promotion system. 0.5 SOL/24h to feature at top of /trending with auto buy buttons. Full promotion lifecycle management."
          />
          <Feature
            title="Volume/Bump Bot"
            desc="Generate real on-chain volume. Buy + sell cycles through Jupiter. Per-cycle pricing. Background execution with configurable intervals."
          />
          <Feature
            title="3-Tier Referral System"
            desc="30%/10%/5% fee sharing across 3 tiers. Referral link generation, earnings tracking, and leaderboard. Premium users get 40% tier-1."
          />
          <Feature
            title="Whale & Price Alerts"
            desc="Monitor known whale wallets. Custom price alerts on any token. Position size change notifications. All alerts via Telegram."
          />
          <Feature
            title="Engagement Engine"
            desc="Daily trending token digest to all active users. 3-day inactive user re-engagement. Premium expiry warnings. Quick-start onboarding."
          />
        </div>

        <div className="bg-gray-900 rounded-xl p-8 mb-12">
          <h2 className="text-2xl font-bold mb-4">7 Revenue Streams Built In</h2>
          <ul className="space-y-2 text-gray-300">
            <li><strong>Trading Fees:</strong> 1% on every swap (configurable)</li>
            <li><strong>Premium Subscriptions:</strong> 0.1 SOL/month recurring</li>
            <li><strong>Token Promotions:</strong> 0.5 SOL per 24h featured listing</li>
            <li><strong>Volume Bot:</strong> 0.05 SOL per bump cycle</li>
            <li><strong>Token Safety Scans:</strong> 0.01 SOL per scan</li>
            <li><strong>Tips:</strong> Voluntary tip jar with preset amounts</li>
            <li><strong>Referral Network:</strong> Users recruit users — you earn from everyone</li>
          </ul>
        </div>

        <div className="bg-gray-900 rounded-xl p-8 mb-12">
          <h2 className="text-2xl font-bold mb-4">Technical Architecture</h2>
          <ul className="space-y-2 text-gray-300 text-sm">
            <li>Single-file Node.js — no framework overhead, zero dependencies beyond node-fetch</li>
            <li>Long-polling Telegram Bot API — no webhooks needed</li>
            <li>Jupiter V6 aggregator for optimal swap routing</li>
            <li>Direct Pump.fun bonding curve integration</li>
            <li>Jito MEV bundle submission for frontrun protection</li>
            <li>Helius RPC for reliable Solana access</li>
            <li>DexScreener API for token discovery and trending</li>
            <li>JSON file-based persistence — no database required</li>
            <li>12 background workers on configurable poll intervals</li>
            <li>Auto-reconnect with exponential backoff (30 retries)</li>
            <li>Crash recovery with automatic restart</li>
          </ul>
        </div>

        <div className="bg-gray-900 rounded-xl p-8 mb-12">
          <h2 className="text-2xl font-bold mb-4">What You Get</h2>
          <ul className="space-y-2 text-gray-300">
            <li>Complete bot.js source code (4,100+ lines)</li>
            <li>All configuration files and templates</li>
            <li>Deployment documentation</li>
            <li>README with full command reference</li>
            <li>Architecture documentation</li>
            <li>Free updates — source stays current</li>
          </ul>
        </div>

        <div className="text-center mb-12">
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={() => setShowPayment(true)}
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition-colors cursor-pointer"
            >
              Pay with SOL — {PRICE_SOL} SOL
            </button>
            <a
              href="/api/stripe-checkout?product=sol-bot-source"
              className="inline-block bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition-colors"
            >
              Pay with Card — ${PRICE_USD}
            </a>
          </div>
          <p className="text-gray-500 text-sm mt-4">
            Live demo: <a href="https://t.me/solscanitbot" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">@solscanitbot on Telegram</a>
          </p>
        </div>

        <div className="bg-gradient-to-r from-green-900/50 to-blue-900/50 rounded-xl p-6 border border-green-800/30">
          <h3 className="text-lg font-bold text-white mb-2">Want a grid trading bot instead?</h3>
          <p className="text-gray-300 text-sm mb-3">Automated grid trading on Jupiter DEX. Python. Backtested +11.7% during a -37% SOL crash.</p>
          <a href="/sol-grid-bot" className="inline-block bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg text-sm transition-colors">SOL Grid Bot — 0.5 SOL</a>
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
