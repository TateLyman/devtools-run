"use client";

export default function WebhooksPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <div className="text-sm font-semibold text-cyan-400 mb-3 tracking-widest uppercase">Solana Webhooks</div>
          <h1 className="text-5xl font-extrabold mb-4">Real-Time Solana Alerts via HTTP</h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Get instant HTTP POST notifications when wallets move, tokens launch, prices change, or tokens trend. Build your own dashboards, bots, and alerts.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <div className="bg-gray-900 rounded-xl p-6">
            <h3 className="font-bold text-lg mb-3 text-cyan-400">Events You Can Track</h3>
            <ul className="space-y-3 text-sm text-gray-300">
              <li className="flex gap-2"><span className="text-cyan-400">&#x2022;</span><div><strong>new_token</strong> — New token launches detected via DexScreener every 60s</div></li>
              <li className="flex gap-2"><span className="text-cyan-400">&#x2022;</span><div><strong>whale_move</strong> — Tracked wallets buy/sell tokens</div></li>
              <li className="flex gap-2"><span className="text-cyan-400">&#x2022;</span><div><strong>price_alert</strong> — Token price crosses your threshold</div></li>
              <li className="flex gap-2"><span className="text-cyan-400">&#x2022;</span><div><strong>trending</strong> — Token enters DexScreener trending</div></li>
            </ul>
          </div>
          <div className="bg-gray-900 rounded-xl p-6">
            <h3 className="font-bold text-lg mb-3 text-green-400">Payload Example</h3>
            <pre className="bg-gray-800 rounded-lg p-4 text-xs text-green-300 overflow-x-auto">{`{
  "event": "new_token",
  "timestamp": 1774384000,
  "data": {
    "mint": "ABC...xyz",
    "name": "Example Token",
    "symbol": "EXM",
    "price": 0.00001,
    "safetyScore": 72
  },
  "source": "solscanitbot"
}`}</pre>
          </div>
        </div>
        <div className="bg-gray-900 rounded-xl p-8 mb-12">
          <h2 className="text-2xl font-bold mb-6">Pricing</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="border border-gray-700 rounded-xl p-6">
              <h3 className="font-bold text-lg">Free</h3>
              <div className="text-2xl font-extrabold mt-1 mb-3">$0</div>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>&#x2713; 1 webhook URL</li>
                <li>&#x2713; new_token events only</li>
                <li>&#x2713; 100 events/day</li>
              </ul>
            </div>
            <div className="border border-cyan-500 rounded-xl p-6 ring-2 ring-cyan-500/20">
              <div className="text-xs font-bold text-cyan-400 uppercase mb-1">Popular</div>
              <h3 className="font-bold text-lg">Pro</h3>
              <div className="text-2xl font-extrabold mt-1 mb-3">0.05 SOL<span className="text-sm text-gray-400">/mo</span></div>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>&#x2713; 3 webhook URLs</li>
                <li>&#x2713; All 4 event types</li>
                <li>&#x2713; Unlimited events</li>
                <li>&#x2713; Wallet tracking</li>
              </ul>
            </div>
            <div className="border border-gray-700 rounded-xl p-6">
              <h3 className="font-bold text-lg">Enterprise</h3>
              <div className="text-2xl font-extrabold mt-1 mb-3">0.5 SOL<span className="text-sm text-gray-400">/mo</span></div>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>&#x2713; Unlimited URLs</li>
                <li>&#x2713; All events + custom filters</li>
                <li>&#x2713; Priority delivery</li>
                <li>&#x2713; Direct support</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="bg-gray-900 rounded-xl p-8 mb-12">
          <h2 className="text-xl font-bold mb-4">Quick Start</h2>
          <div className="space-y-3 text-gray-300">
            <p>1. Open <a href="https://t.me/solscanitbot" className="text-cyan-400">@solscanitbot</a> on Telegram</p>
            <p>2. Run: <code className="bg-gray-800 px-2 py-0.5 rounded text-cyan-300">/webhook set https://your-server.com/hook</code></p>
            <p>3. Choose events: <code className="bg-gray-800 px-2 py-0.5 rounded text-cyan-300">/webhook alerts</code></p>
            <p>4. Test: <code className="bg-gray-800 px-2 py-0.5 rounded text-cyan-300">/webhook test</code></p>
            <p>5. Done — events flow to your endpoint in real-time</p>
          </div>
        </div>
        <div className="text-center">
          <a href="https://t.me/solscanitbot" target="_blank" className="inline-block bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-4 px-10 rounded-xl text-lg">Set Up Webhooks</a>
        </div>
        <div className="mt-8 text-center text-gray-500 text-sm">
          <a href="/api-access" className="text-cyan-400 hover:underline">Scanner API</a>{" | "}
          <a href="/sniper" className="text-cyan-400 hover:underline">Sniper</a>{" | "}
          <a href="/whale-tracker" className="text-cyan-400 hover:underline">Whale Tracker</a>{" | "}
          <a href="/sol-pay" className="text-cyan-400 hover:underline">Payments</a>{" | "}
          <a href="/templates" className="text-cyan-400 hover:underline">Templates</a>
        </div>
      </div>
    </div>
  );
}
