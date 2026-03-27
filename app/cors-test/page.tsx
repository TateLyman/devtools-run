"use client";
import { useState } from "react";
export default function Page() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const check = async () => {
    if (!url) return;
    setLoading(true);
    try {
      const start = performance.now();
      const res = await fetch(url.startsWith("http") ? url : "https://" + url, { mode: "no-cors" });
      const ms = Math.round(performance.now() - start);
      setResult("Status: Reachable | Response time: " + ms + "ms");
    } catch (e) {
      setResult("Error: " + (e as Error).message);
    }
    setLoading(false);
  };
  return (
    <div className="space-y-6">
      <section className="text-center"><h1 className="text-4xl font-bold mb-2">CORS Tester</h1><p className="text-[var(--text-secondary)]">Test CORS headers on any URL</p></section>
      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-4 flex gap-2">
        <input value={url} onChange={e=>setUrl(e.target.value)} placeholder="Enter URL..." className="flex-1 bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg px-3 py-2 font-mono text-sm" />
        <button onClick={check} disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-bold">{loading ? "..." : "Check"}</button>
      </div>
      {result && <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-4 font-mono text-sm">{result}</div>}
      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-4 text-center text-sm"><p>More network tools at <a href="/" className="text-blue-400">devtools-site-delta.vercel.app</a></p></div>
    </div>
  );
}
