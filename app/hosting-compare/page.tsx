import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Best Web Hosting 2026 — Compare Vercel, Netlify, Railway, Render",
  description: "Compare web hosting platforms for developers. Vercel vs Netlify vs Railway vs Render vs Fly.io. Free tiers, pricing, features. Updated March 2026.",
  keywords: ["best web hosting", "Vercel vs Netlify", "free web hosting", "hosting comparison", "developer hosting 2026", "Railway vs Render"],
};

const hosts = [
  {
    name: "Vercel",
    logo: "▲",
    freeTier: "100GB bandwidth, serverless functions, edge network",
    price: "Free → $20/mo Pro",
    bestFor: "Next.js, React, static sites",
    pros: ["Best Next.js support", "Edge Functions", "Instant deploys", "Preview deployments"],
    cons: ["Hobby plan limits", "No persistent storage", "Cold starts on functions"],
    url: "https://vercel.com",
  },
  {
    name: "Netlify",
    logo: "◆",
    freeTier: "100GB bandwidth, serverless functions, forms",
    price: "Free → $19/mo Pro",
    bestFor: "Static sites, JAMstack, forms",
    pros: ["Built-in forms", "Identity/auth", "Great DX", "Split testing"],
    cons: ["Slower builds than Vercel", "Functions limited", "Plugin ecosystem fragmented"],
    url: "https://netlify.com",
  },
  {
    name: "Railway",
    logo: "🚂",
    freeTier: "$5 free credits/month, then pay-as-you-go",
    price: "$5 credit → usage-based",
    bestFor: "Backend apps, databases, full-stack",
    pros: ["Easy database setup", "Docker support", "Persistent storage", "Fair pricing"],
    cons: ["No permanent free tier", "Smaller ecosystem", "Less edge support"],
    url: "https://railway.app",
  },
  {
    name: "Render",
    logo: "⬡",
    freeTier: "Static sites free, web services with limits",
    price: "Free → $7/mo",
    bestFor: "Full-stack apps, APIs, background workers",
    pros: ["Free PostgreSQL", "Cron jobs", "Auto-scaling", "Docker native"],
    cons: ["Slow free tier (spins down)", "Build times", "Limited free bandwidth"],
    url: "https://render.com",
  },
  {
    name: "Fly.io",
    logo: "✈",
    freeTier: "3 shared VMs, 160GB outbound",
    price: "Free → usage-based",
    bestFor: "Global edge deployment, containers",
    pros: ["Global edge", "Persistent volumes", "Full Docker", "WebSockets"],
    cons: ["Complex setup", "CLI-heavy", "Billing surprises", "Steep learning curve"],
    url: "https://fly.io",
  },
  {
    name: "Cloudflare Pages",
    logo: "☁",
    freeTier: "Unlimited bandwidth, 500 builds/month",
    price: "Free → $5/mo",
    bestFor: "Static sites, Workers, global CDN",
    pros: ["Unlimited bandwidth FREE", "Workers integration", "Fastest CDN", "KV storage"],
    cons: ["Limited framework support", "Workers limitations", "No traditional server"],
    url: "https://pages.cloudflare.com",
  },
];

export default function HostingCompare() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Best Web Hosting for Developers (2026)</h1>
        <p className="text-[var(--text-secondary)]">
          Compare the best hosting platforms for developers. Free tiers, pricing, features, pros and cons. Updated March 2026.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--border)]">
              <th className="text-left py-3 px-2">Platform</th>
              <th className="text-left py-3 px-2">Free Tier</th>
              <th className="text-left py-3 px-2">Pricing</th>
              <th className="text-left py-3 px-2">Best For</th>
            </tr>
          </thead>
          <tbody>
            {hosts.map((h) => (
              <tr key={h.name} className="border-b border-[var(--border)] hover:bg-[var(--bg-secondary)]">
                <td className="py-3 px-2">
                  <a href={h.url} target="_blank" rel="noopener" className="font-bold text-purple-400 hover:text-purple-300">{h.logo} {h.name}</a>
                </td>
                <td className="py-3 px-2 text-xs text-[var(--text-secondary)]">{h.freeTier}</td>
                <td className="py-3 px-2 text-xs text-white">{h.price}</td>
                <td className="py-3 px-2 text-xs text-[var(--text-secondary)]">{h.bestFor}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="space-y-4">
        {hosts.map((h) => (
          <div key={h.name} className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-bold text-white">{h.logo} {h.name}</h2>
              <a href={h.url} target="_blank" rel="noopener" className="text-xs text-purple-400 hover:text-purple-300">Visit →</a>
            </div>
            <p className="text-sm text-[var(--text-secondary)] mb-3">{h.bestFor} — {h.price}</p>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <h4 className="font-bold text-emerald-400 mb-1">Pros</h4>
                {h.pros.map((p) => <p key={p} className="text-[var(--text-secondary)]">✓ {p}</p>)}
              </div>
              <div>
                <h4 className="font-bold text-red-400 mb-1">Cons</h4>
                {h.cons.map((c) => <p key={c} className="text-[var(--text-secondary)]">✗ {c}</p>)}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-purple-600/10 border border-purple-500/30 rounded-lg p-4 text-sm text-center">
        <p className="text-purple-300">
          <strong>Our pick:</strong> <a href="https://vercel.com" className="underline">Vercel</a> for frontend/Next.js, <a href="https://railway.app" className="underline">Railway</a> for backend + databases.
        </p>
      </div>
    </div>
  );
}
