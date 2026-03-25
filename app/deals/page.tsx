"use client";

const DEALS = [
  { name: "Vercel Pro", desc: "Deploy unlimited projects. $20/mo.", deal: "Free hobby tier", url: "https://vercel.com/pricing", hot: true },
  { name: "Railway", desc: "Deploy backends instantly.", deal: "$5 free credit/mo", url: "https://railway.app", hot: true },
  { name: "Supabase", desc: "Postgres + Auth + Storage.", deal: "Free tier: 500MB", url: "https://supabase.com/pricing" },
  { name: "Cloudflare", desc: "CDN + Workers + Tunnels.", deal: "Free tier generous", url: "https://cloudflare.com" },
  { name: "GitHub Pro", desc: "Private repos + Copilot.", deal: "Free for students", url: "https://education.github.com" },
  { name: "Figma", desc: "Design + prototyping.", deal: "Free for 3 projects", url: "https://figma.com/pricing" },
  { name: "Notion", desc: "Notes + docs + projects.", deal: "Free personal plan", url: "https://notion.so/pricing" },
  { name: "Linear", desc: "Issue tracking.", deal: "Free for small teams", url: "https://linear.app/pricing" },
  { name: "Helius", desc: "Solana RPC + webhooks.", deal: "Free: 50K credits/day", url: "https://helius.dev" },
  { name: "Adsterra", desc: "Ad monetization.", deal: "No minimum traffic", url: "https://adsterra.com", hot: true },
];

export default function DealsPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-3xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-extrabold mb-2 text-center">Developer Deals</h1>
        <p className="text-gray-400 text-center mb-8">Free tiers and deals on dev tools. Updated March 2026.</p>
        <div className="space-y-3">
          {DEALS.map((d, i) => (
            <a key={i} href={d.url} target="_blank" rel="noopener" className="flex items-center justify-between bg-gray-900 rounded-xl p-4 hover:bg-gray-800 transition-colors">
              <div className="flex items-center gap-3">
                {d.hot && <span className="text-xs bg-red-600 text-white px-1.5 py-0.5 rounded font-bold">HOT</span>}
                <div>
                  <div className="font-bold text-sm">{d.name}</div>
                  <div className="text-xs text-gray-400">{d.desc}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-green-400 font-bold">{d.deal}</div>
                <div className="text-xs text-gray-500">Visit &rarr;</div>
              </div>
            </a>
          ))}
        </div>
        <div className="bg-gray-900 rounded-xl p-6 text-center mt-8">
          <p className="text-sm text-gray-400 mb-3">Want to list your tool here? Reach 1000+ monthly developers.</p>
          <a href="https://t.me/solscanitbot" className="inline-block bg-purple-600 hover:bg-purple-700 py-2 px-6 rounded-lg font-bold text-sm">Sponsor a Listing (0.5 SOL)</a>
        </div>
        <div className="mt-8 text-center text-gray-500 text-sm">
          <a href="/resources" className="text-purple-400 hover:underline">Resources</a>{" | "}
          <a href="/startup-toolkit" className="text-purple-400 hover:underline">Startup Toolkit</a>{" | "}
          <a href="/best/ai-tools-developers" className="text-purple-400 hover:underline">Best AI Tools</a>{" | "}
          <a href="/" className="text-purple-400 hover:underline">All Tools</a>
        </div>
      </div>
    </div>
  );
}
