"use client";

import { useState } from "react";

const RECIPIENT = "NaTTUfDDQ8U1RBqb9q5rz6vJ22cWrrT5UAsXuxnb2Wr";
const PRICE_SOL = 2;

const products = [
  {
    name: "Solana Trading Bot Source Code",
    price: 2,
    color: "blue",
    href: "/sol-bot-source",
    features: [
      "4,500+ lines of production Node.js",
      "44 commands, 12 background workers",
      "Copy trading, sniping, DCA, limit orders",
      "7 built-in revenue streams",
      "Jito MEV protection, Jupiter DEX",
    ],
  },
  {
    name: "SOL Grid Trading Bot",
    price: 0.5,
    color: "green",
    href: "/sol-grid-bot",
    features: [
      "Python grid trading on Jupiter DEX",
      "+11.7% backtested during -37% SOL crash",
      "Configurable grid levels and spread",
      "Auto rebalancing and profit tracking",
    ],
  },
  {
    name: "Solana DeFi Toolkit",
    price: 0.3,
    color: "cyan",
    href: "/sol-defi-toolkit",
    features: [
      "10 production Node.js scripts",
      "Wallet monitor, token scanner",
      "Jupiter swap automation",
      "Whale tracker, price alerts",
    ],
  },
  {
    name: "Solana Trading Guide",
    price: 0.2,
    color: "yellow",
    href: "/sol-trading-guide",
    features: [
      "8 chapters, 15,000+ words",
      "Sniping, copy trading, DCA strategies",
      "Rug detection (5 red flags)",
      "MEV protection explained",
    ],
  },
  {
    name: "AI Prompt Engineering Pack",
    price: 0.1,
    color: "purple",
    href: "/prompt-pack",
    features: [
      "50+ battle-tested prompt templates",
      "Developer and founder focused",
      "Code generation, debugging, planning",
      "Marketing, copywriting, SEO prompts",
    ],
  },
];

const TOTAL_INDIVIDUAL = products.reduce((sum, p) => sum + p.price, 0);
const SAVINGS = +(TOTAL_INDIVIDUAL - PRICE_SOL).toFixed(1);
const DISCOUNT_PCT = Math.round((SAVINGS / TOTAL_INDIVIDUAL) * 100);

const colorMap: Record<string, { badge: string; strike: string }> = {
  blue: { badge: "bg-blue-900/50 text-blue-400 border-blue-700/50", strike: "text-blue-400/50" },
  green: { badge: "bg-green-900/50 text-green-400 border-green-700/50", strike: "text-green-400/50" },
  cyan: { badge: "bg-cyan-900/50 text-cyan-400 border-cyan-700/50", strike: "text-cyan-400/50" },
  yellow: { badge: "bg-yellow-900/50 text-yellow-400 border-yellow-700/50", strike: "text-yellow-400/50" },
  purple: { badge: "bg-purple-900/50 text-purple-400 border-purple-700/50", strike: "text-purple-400/50" },
};

