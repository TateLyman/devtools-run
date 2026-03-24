"use client";

const RECIPIENT = "NaTTUfDDQ8U1RBqb9q5rz6vJ22cWrrT5UAsXuxnb2Wr";

const TEMPLATES = [
  {
    name: "Trading Bot Starter",
    desc: "Basic Solana trading bot — Jupiter swaps, wallet management, buy/sell commands.",
    price: "0.3 SOL", priceSol: 0.3,
    features: ["Jupiter V6 swaps", "Wallet generation", "Buy/sell commands", "Balance checking", "Telegram Bot API"],
    lines: "~800", lang: "Node.js",
  },
  {
    name: "Sniper Bot",
    desc: "Auto-snipe pump.fun launches with safety filtering + Jito MEV protection.",
    price: "0.5 SOL", priceSol: 0.5,
    features: ["DexScreener detection", "Pump.fun execution", "Safety scoring", "Jito MEV protection", "Rate limiting"],
    lines: "~1,200", lang: "Node.js",
  },
  {
    name: "Copy Trading Bot",
    desc: "Mirror any Solana wallet's trades automatically with configurable sizes.",
    price: "0.5 SOL", priceSol: 0.5,
    features: ["60s wallet monitoring", "Auto trade mirroring", "Multi-wallet", "Telegram alerts"],
    lines: "~1,000", lang: "Node.js",
  },
  {
    name: "Token Scanner API",
    desc: "REST API scoring tokens 0-100 on risk signals. Deploy on Vercel.",
    price: "0.3 SOL", priceSol: 0.3,
    features: ["Mint/freeze authority", "Holder analysis", "Jupiter verification", "JSON REST API"],
    lines: "~400", lang: "TypeScript",
  },
  {
    name: "Full Trading Suite",
    desc: "Complete 4,500-line bot: trading, sniping, copy trading, DCA, orders, scanner, premium, referrals, Mini App.",
    price: "1 SOL", priceSol: 1, popular: true,
    features: ["44 commands", "Jupiter + Jito + pump.fun", "Copy trading + DCA", "SL/TP + limit orders", "3-tier referrals", "Premium subs", "Stars payments", "Mini App UI", "12 background workers"],
    lines: "4,500+", lang: "Node.js",
  },
  {
    name: "Content Engine",
    desc: "Auto-publish articles to Dev.to, Hashnode, Reddit, Bluesky, Mastodon on a schedule.",
    price: "0.3 SOL", priceSol: 0.3,
    features: ["8 templates x 5 variants", "Multi-platform publishing", "Reddit auto-poster", "Cron scheduling"],
    lines: "~2,000", lang: "Node.js",
  },
];

export default function TemplatesPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-5xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold mb-4">Production Bot Templates</h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Skip months of dev work. Battle-tested code you own completely — no license, no royalties.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {TEMPLATES.map((t, i) => (
            <div key={i} className={`bg-gray-900 rounded-2xl p-6 border ${t.popular ? "border-orange-500 ring-2 ring-orange-500/20" : "border-gray-800"}`}>
              {t.popular && <div className="text-xs font-bold text-orange-400 uppercase mb-2">Best Value</div>}
              <div className="flex justify-between mb-2">
                <h3 className="text-lg font-bold">{t.name}</h3>
                <div className="text-lg font-extrabold text-green-400">{t.price}</div>
              </div>
              <p className="text-gray-400 text-sm mb-3">{t.desc}</p>
              <div className="flex gap-2 mb-3 text-xs">
                <span className="bg-gray-800 px-2 py-1 rounded">{t.lang}</span>
                <span className="bg-gray-800 px-2 py-1 rounded">{t.lines} lines</span>
              </div>
              <ul className="space-y-1 mb-4">
                {t.features.map((f, j) => (
                  <li key={j} className="text-xs text-gray-300">&#x2713; {f}</li>
                ))}
              </ul>
              <a href={`/sol-pay/checkout?to=${RECIPIENT}&amount=${t.priceSol}&label=${encodeURIComponent(t.name)}&fee=${RECIPIENT}&feePct=0`}
                className={`block text-center py-2.5 rounded-xl font-bold text-sm ${t.popular ? "bg-orange-600 hover:bg-orange-700" : "bg-gray-700 hover:bg-gray-600"}`}>
                Buy {t.price}
              </a>
            </div>
          ))}
        </div>
        <div className="text-center text-gray-500 text-sm">
          Pay in SOL. Code delivered via GitHub. DM <a href="https://x.com/solscanitbot" className="text-orange-400">@solscanitbot</a> with questions.
        </div>
      </div>
    </div>
  );
}
