"use client";

const LISTINGS = [
  { seller: "Sol Scanner", name: "Full Trading Bot Source", price: "1 SOL", category: "Code", desc: "4,500-line Telegram bot. 44 commands.", link: "/sol-bot-source" },
  { seller: "Sol Scanner", name: "Sniper Bot Template", price: "0.5 SOL", category: "Code", desc: "Auto-buy new launches with safety filter.", link: "/templates" },
  { seller: "Sol Scanner", name: "Content Engine", price: "0.3 SOL", category: "Automation", desc: "Auto-publish to 5 platforms daily.", link: "/templates" },
  { seller: "Sol Scanner", name: "DeFi Toolkit", price: "0.3 SOL", category: "Scripts", desc: "10 Solana DeFi scripts.", link: "/sol-defi-toolkit" },
  { seller: "Sol Scanner", name: "AI Prompt Pack", price: "0.1 SOL", category: "Templates", desc: "50+ prompts for Claude/GPT.", link: "/prompt-pack" },
];

export default function MarketplacePage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-extrabold mb-2 text-center">Digital Marketplace</h1>
        <p className="text-gray-400 text-center mb-2">Buy and sell digital products. Pay in SOL.</p>
        <p className="text-purple-400 text-center text-sm mb-8">Want to sell here? <a href="/submit-tool" className="underline">List your product</a> — 10% platform fee on sales.</p>
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          {LISTINGS.map((l,i) => (
            <a key={i} href={l.link} className="bg-gray-900 rounded-xl p-5 hover:bg-gray-800 transition-colors block">
              <div className="flex justify-between mb-2">
                <span className="text-xs bg-purple-600/20 text-purple-300 px-2 py-0.5 rounded">{l.category}</span>
                <span className="font-bold text-green-400">{l.price}</span>
              </div>
              <h3 className="font-bold mb-1">{l.name}</h3>
              <p className="text-xs text-gray-400 mb-2">{l.desc}</p>
              <div className="text-xs text-gray-500">by {l.seller}</div>
            </a>
          ))}
        </div>
        <div className="bg-gray-900 rounded-xl p-6 text-center">
          <h2 className="font-bold mb-2">Sell Your Digital Products</h2>
          <p className="text-sm text-gray-400 mb-4">List code, templates, courses, or tools. We handle payments (SOL). 10% platform fee.</p>
          <a href="/submit-tool" className="inline-block bg-purple-600 hover:bg-purple-700 py-2 px-6 rounded-lg font-bold text-sm">List a Product</a>
        </div>
      </div>
    </div>
  );
}
