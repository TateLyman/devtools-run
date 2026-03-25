"use client";
import { useState } from "react";

export default function TechDetectorPage() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState<any>(null);

  async function detect() {
    if (!url) return;
    const techs: string[] = [];
    const u = url.toLowerCase();
    if (u.includes("vercel")) techs.push("Vercel");
    if (u.includes("netlify")) techs.push("Netlify");
    if (u.includes("github.io")) techs.push("GitHub Pages");
    if (u.includes("cloudflare")) techs.push("Cloudflare");
    if (u.includes("wordpress")) techs.push("WordPress");
    if (u.includes("shopify")) techs.push("Shopify");

    try {
      const res = await fetch(`/api/uptime?url=${encodeURIComponent(url.startsWith("http")?url:`https://${url}`)}`);
      const data = await res.json();
      const headers = data.headers || {};
      if (data.status === "up") techs.push(`Status: ${data.statusCode}`);
      techs.push(`Latency: ${data.latency}ms`);
    } catch {}

    setResult({ url, techs: techs.length ? techs : ["Could not detect specific technologies. Try checking the page source."] });
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-3xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-extrabold mb-2 text-center">Website Tech Detector</h1>
        <p className="text-gray-400 text-center mb-8">Check what technologies a website uses.</p>
        <div className="flex gap-2 mb-6">
          <input type="text" value={url} onChange={e=>setUrl(e.target.value)} placeholder="https://example.com" onKeyDown={e=>e.key==="Enter"&&detect()}
            className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white" />
          <button onClick={detect} className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-lg font-bold">Detect</button>
        </div>
        {result && (
          <div className="bg-gray-900 rounded-xl p-6">
            <div className="font-bold mb-3">{result.url}</div>
            <div className="flex flex-wrap gap-2">
              {result.techs.map((t:string,i:number) => <span key={i} className="bg-purple-600/20 text-purple-300 px-3 py-1 rounded-lg text-sm">{t}</span>)}
            </div>
          </div>
        )}
        <div className="mt-8 text-center text-gray-500 text-sm">
          <a href="/uptime" className="text-purple-400 hover:underline">Uptime Monitor</a>{" | "}
          <a href="/responsive" className="text-purple-400 hover:underline">Responsive Tester</a>{" | "}
          <a href="/seo-checklist" className="text-purple-400 hover:underline">SEO Checklist</a>{" | "}
          <a href="/" className="text-purple-400 hover:underline">All Tools</a>
        </div>
      </div>
    </div>
  );
}