export default function BundlePage() {
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
        body: JSON.stringify({ txSig: txSig.trim(), product: "bundle" }),
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
        {/* Hero */}
        <div className="text-center mb-12">
          <div className="inline-block bg-emerald-900/40 text-emerald-400 text-sm font-bold px-4 py-1.5 rounded-full border border-emerald-700/50 mb-6">
            SAVE {SAVINGS} SOL ({DISCOUNT_PCT}% OFF)
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Complete Solana Developer Bundle
          </h1>
          <p className="text-xl text-gray-400 mb-2">
            Everything you need to build, trade, and profit on Solana.
          </p>
          <p className="text-gray-500 mb-6">
            5 products. One payment. Instant delivery.
          </p>
          <div className="flex items-center justify-center gap-4 mb-4">
            <span className="text-gray-500 line-through text-2xl">{TOTAL_INDIVIDUAL} SOL</span>
            <span className="text-4xl font-bold text-emerald-400">{PRICE_SOL} SOL</span>
          </div>
          <button
            onClick={() => setShowPayment(true)}
            className="inline-block bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 px-10 rounded-lg text-lg transition-colors cursor-pointer"
          >
            Get the Bundle — {PRICE_SOL} SOL
          </button>
          <p className="text-gray-500 text-sm mt-2">Pay with SOL. Instant download.</p>
        </div>

        {/* Payment Flow */}
        {showPayment && !verified && (
          <div className="bg-gray-900 rounded-xl p-8 mb-12 border border-emerald-800/50">
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
                className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-700 text-white font-bold py-3 rounded-lg transition-colors"
              >
                {verifying ? "Verifying..." : "Verify Payment & Get Downloads"}
              </button>
            </div>
          </div>
        )}

        {verified && (
          <div className="bg-emerald-900/30 border border-emerald-600 rounded-xl p-8 mb-12 text-center">
            <h2 className="text-2xl font-bold mb-4 text-emerald-400">Payment Verified!</h2>
            <p className="text-gray-300 mb-6">
              Thank you for your purchase. Download all 5 products below:
            </p>
            <div className="grid sm:grid-cols-2 gap-3 max-w-lg mx-auto mb-4">
              <a
                href={downloadUrl}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-6 rounded-lg transition-colors block"
              >
                Download Bot Source
              </a>
              <a
                href="https://github.com/TateLyman/sol-grid-bot/archive/refs/heads/main.zip"
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-colors block"
              >
                Download Grid Bot
              </a>
              <a
                href="https://github.com/TateLyman/sol-defi-toolkit/archive/refs/heads/main.zip"
                className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-3 px-6 rounded-lg transition-colors block"
              >
                Download DeFi Toolkit
              </a>
              <a
                href="https://github.com/TateLyman/sol-trading-guide/archive/refs/heads/main.zip"
                className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-3 px-6 rounded-lg transition-colors block"
              >
                Download Trading Guide
              </a>
              <a
                href="https://github.com/TateLyman/ai-prompt-pack/archive/refs/heads/main.zip"
                className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg transition-colors block sm:col-span-2"
              >
                Download Prompt Pack
              </a>
            </div>
            <p className="text-gray-500 text-sm">
              All downloads include source code, documentation, and setup guides.
            </p>
          </div>
        )}

        {/* What's Included */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-center">What&apos;s Included</h2>
          <div className="space-y-4">
            {products.map((product) => (
              <div
                key={product.name}
                className="bg-gray-900 rounded-xl p-6 border border-gray-800"
              >
                <div className="flex items-start justify-between flex-wrap gap-2 mb-3">
                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${colorMap[product.color].badge}`}>
                      {product.color === "blue" ? "BOT" : product.color === "green" ? "GRID" : product.color === "cyan" ? "DEFI" : product.color === "yellow" ? "GUIDE" : "AI"}
                    </span>
                    <h3 className="text-lg font-bold">{product.name}</h3>
                  </div>
                  <span className={`line-through text-sm ${colorMap[product.color].strike}`}>
                    {product.price} SOL
                  </span>
                </div>
                <ul className="grid sm:grid-cols-2 gap-1.5">
                  {product.features.map((f) => (
                    <li key={f} className="text-gray-400 text-sm flex items-start gap-2">
                      <span className="text-emerald-500 mt-0.5 shrink-0">&#10003;</span>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Savings Summary */}
        <div className="bg-gradient-to-r from-emerald-900/30 to-green-900/30 rounded-xl p-8 mb-12 border border-emerald-800/30">
          <h2 className="text-2xl font-bold mb-6 text-center">Bundle Savings</h2>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-3xl font-bold text-gray-400 line-through">{TOTAL_INDIVIDUAL}</p>
              <p className="text-gray-500 text-sm">Individual Total</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-emerald-400">{PRICE_SOL}</p>
              <p className="text-gray-500 text-sm">Bundle Price</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-emerald-400">{DISCOUNT_PCT}%</p>
              <p className="text-gray-500 text-sm">You Save</p>
            </div>
          </div>
        </div>

        {/* Why Bundle */}
        <div className="bg-gray-900 rounded-xl p-8 mb-12">
          <h2 className="text-2xl font-bold mb-4">Why Get the Bundle?</h2>
          <ul className="space-y-3 text-gray-300">
            <li className="flex items-start gap-3">
              <span className="text-emerald-400 font-bold shrink-0">1.</span>
              <span><strong>Complete stack</strong> — Bot source code to run your own trading bot, grid bot for passive income, DeFi scripts for automation, a trading guide to learn the strategies, and AI prompts to accelerate development.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-emerald-400 font-bold shrink-0">2.</span>
              <span><strong>Save {SAVINGS} SOL</strong> — That&apos;s {DISCOUNT_PCT}% off compared to buying each product separately.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-emerald-400 font-bold shrink-0">3.</span>
              <span><strong>Instant delivery</strong> — Pay with SOL, verify on-chain, download everything immediately. No accounts, no subscriptions.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-emerald-400 font-bold shrink-0">4.</span>
              <span><strong>Production-ready code</strong> — Not tutorials or demos. Real code running live on mainnet with real users and real revenue.</span>
            </li>
          </ul>
        </div>

        {/* CTA */}
        <div className="text-center mb-12">
          <button
            onClick={() => setShowPayment(true)}
            className="inline-block bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 px-10 rounded-lg text-lg transition-colors cursor-pointer"
          >
            Get the Bundle — {PRICE_SOL} SOL
          </button>
          <p className="text-gray-500 text-sm mt-3">
            5 products worth {TOTAL_INDIVIDUAL} SOL — yours for {PRICE_SOL} SOL
          </p>
        </div>

        {/* Or Buy Individually */}
        <div className="bg-gray-900 rounded-xl p-8 mb-12">
          <h2 className="text-xl font-bold mb-4 text-center">Or Buy Individually</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {products.map((product) => (
              <a
                key={product.href}
                href={product.href}
                className={`rounded-xl border border-gray-700 bg-gray-800/50 p-4 hover:border-gray-500 transition-colors block`}
              >
                <p className="font-semibold text-sm mb-1">{product.name}</p>
                <p className="text-sm">
                  <span className={colorMap[product.color].strike.replace("/50", "")}>{product.price} SOL</span>
                </p>
              </a>
            ))}
          </div>
        </div>

        {/* Free Bot CTA */}
        <div className="bg-gradient-to-r from-[#0088cc]/20 to-blue-900/30 rounded-xl p-6 border border-blue-800/30">
          <h3 className="text-lg font-bold text-white mb-2">Want to try before you buy?</h3>
          <p className="text-gray-300 text-sm mb-3">
            Our free Telegram bot has 44+ commands — buy, sell, snipe, copy trade, DCA, and more. No source code needed.
          </p>
          <a
            href="https://t.me/solscanitbot"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-[#0088cc] hover:bg-[#0088cc]/90 text-white font-bold py-2 px-6 rounded-lg text-sm transition-colors"
          >
            Open @solscanitbot on Telegram
          </a>
        </div>
      </div>
    </div>
  );
}
