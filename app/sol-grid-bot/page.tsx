"use client";

export default function SolGridBotPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            SOL Grid Trading Bot
          </h1>
          <p className="text-xl text-gray-400 mb-2">
            Automated Solana Trading on Jupiter DEX
          </p>
          <p className="text-2xl font-bold text-green-400 mb-6">
            Backtested +11.7% during a -37% SOL crash
          </p>
          <a
            href="https://tatelyman.gumroad.com/l/sol-grid-bot"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition-colors"
          >
            Get It — $79
          </a>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <Feature
            title="Complete Source Code"
            desc="Production-ready Python async architecture. Not a tutorial — real trading infrastructure you can deploy today."
          />
          <Feature
            title="Paper Trading Mode"
            desc="Test your strategy risk-free before going live. Full simulation with realistic fee modeling."
          />
          <Feature
            title="576-Config Backtester"
            desc="Sweep across grid sizes, spacing types, rebalance thresholds, and more. Find the optimal parameters for any market condition."
          />
          <Feature
            title="Pyth Oracle Integration"
            desc="Real-time on-chain pricing from Pyth Network. No reliance on centralized APIs for price data."
          />
          <Feature
            title="Risk Management"
            desc="Configurable kill switches, max drawdown limits, position sizing. Institutional-level risk controls."
          />
          <Feature
            title="Free Deployment"
            desc="Complete guide for 24/7 deployment on Oracle Cloud's free tier. Zero running costs."
          />
        </div>

        <div className="bg-gray-900 rounded-xl p-8 mb-12">
          <h2 className="text-2xl font-bold mb-4">Backtested Results</h2>
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div>
              <p className="text-3xl font-bold text-green-400">+11.7%</p>
              <p className="text-gray-400 text-sm">Return</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-red-400">-37%</p>
              <p className="text-gray-400 text-sm">SOL Price Drop</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-blue-400">100%</p>
              <p className="text-gray-400 text-sm">Win Rate on Completed Cycles</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-900 rounded-xl p-8 mb-12">
          <h2 className="text-2xl font-bold mb-4">What You Get</h2>
          <ul className="space-y-2 text-gray-300">
            <li>Complete Python source code — production-ready</li>
            <li>Geometric grid spacing with Dynamic Grid Reset</li>
            <li>Paper trading mode — test risk-free</li>
            <li>Full backtester with 576-config sweep</li>
            <li>Pyth Network oracle integration</li>
            <li>Risk manager with configurable kill switches</li>
            <li>Health monitoring with HTTP endpoint</li>
            <li>Deployment guide for free Oracle Cloud 24/7 operation</li>
            <li>Buyer&apos;s Guide, Quick Start, and FAQ</li>
          </ul>
        </div>

        <div className="bg-gray-900 rounded-xl p-8 mb-12">
          <h2 className="text-2xl font-bold mb-4">Requirements</h2>
          <p className="text-gray-300">
            Python 3.12+, free Helius API key, free Jupiter API key
          </p>
        </div>

        <div className="text-center">
          <a
            href="https://tatelyman.gumroad.com/l/sol-grid-bot"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition-colors"
          >
            Get the SOL Grid Bot — $79
          </a>
        </div>

        <div className="mt-12 bg-gradient-to-r from-blue-900/50 to-purple-900/50 rounded-xl p-6 border border-blue-800/30">
          <h3 className="text-lg font-bold text-white mb-2">Want to trade from Telegram instead?</h3>
          <p className="text-gray-300 text-sm mb-3">Try our free Solana trading bot — buy, sell, copy trade, snipe, DCA, all from Telegram. No code required.</p>
          <a href="https://t.me/solscanitbot" target="_blank" rel="noopener noreferrer" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg text-sm transition-colors">Open @solscanitbot</a>
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
