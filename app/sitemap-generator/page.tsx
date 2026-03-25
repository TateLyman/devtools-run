"use client";
import { useState } from "react";

export default function SitemapGenerator() {
  const [urls, setUrls] = useState("");
  const [baseUrl, setBaseUrl] = useState("https://example.com");
  const [changefreq, setChangefreq] = useState("weekly");
  const [priority, setPriority] = useState("0.8");
  const [copied, setCopied] = useState(false);

  const urlList = urls.split("\n").map((u) => u.trim()).filter(Boolean);

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlList.map((url) => {
  const fullUrl = url.startsWith("http") ? url : `${baseUrl}${url.startsWith("/") ? "" : "/"}${url}`;
  return `  <url>
    <loc>${fullUrl}</loc>
    <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}).join("\n")}
</urlset>`;

  const handleCopy = () => {
    navigator.clipboard.writeText(xml);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([xml], { type: "application/xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.download = "sitemap.xml";
    a.href = url;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Sitemap.xml Generator</h1>
        <p className="text-[var(--text-secondary)]">
          Generate a valid sitemap.xml for your website. Enter URLs, configure settings, download the XML file. Free sitemap generator.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-4 space-y-3">
            <div>
              <label className="block text-sm mb-1">Base URL</label>
              <input value={baseUrl} onChange={(e) => setBaseUrl(e.target.value)} placeholder="https://example.com" className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded px-3 py-2 text-white font-mono text-sm" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-400 mb-1">Change Frequency</label>
                <select value={changefreq} onChange={(e) => setChangefreq(e.target.value)} className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded px-2 py-1.5 text-white text-sm">
                  {["always", "hourly", "daily", "weekly", "monthly", "yearly", "never"].map((f) => <option key={f} value={f}>{f}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Priority</label>
                <select value={priority} onChange={(e) => setPriority(e.target.value)} className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded px-2 py-1.5 text-white text-sm">
                  {["1.0", "0.9", "0.8", "0.7", "0.6", "0.5", "0.4", "0.3", "0.2", "0.1"].map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm mb-1">URLs (one per line)</label>
            <textarea value={urls} onChange={(e) => setUrls(e.target.value)} placeholder={"/\n/about\n/blog\n/contact\n/products/item-1\n/products/item-2"} className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded px-3 py-2 text-white h-48 resize-none font-mono text-sm" />
          </div>

          <div className="flex gap-2">
            <button onClick={handleCopy} className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded text-sm font-bold">{copied ? "Copied!" : "Copy XML"}</button>
            <button onClick={handleDownload} className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded text-sm">Download sitemap.xml</button>
          </div>

          <p className="text-xs text-[var(--text-secondary)]">{urlList.length} URLs in sitemap</p>
        </div>

        <div>
          <label className="text-sm font-medium mb-1 block">Generated XML</label>
          <pre className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded p-3 text-xs font-mono text-emerald-400 overflow-auto max-h-[500px] whitespace-pre-wrap">{xml}</pre>
        </div>
      </div>
    </div>
  );
}
