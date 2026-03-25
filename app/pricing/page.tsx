"use client";

const TIERS = [
  { category: "Trading Bot", items: [
    { name: "Free", price: "0", features: ["Buy/sell any Solana token", "1% trading fee", "3 snipes/hour", "Token safety scanner", "Portfolio tracking"] },
    { name: "Premium", price: "0.1 SOL/mo", features: ["0.5% trading fee (50% off)", "Unlimited snipes", "Copy trading", "Whale alerts", "Webhook alerts", "40% referral commission"], link: "https://t.me/solscanitbot?start=premium" },
  ]},
  { category: "Services", items: [
    { name: "Sniper Service", price: "0.2-5 SOL/mo", features: ["Auto-snipe new launches 24/7", "Safety score filtering", "Jito MEV protection", "Telegram alerts"], link: "/sniper" },
    { name: "Token Launch", price: "0.2-3 SOL", features: ["Create token on pump.fun", "Promotion in /trending", "Volume bumps", "Article + social posts"], link: "/launch-token" },
    { name: "Webhook Alerts", price: "0.05 SOL/mo", features: ["HTTP POST on events", "New tokens, whale moves, prices", "Unlimited events"], link: "/webhooks" },
  ]},
  { category: "Digital Products", items: [
    { name: "Full Bot Source", price: "1 SOL", features: ["4,500 lines, 44 commands", "Jupiter + Jito + pump.fun", "No license restrictions"], link: "/sol-bot-source" },
    { name: "Code Templates", price: "0.3-0.5 SOL", features: ["Sniper, copy trading, scanner", "Production-tested code", "Customize and deploy"], link: "/templates" },
    { name: "DeFi Toolkit", price: "0.3 SOL", features: ["10 Node.js scripts", "Token sniping, LP tools", "Airdrop checker"], link: "/sol-defi-toolkit" },
    { name: "Everything Bundle", price: "2 SOL", features: ["All 5 digital products", "Save 40%", "Lifetime access"], link: "/bundle" },
  ]},
  { category: "APIs", items: [
    { name: "Token Scanner", price: "0.08 SOL", features: ["1,000 scans/day", "Safety score 0-100", "JSON REST API"], link: "/api-access" },
    { name: "Unlimited Scanner", price: "0.4 SOL", features: ["100,000 scans/day", "60 req/min", "Priority support"], link: "/api-access" },
  ]},
  { category: "Advertising", items: [
    { name: "Token Promotion", price: "0.5 SOL/24h", features: ["Featured in /trending", "Buy buttons to all users", "Shown in daily digest"], link: "https://t.me/solscanitbot" },
    { name: "Sponsored Listing", price: "0.5 SOL/mo", features: ["Featured in Deals page", "Listed in Startup Toolkit", "Mentioned in articles"], link: "/submit-tool" },
    { name: "Job Posting", price: "0.5 SOL/30d", features: ["Listed on job board", "Shown to Solana developers", "30-day listing"], link: "/jobs" },
  ]},
  { category: "Freelance Development", items: [
    { name: "Landing Page", price: "From 0.3 SOL", features: ["Responsive, SEO optimized", "1-2 day delivery"], link: "/hire" },
    { name: "Telegram Bot", price: "From 1 SOL", features: ["Custom features", "3-7 day delivery"], link: "/hire" },
    { name: "Full Web App", price: "From 3 SOL", features: ["Next.js, auth, database", "1-2 week delivery"], link: "/hire" },
  ]},
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-5xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-extrabold mb-2 text-center">Pricing</h1>
        <p className="text-gray-400 text-center mb-8">Everything we offer. Pay in SOL, USDC, or Telegram Stars.</p>
        {TIERS.map((tier, i) => (
          <div key={i} className="mb-10">
            <h2 className="text-xl font-bold text-purple-400 mb-4">{tier.category}</h2>
            <div className="grid md:grid-cols-3 gap-4">
              {tier.items.map((item, j) => (
                <div key={j} className="bg-gray-900 rounded-xl p-5">
                  <h3 className="font-bold mb-1">{item.name}</h3>
                  <div className="text-xl font-extrabold text-green-400 mb-3">{item.price}</div>
                  <ul className="space-y-1 mb-4">
                    {item.features.map((f, k) => <li key={k} className="text-xs text-gray-300">&#x2713; {f}</li>)}
                  </ul>
                  {item.link && <a href={item.link} className="block text-center bg-purple-600 hover:bg-purple-700 py-2 rounded-lg font-bold text-xs">Get Started</a>}
                </div>
              ))}
            </div>
          </div>
        ))}
        <div className="text-center text-gray-500 text-sm mt-8">
          Questions? DM <a href="https://t.me/solscanitbot" className="text-purple-400">@solscanitbot</a> on Telegram or <a href="https://x.com/solscanitbot" className="text-purple-400">@solscanitbot</a> on X.
        </div>
      </div>
    </div>
  );
}
