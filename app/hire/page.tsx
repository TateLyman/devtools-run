"use client";

const SERVICES = [
  { name: "Telegram Bot", price: "From 1 SOL", time: "3-7 days", desc: "Custom Telegram bot with any features. Trading, alerts, automation, games, payments.", features: ["Custom commands", "Database integration", "API connections", "Telegram Stars payments", "Deployment support"] },
  { name: "Web App / SaaS", price: "From 3 SOL", time: "1-2 weeks", desc: "Full-stack web application. Next.js + your choice of backend and database.", features: ["Responsive design", "User auth", "Database", "API routes", "Vercel deployment"] },
  { name: "Smart Contract", price: "From 2 SOL", time: "1-2 weeks", desc: "Solana program in Rust/Anchor. Token creation, vaults, escrow, custom logic.", features: ["Anchor framework", "Unit tests", "Devnet deployment", "Documentation", "Mainnet support"] },
  { name: "API / Backend", price: "From 1 SOL", time: "3-5 days", desc: "REST API, webhooks, data processing, integrations. Node.js or Python.", features: ["RESTful endpoints", "Authentication", "Rate limiting", "Documentation", "Monitoring"] },
  { name: "Automation", price: "From 0.5 SOL", time: "1-3 days", desc: "Automate repetitive tasks. Scraping, posting, monitoring, data pipelines.", features: ["Custom scripts", "Scheduling (cron)", "Error handling", "Logging", "Deployment"] },
  { name: "Landing Page", price: "From 0.3 SOL", time: "1-2 days", desc: "High-converting landing page. Dark theme, responsive, fast.", features: ["Custom design", "SEO optimized", "Mobile responsive", "Vercel hosting", "Analytics ready"] },
];

export default function HirePage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-extrabold mb-2 text-center">Hire a Developer</h1>
        <p className="text-gray-400 text-center mb-8">Production-ready code, shipped fast. Pay in SOL or fiat.</p>
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {SERVICES.map((s, i) => (
            <div key={i} className="bg-gray-900 rounded-xl p-6">
              <div className="flex justify-between mb-2">
                <h3 className="font-bold text-lg">{s.name}</h3>
                <span className="text-green-400 font-bold">{s.price}</span>
              </div>
              <p className="text-sm text-gray-400 mb-1">{s.desc}</p>
              <p className="text-xs text-gray-500 mb-3">Delivery: {s.time}</p>
              <ul className="space-y-1 mb-4">
                {s.features.map((f, j) => <li key={j} className="text-xs text-gray-300">&#x2713; {f}</li>)}
              </ul>
              <a href="https://t.me/solscanitbot" className="block text-center bg-purple-600 hover:bg-purple-700 py-2 rounded-lg font-bold text-sm">Get a Quote</a>
            </div>
          ))}
        </div>
        <div className="bg-gray-900 rounded-xl p-8 text-center">
          <h2 className="font-bold text-xl mb-2">Portfolio</h2>
          <p className="text-gray-400 text-sm mb-4">4,500-line trading bot, 750+ page dev tools site, Telegram Mini App, automated content systems, smart contracts.</p>
          <div className="flex gap-3 justify-center">
            <a href="https://github.com/TateLyman" target="_blank" className="bg-gray-700 hover:bg-gray-600 py-2 px-4 rounded-lg font-bold text-sm">GitHub</a>
            <a href="https://x.com/solscanitbot" target="_blank" className="bg-gray-700 hover:bg-gray-600 py-2 px-4 rounded-lg font-bold text-sm">X / Twitter</a>
            <a href="https://t.me/solscanitbot" target="_blank" className="bg-purple-600 hover:bg-purple-700 py-2 px-4 rounded-lg font-bold text-sm">DM on Telegram</a>
          </div>
        </div>
      </div>
    </div>
  );
}
