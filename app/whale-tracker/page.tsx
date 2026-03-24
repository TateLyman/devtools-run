"use client";

export default function WhaleTrackerPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <div className="text-sm font-semibold text-blue-400 mb-3 tracking-widest uppercase">
            Solana Whale Tracker
          </div>
          <h1 className="text-5xl font-extrabold mb-4">
            Know What Smart Money is Doing
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-6">
            Track any Solana wallet in real-time. Get instant Telegram alerts
            when whales buy, sell, or move tokens. Follow the money.
          </p>
          <a
            href="https://t.me/solscanitbot?start=whale"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-10 rounded-xl text-lg transition-colors"
          >
            Start Tracking for Free
          </a>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-gray-900 rounded-xl p-6 text-center">
            <div className="text-4xl font-extrabold text-blue-400">60s</div>
            <div className="text-sm text-gray-400 mt-2">
              Wallet scan interval
            </div>
          </div>
          <div className="bg-gray-900 rounded-xl p-6 text-center">
            <div className="text-4xl font-extrabold text-green-400">
              Instant
            </div>
            <div className="text-sm text-gray-400 mt-2">
              Telegram notifications
            </div>
          </div>
          <div className="bg-gray-900 rounded-xl p-6 text-center">
            <div className="text-4xl font-extrabold text-purple-400">
              Unlimited
            </div>
            <div className="text-sm text-gray-400 mt-2">
              Wallets to track (Premium)
            </div>
          </div>
        </div>

        <div className="bg-gray-900 rounded-xl p-8 mb-12">
          <h2 className="text-2xl font-bold mb-6">What You Get</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <Feature
              title="Real-Time Wallet Monitoring"
              desc="Track any Solana wallet. When they buy or sell a token, you get a Telegram alert within 60 seconds."
            />
            <Feature
              title="Copy Trade Automatically"
              desc="Don't just watch — mirror their trades. When a tracked wallet buys, your bot buys the same token automatically."
            />
            <Feature
              title="Token Safety Check"
              desc="Every token a tracked wallet buys gets an automatic 0-100 safety score. Know if it's a rug before you follow."
            />
            <Feature
              title="Webhook Integration"
              desc="Send alerts to your own server via HTTP webhooks. Build custom dashboards, bots, or notification systems."
            />
          </div>
        </div>

        <div className="bg-gray-900 rounded-xl p-8 mb-12">
          <h2 className="text-2xl font-bold mb-6">Pricing</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="border border-gray-700 rounded-xl p-6">
              <h3 className="text-xl font-bold mb-2">Free</h3>
              <div className="text-3xl font-extrabold mb-4">$0</div>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>&#x2713; Track 2 wallets</li>
                <li>&#x2713; Telegram alerts</li>
                <li>&#x2713; 60-second scan interval</li>
                <li className="text-gray-500">
                  &#x2717; Copy trading
                </li>
                <li className="text-gray-500">
                  &#x2717; Webhooks
                </li>
              </ul>
            </div>
            <div className="border border-blue-500 rounded-xl p-6 ring-2 ring-blue-500/20">
              <div className="text-xs font-bold text-blue-400 uppercase mb-1">
                Recommended
              </div>
              <h3 className="text-xl font-bold mb-2">Premium</h3>
              <div className="text-3xl font-extrabold mb-4">
                0.1 SOL<span className="text-lg text-gray-400">/month</span>
              </div>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>&#x2713; Unlimited wallets</li>
                <li>&#x2713; Telegram alerts</li>
                <li>&#x2713; Copy trading</li>
                <li>&#x2713; Webhook alerts</li>
                <li>&#x2713; 0.5% trading fees (vs 1%)</li>
                <li>&#x2713; Safety scores on every alert</li>
              </ul>
              <a
                href="https://t.me/solscanitbot?start=premium"
                className="block text-center mt-4 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 font-bold transition-colors"
              >
                Get Premium
              </a>
            </div>
          </div>
        </div>

        <div className="bg-gray-900 rounded-xl p-8 mb-12">
          <h2 className="text-2xl font-bold mb-4">How to Start</h2>
          <div className="space-y-3 text-gray-300">
            <Step n={1} text="Open @solscanitbot on Telegram" />
            <Step n={2} text="Type /whale on to enable wallet alerts" />
            <Step
              n={3}
              text="Type /copy <wallet_address> to start tracking + auto-trading"
            />
            <Step n={4} text="Get alerts when they make moves" />
          </div>
        </div>

        <div className="text-center">
          <a
            href="https://t.me/solscanitbot?start=whale"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-10 rounded-xl text-lg transition-colors"
          >
            Start Tracking Whales
          </a>
          <p className="text-gray-500 mt-4 text-sm">
            Free forever. Upgrade anytime. Pay with SOL or Telegram Stars.
          </p>
        </div>
      </div>
    </div>
  );
}

function Feature({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="p-4 bg-gray-800 rounded-lg">
      <h3 className="font-bold mb-1">{title}</h3>
      <p className="text-gray-400 text-sm">{desc}</p>
    </div>
  );
}

function Step({ n, text }: { n: number; text: string }) {
  return (
    <div className="flex items-start gap-3">
      <span className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 font-bold">
        {n}
      </span>
      <p>{text}</p>
    </div>
  );
}
