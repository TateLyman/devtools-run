"use client";
import { useState } from "react";

const CHECKS = [
  { cat: "Technical SEO", items: ["Title tag under 60 chars", "Meta description 150-160 chars", "H1 tag present and unique", "Images have alt text", "Page loads under 3 seconds", "Mobile responsive", "HTTPS enabled", "Sitemap.xml exists", "Robots.txt configured", "No broken links (404s)", "Canonical URLs set", "Schema markup (JSON-LD)"] },
  { cat: "Content", items: ["Target keyword in title", "Target keyword in first 100 words", "Target keyword in H1", "At least 300 words", "Internal links to related pages", "External links to authority sources", "Unique content (not duplicated)", "FAQ section (for featured snippets)", "Updated date shown"] },
  { cat: "Performance", items: ["Core Web Vitals passing", "Images compressed (WebP)", "CSS/JS minified", "Lazy loading for images", "CDN configured", "Font loading optimized", "No render-blocking resources"] },
  { cat: "Social / Sharing", items: ["Open Graph title", "Open Graph description", "Open Graph image (1200x630)", "Twitter Card tags", "Favicon set", "Share buttons or copy link"] },
];

export default function SEOChecklistPage() {
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const total = CHECKS.reduce((s, c) => s + c.items.length, 0);
  const done = checked.size;

  const toggle = (item: string) => {
    const next = new Set(checked);
    next.has(item) ? next.delete(item) : next.add(item);
    setChecked(next);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-3xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-extrabold mb-2 text-center">SEO Checklist</h1>
        <p className="text-gray-400 text-center mb-2">Check off items as you optimize your page.</p>
        <div className="text-center mb-8">
          <span className={`text-2xl font-bold ${done === total ? "text-green-400" : "text-purple-400"}`}>{done}/{total}</span>
          <span className="text-gray-400 text-sm ml-2">completed</span>
          <div className="w-full bg-gray-800 rounded-full h-2 mt-2">
            <div className="bg-purple-600 h-2 rounded-full transition-all" style={{width: `${(done/total)*100}%`}} />
          </div>
        </div>
        {CHECKS.map((cat, i) => (
          <div key={i} className="mb-6">
            <h2 className="font-bold text-purple-400 mb-3">{cat.cat}</h2>
            <div className="space-y-1">
              {cat.items.map((item, j) => (
                <div key={j} className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-gray-900 cursor-pointer" onClick={() => toggle(item)}>
                  <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 ${checked.has(item) ? "bg-green-500 border-green-500" : "border-gray-600"}`}>
                    {checked.has(item) && <span className="text-xs">&#x2713;</span>}
                  </div>
                  <span className={`text-sm ${checked.has(item) ? "text-gray-500 line-through" : "text-gray-300"}`}>{item}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
        <div className="mt-8 text-center text-gray-500 text-sm">
          <a href="/meta-tags" className="text-purple-400 hover:underline">Meta Tag Generator</a>{" | "}
          <a href="/json-validator" className="text-purple-400 hover:underline">JSON Validator</a>{" | "}
          <a href="/uptime" className="text-purple-400 hover:underline">Uptime Monitor</a>{" | "}
          <a href="/" className="text-purple-400 hover:underline">All Tools</a>
        </div>
      </div>
    </div>
  );
}
