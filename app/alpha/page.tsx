"use client";

export default function AlphaPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-3xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <div className="text-sm font-semibold text-yellow-400 mb-3 tracking-widest uppercase">Sol Scanner Alpha</div>
          <h1 className="text-5xl font-extrabold mb-4 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">Early Token Signals</h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">Get notified about trending tokens, whale movements, and new launches before the crowd. Data-driven, no hype.</p>
        </div>
        <div className="bg-gray-900 rounded-2xl p-8 mb-8">
          <h2 className="text-2xl font-bold mb-4">What You Get</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="text-yellow-400 font-bold mb-1">New Token Alerts</div>
              <div className="text-sm text-gray-400">Pump.fun launches detected every 60 seconds. Safety scored before you see them.</div>
            </div>
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="text-yellow-400 font-bold mb-1">Whale Movements</div>
              <div className="text-sm text-gray-400">Track what big wallets are buying. Auto-detected, real-time Telegram alerts.</div>
            </div>
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="text-yellow-400 font-bold mb-1">Trending Tokens</div>
              <div className="text-sm text-gray-400">DexScreener boosts and trending data. Know what's hot before it pumps.</div>
            </div>
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="text-yellow-400 font-bold mb-1">Safety Scores</div>
              <div className="text-sm text-gray-400">Every token scored 0-100. Mint authority, holder concentration, verification status.</div>
            </div>
          </div>
        </div>
        <div className="bg-gray-900 rounded-2xl p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6">Pricing</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="border border-gray-700 rounded-xl p-6">
              <h3 className="font-bold text-lg">Free</h3>
              <div className="text-3xl font-extrabold mt-1 mb-3">$0</div>
              <ul className="text-sm text-gray-300 space-y-1 mb-4">
                <li>&#x2713; Trending tokens (delayed)</li>
                <li>&#x2713; Basic token scanning</li>
                <li>&#x2713; 3 snipes/hour</li>
                <li className="text-gray-500">&#x2717; Whale alerts</li>
                <li className="text-gray-500">&#x2717; New launch alerts</li>
              </ul>
              <a href="https://t.me/solscanitbot" className="block text-center bg-gray-700 hover:bg-gray-600 py-2 rounded-lg font-bold text-sm">Start Free</a>
            </div>
            <div className="border border-yellow-500 rounded-xl p-6 ring-2 ring-yellow-500/20">
              <div className="text-xs font-bold text-yellow-400 uppercase mb-1">Full Access</div>
              <h3 className="font-bold text-lg">Premium Alpha</h3>
              <div className="text-3xl font-extrabold mt-1 mb-3">0.1 SOL<span className="text-sm text-gray-400">/mo</span></div>
              <ul className="text-sm text-gray-300 space-y-1 mb-4">
                <li>&#x2713; Everything in Free</li>
                <li>&#x2713; Real-time new token alerts</li>
                <li>&#x2713; Whale movement alerts</li>
                <li>&#x2713; Unlimited snipes</li>
                <li>&#x2713; 0.5% trading fees (vs 1%)</li>
                <li>&#x2713; Copy trading</li>
                <li>&#x2713; Webhook alerts</li>
              </ul>
              <a href="https://t.me/solscanitbot?start=premium" className="block text-center bg-yellow-600 hover:bg-yellow-700 py-2 rounded-lg font-bold text-sm">Get Premium (0.1 SOL)</a>
            </div>
          </div>
        </div>
        <div className="text-center">
          <a href="https://t.me/solscanitbot" target="_blank" className="inline-block bg-gradient-to-r from-yellow-500 to-orange-600 text-white font-bold py-4 px-10 rounded-xl text-lg hover:opacity-90">Join Sol Scanner Now</a>
          <p className="text-gray-500 mt-4 text-sm">Pay with SOL or 250 Telegram Stars. Cancel anytime.</p>
        </div>
      </div>
    </div>
  );
}
