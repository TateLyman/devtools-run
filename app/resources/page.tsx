"use client";

const RESOURCES = [
  { name: "Vercel", desc: "Deploy frontend apps. Free tier.", url: "https://vercel.com", category: "Hosting" },
  { name: "Helius", desc: "Solana RPC, webhooks, DAS API.", url: "https://helius.dev", category: "Blockchain" },
  { name: "Railway", desc: "Deploy any backend. Simple pricing.", url: "https://railway.app", category: "Hosting" },
  { name: "Supabase", desc: "Open-source Firebase alternative.", url: "https://supabase.com", category: "Database" },
  { name: "Cloudflare", desc: "CDN, DNS, Workers, tunnels.", url: "https://cloudflare.com", category: "Infrastructure" },
  { name: "Jupiter", desc: "Solana DEX aggregator API.", url: "https://jup.ag", category: "Blockchain" },
  { name: "Jito", desc: "MEV protection for Solana.", url: "https://jito.wtf", category: "Blockchain" },
  { name: "Adsterra", desc: "Ad network for publishers.", url: "https://adsterra.com", category: "Monetization" },
  { name: "Dev.to", desc: "Developer blogging platform.", url: "https://dev.to", category: "Content" },
  { name: "Hashnode", desc: "Developer blog with custom domain.", url: "https://hashnode.com", category: "Content" },
  { name: "LaborX", desc: "Crypto freelance marketplace.", url: "https://laborx.com", category: "Freelance" },
  { name: "Superteam", desc: "Solana bounties and grants.", url: "https://superteam.fun", category: "Freelance" },
  { name: "GitHub", desc: "Code hosting and collaboration.", url: "https://github.com", category: "Dev Tools" },
  { name: "Cursor", desc: "AI-powered code editor.", url: "https://cursor.com", category: "Dev Tools" },
  { name: "Figma", desc: "Design and prototyping tool.", url: "https://figma.com", category: "Design" },
];

const categories = [...new Set(RESOURCES.map(r => r.category))];

export default function ResourcesPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-extrabold mb-2 text-center">Developer Resources</h1>
        <p className="text-gray-400 text-center mb-8">Tools, platforms, and services we use and recommend.</p>
        {categories.map(cat => (
          <div key={cat} className="mb-8">
            <h2 className="text-lg font-bold text-purple-400 mb-3">{cat}</h2>
            <div className="grid md:grid-cols-2 gap-3">
              {RESOURCES.filter(r => r.category === cat).map((r, i) => (
                <a key={i} href={r.url} target="_blank" rel="noopener" className="bg-gray-900 rounded-lg p-4 hover:bg-gray-800 transition-colors flex justify-between items-center">
                  <div>
                    <div className="font-bold text-sm">{r.name}</div>
                    <div className="text-xs text-gray-400">{r.desc}</div>
                  </div>
                  <span className="text-gray-500 text-xs">&#x2197;</span>
                </a>
              ))}
            </div>
          </div>
        ))}
        <div className="mt-8 text-center text-gray-500 text-sm">
          <a href="/store" className="text-purple-400 hover:underline">Digital Store</a>{" | "}
          <a href="/templates" className="text-purple-400 hover:underline">Code Templates</a>{" | "}
          <a href="/sol-bot" className="text-purple-400 hover:underline">Trading Bot</a>{" | "}
          <a href="/" className="text-purple-400 hover:underline">All Tools</a>
        </div>
      </div>
    </div>
  );
}
