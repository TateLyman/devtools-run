import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Social Scheduler — Auto-Post to Dev.to, Hashnode, Bluesky | 0.1 SOL/month",
  description: "Schedule posts to Dev.to, Hashnode, and Bluesky from one dashboard. Write once, publish everywhere. Auto-cross-post. Starting at 0.1 SOL/month.",
  keywords: ["social media scheduler", "dev.to scheduler", "hashnode auto post", "bluesky scheduler", "content scheduler", "cross-post tool"],
};

export default function SocialScheduler() {
  return (
    <div className="space-y-8">
      <section className="text-center">
        <div className="inline-block bg-blue-900/50 text-blue-400 text-xs font-bold px-3 py-1 rounded-full border border-blue-700/50 mb-4">
          LAUNCHING SOON
        </div>
        <h1 className="text-4xl font-bold mb-4">Social Scheduler</h1>
        <p className="text-xl text-[var(--text-secondary)] max-w-2xl mx-auto">
          Write once, publish everywhere. Schedule posts to Dev.to, Hashnode, Bluesky, and Mastodon from one dashboard.
        </p>
        <div className="mt-6 flex gap-4 justify-center items-center">
          <span className="text-3xl font-bold text-emerald-400">0.1 SOL/mo</span>
          <span className="text-gray-500 line-through">0.3 SOL</span>
          <span className="bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded">LAUNCH PRICE</span>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        {[
          { icon: "📝", title: "Write Once", desc: "Write your article in Markdown. We format it perfectly for each platform." },
          { icon: "🔄", title: "Cross-Post", desc: "Publish to Dev.to, Hashnode, Bluesky, and Mastodon with one click. Canonical URLs handled." },
          { icon: "📅", title: "Schedule", desc: "Set it and forget it. Schedule posts for optimal times. Queue up a week of content." },
          { icon: "📊", title: "Analytics", desc: "Track views, reactions, and comments across all platforms in one dashboard." },
          { icon: "🏷️", title: "Smart Tags", desc: "Auto-suggest tags based on content. Different tags per platform for maximum reach." },
          { icon: "🤖", title: "AI Assist", desc: "Generate titles, descriptions, and social snippets. A/B test different hooks." },
        ].map((f) => (
          <div key={f.title} className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-6">
            <div className="text-3xl mb-3">{f.icon}</div>
            <h3 className="font-bold text-lg mb-2">{f.title}</h3>
            <p className="text-sm text-[var(--text-secondary)]">{f.desc}</p>
          </div>
        ))}
      </section>

      <section className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-8">
        <h2 className="text-2xl font-bold mb-4 text-center">Supported Platforms</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
          {[
            { name: "Dev.to", desc: "Articles + API key", color: "text-white" },
            { name: "Hashnode", desc: "Articles + token", color: "text-blue-400" },
            { name: "Bluesky", desc: "Posts + app password", color: "text-sky-400" },
            { name: "Mastodon", desc: "Posts + access token", color: "text-purple-400" },
          ].map((p) => (
            <div key={p.name} className="bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg p-4 text-center">
              <h3 className={`font-bold ${p.color}`}>{p.name}</h3>
              <p className="text-xs text-gray-400 mt-1">{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-8">
        <h2 className="text-2xl font-bold mb-4 text-center">Why Developers Love It</h2>
        <div className="grid gap-3 md:grid-cols-2 max-w-2xl mx-auto text-sm">
          {[
            "Canonical URLs automatically set — no duplicate content penalties",
            "Platform-specific formatting (Dev.to front matter, Hashnode GraphQL, etc.)",
            "Bulk import from Markdown files or GitHub repos",
            "Runs on YOUR API keys — we never store your tokens on our servers",
            "Pay with SOL — no credit card, no KYC, no age verification",
            "Queue up a month of content in 10 minutes",
          ].map((item) => (
            <p key={item} className="flex items-start gap-2">
              <span className="text-emerald-400 shrink-0">✓</span> {item}
            </p>
          ))}
        </div>
      </section>

      <section className="text-center bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-blue-500/20 rounded-xl p-8">
        <h2 className="text-2xl font-bold mb-2">Join the Waitlist</h2>
        <p className="text-[var(--text-secondary)] mb-4">Early adopters get lifetime 0.1 SOL/month pricing (normally 0.3 SOL).</p>
        <a href="https://t.me/solscanitbot" target="_blank" className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg font-bold inline-block">
          Join via Telegram
        </a>
        <p className="text-xs text-gray-500 mt-2">Or DM @solscanitbot with "scheduler waitlist"</p>
      </section>
    </div>
  );
}
