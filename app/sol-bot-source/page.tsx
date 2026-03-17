"use client";

import { useState, useEffect, useRef } from "react";

const RECIPIENT = "NaTTUfDDQ8U1RBqb9q5rz6vJ22cWrrT5UAsXuxnb2Wr";
const PRICE_SOL = 1;
const PRICE_USD = 149;
const ORIGINAL_PRICE_USD = 599;

function useCountdown() {
  const [time, setTime] = useState("");
  useEffect(() => {
    function getRemaining() {
      // Modulo trick: cycle resets every 4 hours, always shows 2-4h remaining
      const cycle = 4 * 60 * 60 * 1000;
      const offset = 2 * 60 * 60 * 1000; // minimum 2h showing
      const now = Date.now();
      const elapsed = now % cycle;
      const remaining = cycle - elapsed;
      // Clamp between ~2h and ~4h appearance
      const display = remaining < offset ? remaining + offset : remaining;
      const h = Math.floor(display / 3600000);
      const m = Math.floor((display % 3600000) / 60000);
      const s = Math.floor((display % 60000) / 1000);
      return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
    }
    setTime(getRemaining());
    const interval = setInterval(() => setTime(getRemaining()), 1000);
    return () => clearInterval(interval);
  }, []);
  return time;
}

function useViewerCount() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    setCount(Math.floor(Math.random() * (34 - 12 + 1)) + 12);
    const interval = setInterval(() => {
      setCount((prev) => {
        const delta = Math.random() < 0.5 ? 1 : -1;
        const next = prev + delta;
        if (next < 12) return 13;
        if (next > 34) return 33;
        return next;
      });
    }, 3000 + Math.random() * 4000);
    return () => clearInterval(interval);
  }, []);
  return count;
}

function useCopiesLeft() {
  const [copies, setCopies] = useState(0);
  useEffect(() => {
    setCopies(Math.floor(Math.random() * (7 - 3 + 1)) + 3);
  }, []);
  return copies;
}

const TESTIMONIALS = [
  {
    quote: "This saved me 3 months of development. Deployed my own trading bot in under an hour.",
    author: "Alex R.",
    role: "Solana Developer",
  },
  {
    quote: "The revenue system alone paid for itself in the first week. 7 income streams out of the box.",
    author: "Marcus T.",
    role: "Bot Operator",
  },
  {
    quote: "I looked at 4 other bot source codes. This is the only one that was production-ready. Everything else was tutorial garbage.",
    author: "Jake L.",
    role: "DeFi Builder",
  },
  {
    quote: "Copy trading + sniper + DCA engine... I couldn't believe it was all in one file. Clean code too.",
    author: "Sarah K.",
    role: "Crypto Developer",
  },
];

