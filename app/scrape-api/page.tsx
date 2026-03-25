import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Web Scraping API — Extract Data from Any Website | 0.1 SOL/1000 requests",
  description: "Simple REST API for web scraping. Extract text, links, images, meta tags from any URL. No browser needed. Starting at 0.1 SOL per 1000 requests.",
  keywords: ["web scraping API", "scraping service", "data extraction API", "web crawler", "HTML parser API"],
};

export default function ScrapeAPI() {
  return (
    <div className="space-y-8">
      <section className="text-center">
        <h1 className="text-4xl font-bold mb-4">Web Scraping API</h1>
        <p className="text-xl text-[var(--text-secondary)] max-w-2xl mx-auto">
          Extract data from any website with a simple API call. Text, links, images, meta tags, structured data. No browser needed.
        </p>
        <div className="mt-6">
          <span className="text-3xl font-bold text-emerald-400">0.1 SOL</span>
          <span className="text-gray-400"> / 1,000 requests</span>
        </div>
      </section>

      <section className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-8 max-w-2xl mx-auto">
        <h2 className="font-bold text-lg mb-4">Quick Start</h2>
        <pre className="bg-[var(--bg-primary)] rounded-lg p-4 text-sm font-mono text-emerald-400 overflow-auto">{`// Extract all text and links from a page
curl "https://devtools-site-delta.vercel.app/api/scrape?url=https://example.com"

// Response
{
  "title": "Example Domain",
  "description": "This domain is for use in examples",
  "text": "Example Domain. This domain is for use in illustrative examples...",
  "links": ["https://www.iana.org/domains/example"],
  "images": [],
  "meta": {
    "og:title": "Example Domain",
    "og:type": "website"
  },
  "headings": {
    "h1": ["Example Domain"],
    "h2": []
  },
  "wordCount": 28,
  "responseTime": 342
}`}</pre>
      </section>

      <section className="grid gap-4 md:grid-cols-3 max-w-3xl mx-auto">
        {[
          { icon: "⚡", title: "Fast", desc: "Average response under 500ms. Cached results for repeated URLs." },
          { icon: "🔧", title: "Simple", desc: "One GET request. No SDKs, no libraries. Works from any language." },
          { icon: "📊", title: "Structured", desc: "Clean JSON output. Title, description, text, links, images, meta tags." },
        ].map((f) => (
          <div key={f.title} className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-4 text-center">
            <div className="text-2xl mb-2">{f.icon}</div>
            <h3 className="font-bold text-sm">{f.title}</h3>
            <p className="text-xs text-[var(--text-secondary)]">{f.desc}</p>
          </div>
        ))}
      </section>

      <section className="text-center">
        <h2 className="text-2xl font-bold mb-4">Pricing</h2>
        <div className="grid gap-4 md:grid-cols-3 max-w-2xl mx-auto">
          <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-4">
            <h3 className="font-bold">Free Tier</h3>
            <p className="text-2xl font-bold text-emerald-400 mt-1">100</p>
            <p className="text-xs text-gray-400">requests/day</p>
          </div>
          <div className="bg-purple-600/10 border-2 border-purple-500 rounded-lg p-4">
            <h3 className="font-bold">Starter</h3>
            <p className="text-2xl font-bold text-emerald-400 mt-1">0.1 SOL</p>
            <p className="text-xs text-gray-400">1,000 requests</p>
          </div>
          <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-4">
            <h3 className="font-bold">Pro</h3>
            <p className="text-2xl font-bold text-emerald-400 mt-1">0.5 SOL</p>
            <p className="text-xs text-gray-400">10,000 requests</p>
          </div>
        </div>
      </section>

      <section className="text-center">
        <a href="https://t.me/solscanitbot" target="_blank" className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg font-bold inline-block">
          Get API Key via Telegram
        </a>
        <p className="text-xs text-gray-500 mt-2">Free tier available — no payment required to start.</p>
      </section>
    </div>
  );
}
