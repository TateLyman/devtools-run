"use client";

export default function CreateTokenPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-3xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-extrabold mb-2 text-center">Create a Solana Token</h1>
        <p className="text-gray-400 text-center mb-8">Launch your own SPL token on Solana in under a minute. No coding required.</p>
        <div className="bg-gray-900 rounded-xl p-8 mb-8">
          <h2 className="text-xl font-bold mb-4">Two Ways to Launch</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gray-800 rounded-xl p-6">
              <h3 className="font-bold text-lg mb-2 text-purple-400">Via Telegram Bot</h3>
              <p className="text-gray-400 text-sm mb-4">Use our bot to create a token on pump.fun with one command. Includes auto-listing, metadata setup, and buy buttons.</p>
              <ul className="text-sm text-gray-300 space-y-1 mb-4">
                <li>&#x2713; One command: /create name symbol description</li>
                <li>&#x2713; Auto-listed on pump.fun</li>
                <li>&#x2713; Instant trading enabled</li>
                <li>&#x2713; 0.2 SOL service fee</li>
              </ul>
              <a href="https://t.me/solscanitbot" target="_blank"
                className="block text-center py-3 rounded-xl bg-purple-600 hover:bg-purple-700 font-bold transition-colors">
                Open Bot
              </a>
            </div>
            <div className="bg-gray-800 rounded-xl p-6">
              <h3 className="font-bold text-lg mb-2 text-green-400">DIY (Developer)</h3>
              <p className="text-gray-400 text-sm mb-4">Get our token creation script as part of the DeFi Toolkit. Full control over supply, decimals, metadata, and authorities.</p>
              <ul className="text-sm text-gray-300 space-y-1 mb-4">
                <li>&#x2713; Custom supply and decimals</li>
                <li>&#x2713; Set/revoke mint authority</li>
                <li>&#x2713; Upload metadata to Arweave</li>
                <li>&#x2713; Full source code included</li>
              </ul>
              <a href="/sol-defi-toolkit"
                className="block text-center py-3 rounded-xl bg-green-600 hover:bg-green-700 font-bold transition-colors">
                Get DeFi Toolkit (0.3 SOL)
              </a>
            </div>
          </div>
        </div>
        <div className="bg-gray-900 rounded-xl p-8 mb-8">
          <h2 className="text-xl font-bold mb-4">After You Launch</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-gray-800 rounded-lg p-4 text-center">
              <div className="text-2xl mb-2">&#x1F4E2;</div>
              <div className="font-bold text-sm">Promote It</div>
              <div className="text-xs text-gray-400 mt-1">Feature your token in /trending for 0.5 SOL/24h</div>
            </div>
            <div className="bg-gray-800 rounded-lg p-4 text-center">
              <div className="text-2xl mb-2">&#x1F4A5;</div>
              <div className="font-bold text-sm">Bump Volume</div>
              <div className="text-xs text-gray-400 mt-1">Generate real on-chain volume with our bump bot</div>
            </div>
            <div className="bg-gray-800 rounded-lg p-4 text-center">
              <div className="text-2xl mb-2">&#x1F50D;</div>
              <div className="font-bold text-sm">Safety Score</div>
              <div className="text-xs text-gray-400 mt-1">Check your token's score to build trust</div>
            </div>
          </div>
        </div>
        <div className="text-center text-gray-500 text-sm">
          <a href="/sol-bot" className="text-purple-400 hover:underline">Trading Bot</a>{" | "}
          <a href="/templates" className="text-purple-400 hover:underline">Dev Templates</a>{" | "}
          <a href="/sol-pay" className="text-purple-400 hover:underline">Accept Payments</a>{" | "}
          <a href="/is-safe" className="text-purple-400 hover:underline">Token Scanner</a>
        </div>
      </div>
    </div>
  );
}