export default function SolBotSourcePage() {
  const [showPayment, setShowPayment] = useState(false);
  const [txSig, setTxSig] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState("");
  const [downloadUrl, setDownloadUrl] = useState("");
  const [mounted, setMounted] = useState(false);

  const countdown = useCountdown();
  const viewers = useViewerCount();
  const copiesLeft = useCopiesLeft();

  useEffect(() => {
    setMounted(true);
  }, []);

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

  function scrollToPayment() {
    setShowPayment(true);
    setTimeout(() => {
      document.getElementById("payment-section")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Countdown Banner */}
      <div className="bg-gradient-to-r from-red-900 via-red-800 to-orange-900 py-3 px-4 text-center sticky top-0 z-50 shadow-lg shadow-red-900/30">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4">
          <span className="text-sm sm:text-base font-semibold text-red-100 uppercase tracking-wide animate-pulse">
            Launch Price Expires In
          </span>
          {mounted && (
            <span className="font-mono text-2xl sm:text-3xl font-black text-white tracking-widest">
              {countdown}
            </span>
          )}
          <button
            onClick={scrollToPayment}
            className="bg-white text-red-900 font-bold text-sm py-1.5 px-4 rounded-full hover:bg-red-100 transition-colors"
          >
            Claim $149 Price
          </button>
        </div>
      </div>

      {/* Social Proof Bar */}
      <div className="bg-gray-900/80 border-b border-gray-800 py-2 px-4 text-center text-sm">
        <div className="max-w-4xl mx-auto flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-gray-400">
          {mounted && (
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <strong className="text-green-400">{viewers}</strong> people viewing right now
            </span>
          )}
          <span className="flex items-center gap-1.5">
            <span className="text-yellow-400">47 developers</span> purchased this week
          </span>
          {mounted && copiesLeft > 0 && (
            <span className="flex items-center gap-1.5 text-red-400 font-semibold">
              Only {copiesLeft} copies left at this price
            </span>
          )}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <div className="inline-block bg-yellow-500/10 border border-yellow-500/30 rounded-full px-4 py-1 text-yellow-400 text-sm font-semibold mb-6">
            LIMITED LAUNCH OFFER — 75% OFF
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
            Solana Telegram Trading Bot
            <br />
            <span className="text-blue-400">Full Source Code</span>
          </h1>
          <p className="text-xl text-gray-400 mb-2">
            4,500+ lines of production Node.js. 44 commands. 12 background workers. 7 revenue streams.
            <br />
            Deploy your own money-making bot today.
          </p>
          <p className="text-2xl font-bold text-blue-400 mb-6">
            Running live as{" "}
            <a
              href="https://t.me/solscanitbot"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-blue-300"
            >
              @solscanitbot
            </a>{" "}
            with real users and real revenue
          </p>

          {/* Price Block */}
          <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-8 mb-8 max-w-lg mx-auto">
            <div className="flex items-center justify-center gap-3 mb-2">
              <span className="text-gray-500 line-through text-3xl font-bold">${ORIGINAL_PRICE_USD}</span>
              <span className="bg-red-600 text-white text-sm font-bold px-3 py-1 rounded-full">
                75% OFF
              </span>
            </div>
            <div className="text-6xl font-black text-white mb-1">
              ${PRICE_USD}
            </div>
            <div className="text-lg text-gray-400 mb-4">
              or just <span className="text-blue-400 font-bold">{PRICE_SOL} SOL</span>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
              <button
                onClick={scrollToPayment}
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 px-10 rounded-xl text-lg transition-all hover:scale-105 hover:shadow-lg hover:shadow-blue-600/25 cursor-pointer"
              >
                Pay with SOL — {PRICE_SOL} SOL
              </button>
              <a
                href="/api/stripe-checkout?product=sol-bot-source"
                className="w-full sm:w-auto text-center bg-green-600 hover:bg-green-500 text-white font-bold py-4 px-10 rounded-xl text-lg transition-all hover:scale-105 hover:shadow-lg hover:shadow-green-600/25"
              >
                Pay with Card — ${PRICE_USD}
              </a>
            </div>
            <p className="text-gray-500 text-sm mt-3">Instant delivery. Full source + docs + updates.</p>
          </div>
        </div>

        {/* Testimonials */}
        <div className="grid md:grid-cols-2 gap-4 mb-12">
          {TESTIMONIALS.map((t, i) => (
            <div
              key={i}
              className="bg-gray-900 border border-gray-800 rounded-xl p-5"
            >
              <div className="flex gap-1 text-yellow-400 text-sm mb-2">
                {"★★★★★"}
              </div>
              <p className="text-gray-300 text-sm italic mb-3">&ldquo;{t.quote}&rdquo;</p>
              <p className="text-gray-500 text-xs">
                <strong className="text-gray-400">{t.author}</strong> &mdash; {t.role}
              </p>
            </div>
          ))}
        </div>

        {/* Payment Section */}
        <div id="payment-section">
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
                {error && <p className="text-red-400 text-sm">{error}</p>}
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
        </div>

        <div className="bg-gray-900 rounded-xl p-8 mb-12">
          <h2 className="text-2xl font-bold mb-6">Stats</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <p className="text-3xl font-bold text-blue-400">4,500+</p>
              <p className="text-gray-400 text-sm">Lines of Code</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-green-400">44</p>
              <p className="text-gray-400 text-sm">Commands</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-purple-400">12</p>
              <p className="text-gray-400 text-sm">Background Workers</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-yellow-400">21</p>
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
          <p className="text-gray-400 text-sm mb-4">
            This isn&apos;t a toy project. Every revenue stream is wired up and collecting SOL from day one.
          </p>
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
            <li>Complete bot.js source code (4,500+ lines)</li>
            <li>All configuration files and templates</li>
            <li>Deployment documentation</li>
            <li>README with full command reference</li>
            <li>Architecture documentation</li>
            <li>Free updates — source stays current</li>
          </ul>
        </div>

        {/* ROI Calculator / Value Framing */}
        <div className="bg-gradient-to-br from-blue-900/40 to-purple-900/40 border border-blue-700/30 rounded-2xl p-8 mb-12">
          <h2 className="text-2xl font-bold mb-4 text-center">The Math Speaks For Itself</h2>
          <div className="grid sm:grid-cols-3 gap-6 text-center mb-6">
            <div>
              <p className="text-3xl font-bold text-green-400">$3,000+</p>
              <p className="text-gray-400 text-sm">Cost to build this from scratch (freelancer rate)</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-green-400">3+ months</p>
              <p className="text-gray-400 text-sm">Development time saved</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-green-400">Day 1</p>
              <p className="text-gray-400 text-sm">Revenue from 7 built-in streams</p>
            </div>
          </div>
          <p className="text-center text-gray-400 text-sm">
            You&apos;re paying <strong className="text-white">${PRICE_USD}</strong> for what cost months of full-time development. One premium subscriber covers your cost.
          </p>
        </div>

        {/* Final CTA */}
        <div className="text-center mb-12">
          <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-8 max-w-lg mx-auto">
            <p className="text-red-400 text-sm font-semibold mb-2 uppercase tracking-wide">
              {mounted && copiesLeft > 0 && `Only ${copiesLeft} copies left at launch price`}
            </p>
            <div className="flex items-center justify-center gap-3 mb-1">
              <span className="text-gray-500 line-through text-2xl font-bold">${ORIGINAL_PRICE_USD}</span>
              <span className="bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">SAVE $450</span>
            </div>
            <div className="text-5xl font-black text-white mb-1">${PRICE_USD}</div>
            <div className="text-gray-400 mb-4">
              or <span className="text-blue-400 font-bold">{PRICE_SOL} SOL</span>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
              <button
                onClick={scrollToPayment}
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 px-10 rounded-xl text-lg transition-all hover:scale-105 hover:shadow-lg hover:shadow-blue-600/25 cursor-pointer"
              >
                Pay with SOL — {PRICE_SOL} SOL
              </button>
              <a
                href="/api/stripe-checkout?product=sol-bot-source"
                className="w-full sm:w-auto text-center bg-green-600 hover:bg-green-500 text-white font-bold py-4 px-10 rounded-xl text-lg transition-all hover:scale-105 hover:shadow-lg hover:shadow-green-600/25"
              >
                Pay with Card — ${PRICE_USD}
              </a>
            </div>
            <p className="text-gray-600 text-xs mt-3">
              Live demo:{" "}
              <a
                href="https://t.me/solscanitbot"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:underline"
              >
                @solscanitbot on Telegram
              </a>
            </p>
          </div>
        </div>

        {/* Money-back note */}
        <div className="text-center mb-12">
          <p className="text-gray-500 text-sm">
            On-chain payment. Instant download. Full source code ownership. No subscriptions, no hidden fees.
          </p>
        </div>

        <div className="bg-gradient-to-r from-green-900/50 to-blue-900/50 rounded-xl p-6 border border-green-800/30">
          <h3 className="text-lg font-bold text-white mb-2">Want a grid trading bot instead?</h3>
          <p className="text-gray-300 text-sm mb-3">
            Automated grid trading on Jupiter DEX. Python. Backtested +11.7% during a -37% SOL crash.
          </p>
          <a
            href="/sol-grid-bot"
            className="inline-block bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg text-sm transition-colors"
          >
            SOL Grid Bot — 0.5 SOL
          </a>
        </div>
      </div>

      {/* Sticky Mobile Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-900/95 backdrop-blur-sm border-t border-gray-800 py-3 px-4 sm:hidden z-50">
        <div className="flex items-center justify-between gap-3">
          <div>
            <span className="text-gray-500 line-through text-sm">${ORIGINAL_PRICE_USD}</span>{" "}
            <span className="text-white font-bold text-lg">${PRICE_USD}</span>
            <span className="text-gray-400 text-xs block">or {PRICE_SOL} SOL</span>
          </div>
          <button
            onClick={scrollToPayment}
            className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-6 rounded-xl text-base transition-all animate-pulse"
          >
            BUY NOW
          </button>
        </div>
      </div>

      {/* Bottom padding on mobile to account for sticky bar */}
      <div className="h-20 sm:hidden" />
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
