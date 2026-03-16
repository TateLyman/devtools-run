"use client";

import { useState } from "react";

const RECIPIENT = "NaTTUfDDQ8U1RBqb9q5rz6vJ22cWrrT5UAsXuxnb2Wr";
const PRICE_SOL = 0.5;

export default function SolTradingGuidePage() {
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
        body: JSON.stringify({ txSig: txSig.trim(), product: "sol-trading-guide" }),
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
            The Complete Solana Trading Course
          </h1>
          <p className="text-xl text-gray-400 mb-2">
            From zero to profitable trader &mdash; 8 chapters, 15,000+ words of battle-tested strategies
          </p>
          <p className="text-2xl font-bold text-yellow-400 mb-6">
            Sniping, copy trading, DCA, MEV protection, rug detection &amp; more
          </p>
          <button
            onClick={() => setShowPayment(true)}
            className="inline-block bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition-colors cursor-pointer"
          >
            Get the Course &mdash; {PRICE_SOL} SOL
          </button>
          <p className="text-gray-500 text-sm mt-2">Pay with SOL. Instant delivery.</p>
        </div>

        {showPayment && !verified && (
          <div className="bg-gray-900 rounded-xl p-8 mb-12 border border-yellow-800/50">
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
                className="w-full bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-700 text-white font-bold py-3 rounded-lg transition-colors"
              >
                {verifying ? "Verifying..." : "Verify Payment & Get Download"}
              </button>
            </div>
          </div>
        )}

        {verified && (
          <div className="bg-yellow-900/30 border border-yellow-600 rounded-xl p-8 mb-12 text-center">
            <h2 className="text-2xl font-bold mb-4 text-yellow-400">Payment Verified!</h2>
            <p className="text-gray-300 mb-6">
              Thank you for your purchase. Download your course materials below:
            </p>
            <a
              href={downloadUrl}
              className="inline-block bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition-colors"
            >
              Download Trading Course
            </a>
            <p className="text-gray-500 text-sm mt-4">
              Includes all 8 chapters, strategy templates, and cheat sheets.
            </p>
          </div>
        )}

        <div className="bg-gray-900 rounded-xl p-8 mb-12">
          <h2 className="text-2xl font-bold mb-6">Course Stats</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <p className="text-3xl font-bold text-yellow-400">8</p>
              <p className="text-gray-400 text-sm">In-Depth Chapters</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-green-400">15,000+</p>
              <p className="text-gray-400 text-sm">Words</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-purple-400">12</p>
              <p className="text-gray-400 text-sm">Trading Strategies</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-blue-400">5</p>
              <p className="text-gray-400 text-sm">Cheat Sheets</p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <Feature
            title="Ch 1-2: Solana Fundamentals"
            desc="How Solana works, setting up Phantom & Solflare wallets, understanding SPL tokens, token lifecycle from Pump.fun to Raydium graduation, where to find alpha."
          />
          <Feature
            title="Ch 3: Trading on Jupiter"
            desc="Step-by-step Jupiter DEX guide. Understanding slippage, priority fees, route splitting. Executing your first swap. Reading charts on DexScreener and Birdeye."
          />
          <Feature
            title="Ch 4: Sniping & Copy Trading"
            desc="How to snipe new token launches. Setting up copy trading to mirror whale wallets. Configuring buy amounts, max market cap filters, and auto take-profit targets."
          />
          <Feature
            title="Ch 5: DCA & Grid Strategies"
            desc="Dollar-cost averaging into positions automatically. Grid trading for sideways markets. Backtested strategies with real performance data (+11.7% during a -37% crash)."
          />
          <Feature
            title="Ch 6: MEV Protection"
            desc="What MEV is and why it costs you money. How sandwich attacks work. Using Jito bundles for frontrun protection. Priority fee optimization to avoid overpaying."
          />
          <Feature
            title="Ch 7: Risk Management"
            desc="Position sizing rules. 5 red flags for rug pulls. Stop-loss and take-profit automation. Managing drawdowns. When to cut losses vs. hold. Portfolio allocation."
          />
          <Feature
            title="Ch 8: Building Your System"
            desc="Creating a daily trading routine. Setting up alerts and automation. P&L tracking spreadsheets. Scaling from small to larger positions. Psychology of trading."
          />
          <Feature
            title="Bonus: Tools & Resources"
            desc="Complete list of essential tools: DexScreener, Birdeye, RugCheck, Solana FM, trading bots. API integrations. Community resources and alpha channels."
          />
        </div>

        <div className="bg-gray-900 rounded-xl p-8 mb-12">
          <h2 className="text-2xl font-bold mb-4">What Makes This Different</h2>
          <ul className="space-y-2 text-gray-300">
            <li><strong>Written by a builder, not a guru:</strong> Created by the developer behind @solscanitbot, a live trading bot with real users</li>
            <li><strong>Solana-specific:</strong> Not generic crypto advice &mdash; every strategy is tailored for the Solana ecosystem</li>
            <li><strong>Actionable:</strong> Step-by-step instructions, not vague theory. You can start trading the same day</li>
            <li><strong>Risk-first approach:</strong> Rug detection, position sizing, and loss management come before profit strategies</li>
            <li><strong>Always updated:</strong> Content stays current as the Solana ecosystem evolves</li>
          </ul>
        </div>

        <div className="bg-gray-900 rounded-xl p-8 mb-12">
          <h2 className="text-2xl font-bold mb-4">Who This Is For</h2>
          <ul className="space-y-2 text-gray-300">
            <li>Complete beginners who want to start trading Solana tokens</li>
            <li>CEX traders moving to on-chain DEX trading for the first time</li>
            <li>Anyone who keeps losing money to rugs, MEV, or bad timing</li>
            <li>Developers who want to understand trading before building bots</li>
            <li>People who want a structured system, not random Twitter tips</li>
          </ul>
        </div>

        <div className="bg-gray-900 rounded-xl p-8 mb-12">
          <h2 className="text-2xl font-bold mb-4">What Readers Say</h2>
          <div className="space-y-4">
            <div className="border-l-2 border-yellow-600 pl-4">
              <p className="text-gray-300 italic">&quot;Finally a guide that explains MEV in plain English. Saved me from getting sandwiched on day one.&quot;</p>
              <p className="text-gray-500 text-sm mt-1">&mdash; DeFi trader, moved from Ethereum</p>
            </div>
            <div className="border-l-2 border-yellow-600 pl-4">
              <p className="text-gray-300 italic">&quot;The rug detection chapter alone is worth the price. I spotted 3 rugs in my first week using the red flags checklist.&quot;</p>
              <p className="text-gray-500 text-sm mt-1">&mdash; New Solana trader</p>
            </div>
            <div className="border-l-2 border-yellow-600 pl-4">
              <p className="text-gray-300 italic">&quot;Copy trading section is gold. Set it up in 10 minutes, already mirroring a whale who&apos;s been 8/10 on calls.&quot;</p>
              <p className="text-gray-500 text-sm mt-1">&mdash; Part-time crypto trader</p>
            </div>
          </div>
        </div>

        <div className="text-center mb-12">
          <button
            onClick={() => setShowPayment(true)}
            className="inline-block bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition-colors cursor-pointer"
          >
            Get the Course &mdash; {PRICE_SOL} SOL
          </button>
          <p className="text-gray-500 text-sm mt-4">
            Live demo of the strategies: <a href="https://t.me/solscanitbot" target="_blank" rel="noopener noreferrer" className="text-yellow-400 hover:underline">@solscanitbot on Telegram</a>
          </p>
        </div>

        <div className="bg-gradient-to-r from-blue-900/50 to-cyan-900/50 rounded-xl p-6 border border-blue-800/30">
          <h3 className="text-lg font-bold text-white mb-2">Ready to automate your trading?</h3>
          <p className="text-gray-300 text-sm mb-3">Get the full bot source code and deploy your own Telegram trading bot with 42+ commands.</p>
          <div className="flex gap-3 flex-wrap">
            <a href="/bot-builder" className="inline-block bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-6 rounded-lg text-sm transition-colors">Bot Builder Kit &mdash; 1 SOL</a>
            <a href="/sol-bot-source" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg text-sm transition-colors">Bot Source Code &mdash; 2 SOL</a>
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
