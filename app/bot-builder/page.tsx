"use client";

import { useState } from "react";

const RECIPIENT = "NaTTUfDDQ8U1RBqb9q5rz6vJ22cWrrT5UAsXuxnb2Wr";
const PRICE_SOL = 1;

export default function BotBuilderPage() {
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
        body: JSON.stringify({ txSig: txSig.trim(), product: "bot-builder" }),
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
            Crypto Bot Builder Kit
          </h1>
          <p className="text-xl text-gray-400 mb-2">
            Everything you need to build, deploy, and monetize your own Telegram trading bot on Solana
          </p>
          <p className="text-2xl font-bold text-orange-400 mb-6">
            Full source code + deployment guide + API integrations + monetization playbook
          </p>
          <button
            onClick={() => setShowPayment(true)}
            className="inline-block bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition-colors cursor-pointer"
          >
            Get the Kit &mdash; {PRICE_SOL} SOL
          </button>
          <p className="text-gray-500 text-sm mt-2">Pay with SOL. Instant delivery.</p>
        </div>

        {showPayment && !verified && (
          <div className="bg-gray-900 rounded-xl p-8 mb-12 border border-orange-800/50">
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
                className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-gray-700 text-white font-bold py-3 rounded-lg transition-colors"
              >
                {verifying ? "Verifying..." : "Verify Payment & Get Download"}
              </button>
            </div>
          </div>
        )}

        {verified && (
          <div className="bg-orange-900/30 border border-orange-600 rounded-xl p-8 mb-12 text-center">
            <h2 className="text-2xl font-bold mb-4 text-orange-400">Payment Verified!</h2>
            <p className="text-gray-300 mb-6">
              Thank you for your purchase. Download your bot builder kit below:
            </p>
            <a
              href={downloadUrl}
              className="inline-block bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition-colors"
            >
              Download Bot Builder Kit
            </a>
            <p className="text-gray-500 text-sm mt-4">
              Includes source code, deployment guide, API docs, and monetization playbook.
            </p>
          </div>
        )}

        <div className="bg-gray-900 rounded-xl p-8 mb-12">
          <h2 className="text-2xl font-bold mb-6">What&apos;s Inside</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <p className="text-3xl font-bold text-orange-400">4,100+</p>
              <p className="text-gray-400 text-sm">Lines of Source Code</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-green-400">7</p>
              <p className="text-gray-400 text-sm">Revenue Streams</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-purple-400">42</p>
              <p className="text-gray-400 text-sm">Bot Commands</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-blue-400">5</p>
              <p className="text-gray-400 text-sm">Setup Guides</p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <Feature
            title="Complete Bot Source Code"
            desc="Full production Node.js bot with 42 commands, 12 background workers. Trading, sniping, copy trading, DCA, limit orders, portfolio tracking — everything running live in @solscanitbot."
          />
          <Feature
            title="Step-by-Step Deployment Guide"
            desc="From zero to running bot in under 30 minutes. Server setup, environment variables, Telegram Bot API registration, RPC configuration, and process management with PM2."
          />
          <Feature
            title="Jupiter DEX Integration"
            desc="Complete Jupiter V6 aggregator integration. Optimal route finding, slippage handling, priority fee management. Swap any SPL token with best-price execution."
          />
          <Feature
            title="Pump.fun Integration"
            desc="Direct bonding curve trading for newly launched tokens. Graduation detection from Pump.fun to Raydium. Early entry strategies for maximum upside."
          />
          <Feature
            title="Jito MEV Protection"
            desc="MEV bundle submission to protect trades from sandwich attacks. Frontrun-proof swaps. Priority fee optimization to balance speed vs. cost."
          />
          <Feature
            title="Copy Trading Engine"
            desc="Mirror any Solana wallet's trades automatically. Snapshot-diff monitoring, configurable buy amounts, position limits per target. Multi-wallet tracking."
          />
          <Feature
            title="Token Sniping System"
            desc="Auto-detect and snipe new tokens from DexScreener and Pump.fun graduation. Market cap filters, auto take-profit, configurable buy amounts."
          />
          <Feature
            title="Monetization Playbook"
            desc="7 built-in revenue streams: trading fees, premium subscriptions, token promotions, volume bot, safety scans, tips, and 3-tier referral system. Start earning from day one."
          />
          <Feature
            title="Premium Subscription System"
            desc="On-chain SOL payment verification. Tiered access control. Background expiry checker with renewal reminders. Configurable pricing and feature gates."
          />
          <Feature
            title="API Integration Guide"
            desc="How to connect DexScreener, Birdeye, Helius RPC, Jupiter, Jito, and Telegram Bot API. Rate limiting, error handling, and reconnection strategies."
          />
          <Feature
            title="Database & Persistence"
            desc="JSON file-based storage with no database dependency. User wallets, trade history, referrals, premiums, alerts — all persisted across restarts."
          />
          <Feature
            title="Scaling & Customization"
            desc="How to add new commands, modify fee structures, create custom alerts, integrate new DEXes, and scale to thousands of users."
          />
        </div>

        <div className="bg-gray-900 rounded-xl p-8 mb-12">
          <h2 className="text-2xl font-bold mb-4">7 Revenue Streams Built In</h2>
          <ul className="space-y-2 text-gray-300">
            <li><strong>Trading Fees:</strong> 1% on every swap (configurable per-user)</li>
            <li><strong>Premium Subscriptions:</strong> 0.1 SOL/month with on-chain verification</li>
            <li><strong>Token Promotions:</strong> 0.5 SOL per 24h featured listing</li>
            <li><strong>Volume Bot:</strong> 0.05 SOL per bump cycle</li>
            <li><strong>Token Safety Scans:</strong> 0.01 SOL per scan</li>
            <li><strong>Tips:</strong> Voluntary tip jar with preset amounts</li>
            <li><strong>3-Tier Referral System:</strong> 30%/10%/5% fee sharing. Users recruit users &mdash; you earn from everyone</li>
          </ul>
        </div>

        <div className="bg-gray-900 rounded-xl p-8 mb-12">
          <h2 className="text-2xl font-bold mb-4">Technical Stack</h2>
          <ul className="space-y-2 text-gray-300 text-sm">
            <li>Single-file Node.js &mdash; no framework overhead, minimal dependencies</li>
            <li>Long-polling Telegram Bot API &mdash; no webhooks, no ngrok needed</li>
            <li>Jupiter V6 aggregator for best swap routing</li>
            <li>Direct Pump.fun bonding curve integration</li>
            <li>Jito MEV bundle submission</li>
            <li>Helius RPC for reliable Solana access</li>
            <li>DexScreener API for token discovery and trending data</li>
            <li>JSON file persistence &mdash; zero database setup</li>
            <li>12 background workers on configurable intervals</li>
            <li>Auto-reconnect with exponential backoff (30 retries)</li>
            <li>Crash recovery with automatic restart</li>
          </ul>
        </div>

        <div className="bg-gray-900 rounded-xl p-8 mb-12">
          <h2 className="text-2xl font-bold mb-4">What Builders Say</h2>
          <div className="space-y-4">
            <div className="border-l-2 border-orange-600 pl-4">
              <p className="text-gray-300 italic">&quot;Had my bot running in 20 minutes. The monetization was already built in &mdash; started earning fees on day one.&quot;</p>
              <p className="text-gray-500 text-sm mt-1">&mdash; Indie developer, launched bot with 200+ users</p>
            </div>
            <div className="border-l-2 border-orange-600 pl-4">
              <p className="text-gray-300 italic">&quot;The copy trading engine alone would take weeks to build from scratch. This saved me hundreds of hours.&quot;</p>
              <p className="text-gray-500 text-sm mt-1">&mdash; Full-stack developer building crypto tools</p>
            </div>
            <div className="border-l-2 border-orange-600 pl-4">
              <p className="text-gray-300 italic">&quot;Best documentation I&apos;ve seen for a crypto bot. Every integration is explained, not just code-dumped.&quot;</p>
              <p className="text-gray-500 text-sm mt-1">&mdash; Backend engineer, new to Solana</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-900 rounded-xl p-8 mb-12">
          <h2 className="text-2xl font-bold mb-4">Who This Is For</h2>
          <ul className="space-y-2 text-gray-300">
            <li>Developers who want to launch a Telegram trading bot without starting from zero</li>
            <li>Entrepreneurs looking for a crypto product with built-in monetization</li>
            <li>Existing bot operators who want to add Solana trading features</li>
            <li>Anyone who wants to learn Solana development through a real, production codebase</li>
          </ul>
        </div>

        <div className="bg-orange-900/20 rounded-xl p-8 mb-12 border border-orange-800/30">
          <h2 className="text-2xl font-bold mb-4">Bot Builder Kit vs. Source Code Only</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-bold text-orange-400 mb-3">Bot Builder Kit &mdash; 1 SOL</h3>
              <ul className="space-y-1 text-gray-300 text-sm">
                <li>Full bot source code (4,100+ lines)</li>
                <li>Step-by-step deployment guide</li>
                <li>API integration documentation</li>
                <li>Monetization playbook</li>
                <li>Scaling &amp; customization guide</li>
                <li>Architecture documentation</li>
                <li>Free updates</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold text-blue-400 mb-3">Source Code Only &mdash; 2 SOL</h3>
              <ul className="space-y-1 text-gray-300 text-sm">
                <li>Full bot source code (4,100+ lines)</li>
                <li>Configuration files &amp; templates</li>
                <li>README with command reference</li>
                <li>Basic deployment docs</li>
                <li>Free updates</li>
              </ul>
            </div>
          </div>
          <p className="text-gray-400 text-sm mt-4">The Bot Builder Kit is the better value &mdash; same code at half the price, plus comprehensive guides.</p>
        </div>

        <div className="text-center mb-12">
          <button
            onClick={() => setShowPayment(true)}
            className="inline-block bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition-colors cursor-pointer"
          >
            Get the Bot Builder Kit &mdash; {PRICE_SOL} SOL
          </button>
          <p className="text-gray-500 text-sm mt-4">
            See it live: <a href="https://t.me/solscanitbot" target="_blank" rel="noopener noreferrer" className="text-orange-400 hover:underline">@solscanitbot on Telegram</a>
          </p>
        </div>

        <div className="bg-gradient-to-r from-yellow-900/50 to-orange-900/50 rounded-xl p-6 border border-yellow-800/30">
          <h3 className="text-lg font-bold text-white mb-2">New to Solana trading?</h3>
          <p className="text-gray-300 text-sm mb-3">Start with our trading course &mdash; learn sniping, copy trading, DCA, and risk management before you build.</p>
          <div className="flex gap-3 flex-wrap">
            <a href="/sol-trading-guide" className="inline-block bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-6 rounded-lg text-sm transition-colors">Trading Course &mdash; 0.5 SOL</a>
            <a href="/sol-defi-toolkit" className="inline-block bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-6 rounded-lg text-sm transition-colors">DeFi Toolkit &mdash; 0.3 SOL</a>
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
