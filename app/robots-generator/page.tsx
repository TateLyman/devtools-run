"use client";
import { useState } from "react";

export default function RobotsGeneratorPage() {
  const [sitemap, setSitemap] = useState("https://example.com/sitemap.xml");
  const [disallow, setDisallow] = useState("/admin\n/api\n/private");
  const [crawlDelay, setCrawlDelay] = useState("10");

  const output = `User-agent: *\n${disallow.split("\n").filter(d=>d.trim()).map(d=>`Disallow: ${d.trim()}`).join("\n")}\nCrawl-delay: ${crawlDelay}\n\nSitemap: ${sitemap}`;

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-3xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-extrabold mb-2 text-center">robots.txt Generator</h1>
        <p className="text-gray-400 text-center mb-8">Generate a robots.txt file for your website.</p>
        <div className="bg-gray-900 rounded-xl p-6 mb-6 space-y-4">
          <div><label className="text-xs text-gray-400">Sitemap URL</label><input type="text" value={sitemap} onChange={e=>setSitemap(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm" /></div>
          <div><label className="text-xs text-gray-400">Disallowed paths (one per line)</label><textarea value={disallow} onChange={e=>setDisallow(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm h-20 resize-none font-mono" /></div>
          <div><label className="text-xs text-gray-400">Crawl delay (seconds)</label><input type="number" value={crawlDelay} onChange={e=>setCrawlDelay(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm" /></div>
        </div>
        <div className="bg-gray-900 rounded-xl p-4 mb-4">
          <div className="flex justify-between mb-2">
            <span className="text-xs text-gray-400">robots.txt</span>
            <button onClick={()=>navigator.clipboard.writeText(output)} className="text-xs text-purple-400 hover:underline">Copy</button>
          </div>
          <pre className="text-sm text-green-400 font-mono whitespace-pre">{output}</pre>
        </div>
        <div className="text-center text-gray-500 text-sm">
          <a href="/seo-checklist" className="text-purple-400 hover:underline">SEO Checklist</a>{" | "}
          <a href="/meta-tags" className="text-purple-400 hover:underline">Meta Tags</a>{" | "}
          <a href="/gitignore" className="text-purple-400 hover:underline">.gitignore</a>{" | "}
          <a href="/" className="text-purple-400 hover:underline">All Tools</a>
        </div>
      </div>
    </div>
  );
}
