"use client";
import { useState } from "react";

export default function OGPreviewPage() {
  const [url, setUrl] = useState("");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  async function check() {
    if (!url) return;
    setLoading(true);
    try {
      const target = url.startsWith("http") ? url : `https://${url}`;
      const res = await fetch(`/api/og-preview?url=${encodeURIComponent(target)}`);
      setData(await res.json());
    } catch { setData({ error: "Failed to fetch" }); }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-3xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-extrabold mb-2 text-center">Social Share Preview</h1>
        <p className="text-gray-400 text-center mb-8">See how your URL looks when shared on social media.</p>
        <div className="flex gap-2 mb-6">
          <input type="url" value={url} onChange={e=>setUrl(e.target.value)} placeholder="https://yoursite.com" onKeyDown={e=>e.key==="Enter"&&check()}
            className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white" />
          <button onClick={check} disabled={loading} className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-lg font-bold disabled:opacity-50">{loading?"...":"Preview"}</button>
        </div>
        <p className="text-xs text-gray-500 text-center mb-4">Note: Fetches the URL server-side to read Open Graph tags. Some sites may block this.</p>
        <div className="bg-gray-900 rounded-xl p-6 text-center">
          <p className="text-gray-400 text-sm mb-3">Want perfect social previews? Generate your OG tags:</p>
          <a href="/meta-tags" className="inline-block bg-purple-600 hover:bg-purple-700 py-2 px-6 rounded-lg font-bold text-sm">Open Meta Tag Generator</a>
        </div>
        <div className="mt-8 text-center text-gray-500 text-sm">
          <a href="/meta-tags" className="text-purple-400 hover:underline">Meta Tags</a>{" | "}
          <a href="/seo-checklist" className="text-purple-400 hover:underline">SEO Checklist</a>{" | "}
          <a href="/responsive" className="text-purple-400 hover:underline">Responsive Tester</a>{" | "}
          <a href="/" className="text-purple-400 hover:underline">All Tools</a>
        </div>
      </div>
    </div>
  );
}
