"use client";
import { useState } from "react";

export default function SEOAudit() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const audit = async () => {
    if (!url.trim()) return;
    setLoading(true);
    let fullUrl = url.trim();
    if (!fullUrl.startsWith("http")) fullUrl = "https://" + fullUrl;

    try {
      const res = await fetch(`https://api.allorigins.win/raw?url=${encodeURIComponent(fullUrl)}`);
      const html = await res.text();

      const getMeta = (name: string): string => {
        const match = html.match(new RegExp(`<meta[^>]*(?:property|name)=["']${name}["'][^>]*content=["']([^"']*)["']`, "i"))
          || html.match(new RegExp(`<meta[^>]*content=["']([^"']*)["'][^>]*(?:property|name)=["']${name}["']`, "i"));
        return match?.[1] || "";
      };

      const titleMatch = html.match(/<title[^>]*>([^<]*)<\/title>/i);
      const title = titleMatch?.[1] || "";
      const description = getMeta("description");
      const ogTitle = getMeta("og:title");
      const ogDesc = getMeta("og:description");
      const ogImage = getMeta("og:image");
      const twitterCard = getMeta("twitter:card");
      const viewport = getMeta("viewport");
      const canonical = html.match(/rel=["']canonical["'][^>]*href=["']([^"']*)["']/i)?.[1] || "";
      const robots = getMeta("robots");

      // Count elements
      const h1Count = (html.match(/<h1/gi) || []).length;
      const h2Count = (html.match(/<h2/gi) || []).length;
      const imgCount = (html.match(/<img/gi) || []).length;
      const imgWithAlt = (html.match(/<img[^>]*alt=["'][^"']+["']/gi) || []).length;
      const linkCount = (html.match(/<a\s/gi) || []).length;
      const hasSSL = fullUrl.startsWith("https");

      // Score
      const checks: { name: string; pass: boolean; detail: string; weight: number }[] = [];

      checks.push({ name: "Title Tag", pass: title.length >= 30 && title.length <= 65, detail: title ? `${title.length} chars — "${title.slice(0, 60)}${title.length > 60 ? "..." : ""}"` : "MISSING", weight: 15 });
      checks.push({ name: "Meta Description", pass: description.length >= 120 && description.length <= 160, detail: description ? `${description.length} chars` : "MISSING", weight: 15 });
      checks.push({ name: "H1 Tag", pass: h1Count === 1, detail: `${h1Count} found (should be exactly 1)`, weight: 10 });
      checks.push({ name: "H2 Tags", pass: h2Count >= 1, detail: `${h2Count} found`, weight: 5 });
      checks.push({ name: "Open Graph Title", pass: !!ogTitle, detail: ogTitle || "MISSING", weight: 8 });
      checks.push({ name: "OG Description", pass: !!ogDesc, detail: ogDesc ? `${ogDesc.length} chars` : "MISSING", weight: 5 });
      checks.push({ name: "OG Image", pass: !!ogImage, detail: ogImage || "MISSING", weight: 8 });
      checks.push({ name: "Twitter Card", pass: !!twitterCard, detail: twitterCard || "MISSING", weight: 5 });
      checks.push({ name: "Viewport Meta", pass: !!viewport, detail: viewport ? "Present (mobile-friendly)" : "MISSING", weight: 10 });
      checks.push({ name: "Canonical URL", pass: !!canonical, detail: canonical || "Not set", weight: 5 });
      checks.push({ name: "HTTPS", pass: hasSSL, detail: hasSSL ? "Yes ✓" : "No — NOT SECURE", weight: 10 });
      checks.push({ name: "Image Alt Tags", pass: imgCount === 0 || imgWithAlt / imgCount > 0.8, detail: `${imgWithAlt}/${imgCount} images have alt text`, weight: 4 });

      const maxScore = checks.reduce((s, c) => s + c.weight, 0);
      const score = checks.reduce((s, c) => s + (c.pass ? c.weight : 0), 0);
      const pct = Math.round((score / maxScore) * 100);

      setResult({ checks, score: pct, title, url: fullUrl, h1Count, h2Count, imgCount, linkCount, htmlSize: html.length });
    } catch (e: any) {
      setResult({ error: e.message });
    }
    setLoading(false);
  };

  const scoreColor = (s: number) => s >= 80 ? "text-emerald-400" : s >= 50 ? "text-yellow-400" : "text-red-400";
  const scoreLabel = (s: number) => s >= 80 ? "Good" : s >= 50 ? "Needs Work" : "Poor";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">SEO Audit Tool</h1>
        <p className="text-[var(--text-secondary)]">
          Audit any webpage for SEO issues. Check meta tags, Open Graph, headings, images, HTTPS, and more. Free instant SEO audit.
        </p>
      </div>

      <div className="flex gap-2 max-w-lg mx-auto">
        <input value={url} onChange={(e) => setUrl(e.target.value)} onKeyDown={(e) => e.key === "Enter" && audit()} placeholder="https://example.com" className="flex-1 bg-[var(--bg-secondary)] border border-[var(--border)] rounded px-4 py-3 text-white font-mono text-sm" />
        <button onClick={audit} disabled={loading} className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white px-6 py-3 rounded font-bold">{loading ? "Auditing..." : "Audit"}</button>
      </div>

      {result && !result.error && (
        <div className="max-w-2xl mx-auto space-y-4">
          <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-6 text-center">
            <p className="text-xs text-gray-400 mb-1">SEO Score</p>
            <p className={`text-6xl font-bold ${scoreColor(result.score)}`}>{result.score}</p>
            <p className={`text-sm ${scoreColor(result.score)}`}>{scoreLabel(result.score)}</p>
            <p className="text-xs text-gray-500 mt-2">{result.url}</p>
          </div>

          <div className="grid grid-cols-4 gap-2 text-center">
            <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded p-2">
              <p className="text-lg font-bold text-white">{result.h1Count}</p>
              <p className="text-[10px] text-gray-400">H1 Tags</p>
            </div>
            <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded p-2">
              <p className="text-lg font-bold text-white">{result.h2Count}</p>
              <p className="text-[10px] text-gray-400">H2 Tags</p>
            </div>
            <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded p-2">
              <p className="text-lg font-bold text-white">{result.imgCount}</p>
              <p className="text-[10px] text-gray-400">Images</p>
            </div>
            <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded p-2">
              <p className="text-lg font-bold text-white">{result.linkCount}</p>
              <p className="text-[10px] text-gray-400">Links</p>
            </div>
          </div>

          <div className="space-y-1">
            {result.checks.map((c: any, i: number) => (
              <div key={i} className={`flex items-center justify-between text-sm p-2 rounded ${c.pass ? "bg-emerald-500/5" : "bg-red-500/5"}`}>
                <div className="flex items-center gap-2">
                  <span className={c.pass ? "text-emerald-400" : "text-red-400"}>{c.pass ? "✓" : "✗"}</span>
                  <span className="text-white">{c.name}</span>
                </div>
                <span className="text-xs text-gray-400 max-w-[50%] text-right truncate">{c.detail}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {result?.error && <p className="text-red-400 text-center">Could not audit: {result.error}</p>}
    </div>
  );
}
