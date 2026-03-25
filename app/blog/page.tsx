"use client";

const POSTS = [
  { title: "How We Built 800+ Dev Tools on One Site", date: "March 25, 2026", slug: "800-tools", excerpt: "From JSON formatter to trading bot — the journey of building a massive developer tools platform with zero hosting cost." },
  { title: "5 Micro-SaaS Ideas With Solana Payments", date: "March 24, 2026", slug: "micro-saas", excerpt: "Payment buttons, token scanner API, sniper service, whale tracker, code templates — all monetized with SOL." },
  { title: "Why I Switched to Helius RPC for My Trading Bot", date: "March 24, 2026", slug: "helius-rpc", excerpt: "The public Solana RPC was too slow for sniping. Helius changed everything." },
  { title: "Building a Telegram Mini App From Scratch", date: "March 23, 2026", slug: "mini-app", excerpt: "5 screens, 16 API endpoints, HMAC auth, dark theme UI — shipped in one session." },
  { title: "How MEV Protection Works on Solana", date: "March 23, 2026", slug: "mev-protection", excerpt: "Jito bundles prevent sandwich attacks. Here is how I integrated them." },
];

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-3xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-extrabold mb-2 text-center">Blog</h1>
        <p className="text-gray-400 text-center mb-8">Building in public. Dev logs, tutorials, and insights.</p>
        <div className="space-y-6">
          {POSTS.map((p,i) => (
            <article key={i} className="bg-gray-900 rounded-xl p-6 hover:bg-gray-800 transition-colors">
              <div className="text-xs text-gray-500 mb-2">{p.date}</div>
              <h2 className="text-xl font-bold mb-2">{p.title}</h2>
              <p className="text-gray-400 text-sm mb-3">{p.excerpt}</p>
              <a href={`https://dev.to/tatelyman`} target="_blank" className="text-purple-400 text-sm hover:underline">Read on Dev.to &rarr;</a>
            </article>
          ))}
        </div>
        <div className="mt-8 text-center">
          <a href="https://dev.to/tatelyman" target="_blank" className="inline-block bg-gray-800 hover:bg-gray-700 py-2 px-6 rounded-lg font-bold text-sm">All articles on Dev.to</a>
        </div>
        <div className="mt-8 text-center text-gray-500 text-sm">
          <a href="/changelog" className="text-purple-400 hover:underline">Changelog</a>{" | "}
          <a href="/daily" className="text-purple-400 hover:underline">Daily Tip</a>{" | "}
          <a href="/telegram" className="text-purple-400 hover:underline">Telegram</a>{" | "}
          <a href="/" className="text-purple-400 hover:underline">All Tools</a>
        </div>
      </div>
    </div>
  );
}
