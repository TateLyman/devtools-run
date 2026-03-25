"use client";

const PRODUCTS = [
  { name: "50+ AI Prompts for Developers", price: "0.1 SOL", desc: "Claude, GPT, Copilot prompts for code review, debugging, refactoring, documentation.", category: "Templates", link: "/prompt-pack" },
  { name: "Solana DeFi Toolkit", price: "0.3 SOL", desc: "10 Node.js scripts: token sniping, LP management, airdrop checker, wallet scanner.", category: "Code", link: "/sol-defi-toolkit" },
  { name: "Trading Bot Source Code", price: "1 SOL", desc: "Complete 4,500-line Telegram trading bot. 44 commands, copy trading, DCA, Mini App.", category: "Code", link: "/sol-bot-source" },
  { name: "Grid Trading Bot", price: "0.5 SOL", desc: "Python grid trading bot for Solana DEXs. Automated buy/sell within price ranges.", category: "Code", link: "/sol-grid-bot" },
  { name: "Trading Guide", price: "0.2 SOL", desc: "Solana trading strategies, MEV protection, pump.fun sniping, risk management.", category: "Guide", link: "/sol-trading-guide" },
  { name: "Everything Bundle", price: "2 SOL", desc: "All 5 products above. Best value — save 40%.", category: "Bundle", link: "/bundle" },
  { name: "Content Engine", price: "0.3 SOL", desc: "Auto-publish to Dev.to, Hashnode, Reddit, Bluesky. 2x/day scheduled.", category: "Code", link: "/templates" },
  { name: "Sniper Bot Template", price: "0.5 SOL", desc: "Pump.fun auto-sniper with safety filtering and Jito MEV protection.", category: "Code", link: "/templates" },
  { name: "Copy Trading Bot", price: "0.5 SOL", desc: "Mirror any Solana wallet's trades. Configurable sizes.", category: "Code", link: "/templates" },
  { name: "Token Scanner API", price: "0.08 SOL", desc: "1,000 scans/day. Score any token 0-100.", category: "API Key", link: "/api-access" },
];

export default function StorePage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-5xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-extrabold mb-2 text-center">Digital Store</h1>
        <p className="text-gray-400 text-center mb-8">Code, templates, guides, and API access. Pay in SOL. Instant delivery.</p>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {PRODUCTS.map((p, i) => (
            <a key={i} href={p.link} className="bg-gray-900 rounded-xl p-5 hover:bg-gray-800 transition-colors block">
              <div className="flex justify-between mb-2">
                <span className="text-xs bg-purple-600/20 text-purple-300 px-2 py-0.5 rounded">{p.category}</span>
                <span className="font-bold text-green-400">{p.price}</span>
              </div>
              <h3 className="font-bold mb-1">{p.name}</h3>
              <p className="text-gray-400 text-xs">{p.desc}</p>
            </a>
          ))}
        </div>
        <div className="mt-8 text-center text-gray-500 text-sm">
          Pay with SOL. Code delivered via GitHub. <a href="https://t.me/solscanitbot" className="text-purple-400">Questions? DM the bot</a>
        </div>
      </div>
    </div>
  );
}
