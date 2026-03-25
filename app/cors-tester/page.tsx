"use client";
import { useState } from "react";

export default function CORSTester() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const test = async () => {
    if (!url.trim()) return;
    setLoading(true);
    let fullUrl = url.trim();
    if (!fullUrl.startsWith("http")) fullUrl = "https://" + fullUrl;

    const results: any = { url: fullUrl, tests: [] };

    // Test 1: Simple GET
    try {
      const res = await fetch(fullUrl, { method: "GET" });
      const corsHeaders: Record<string, string> = {};
      ["access-control-allow-origin", "access-control-allow-methods", "access-control-allow-headers", "access-control-max-age", "access-control-allow-credentials"].forEach((h) => {
        const val = res.headers.get(h);
        if (val) corsHeaders[h] = val;
      });
      results.tests.push({ name: "Simple GET", status: res.status, cors: Object.keys(corsHeaders).length > 0, headers: corsHeaders });
    } catch (e: any) {
      results.tests.push({ name: "Simple GET", error: e.message, cors: false });
    }

    // Test 2: Preflight OPTIONS
    try {
      const res = await fetch(fullUrl, {
        method: "OPTIONS",
        headers: { "Origin": "https://devtools.run", "Access-Control-Request-Method": "POST" },
      });
      const corsHeaders: Record<string, string> = {};
      ["access-control-allow-origin", "access-control-allow-methods", "access-control-allow-headers"].forEach((h) => {
        const val = res.headers.get(h);
        if (val) corsHeaders[h] = val;
      });
      results.tests.push({ name: "Preflight OPTIONS", status: res.status, cors: Object.keys(corsHeaders).length > 0, headers: corsHeaders });
    } catch (e: any) {
      results.tests.push({ name: "Preflight OPTIONS", error: e.message, cors: false });
    }

    setResult(results);
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">CORS Tester</h1>
        <p className="text-[var(--text-secondary)]">
          Test if a URL has CORS headers enabled. Check Access-Control-Allow-Origin and preflight responses. Free CORS checker.
        </p>
      </div>

      <div className="flex gap-2 max-w-lg mx-auto">
        <input value={url} onChange={(e) => setUrl(e.target.value)} onKeyDown={(e) => e.key === "Enter" && test()} placeholder="https://api.example.com/endpoint" className="flex-1 bg-[var(--bg-secondary)] border border-[var(--border)] rounded px-4 py-3 text-white font-mono text-sm" />
        <button onClick={test} disabled={loading} className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white px-6 py-3 rounded font-bold">{loading ? "..." : "Test"}</button>
      </div>

      {result && (
        <div className="max-w-lg mx-auto space-y-3">
          {result.tests.map((t: any, i: number) => (
            <div key={i} className={`bg-[var(--bg-secondary)] border rounded-lg p-4 ${t.cors ? "border-emerald-500/30" : "border-red-500/30"}`}>
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-sm text-white">{t.name}</span>
                <span className={`text-xs font-bold ${t.cors ? "text-emerald-400" : "text-red-400"}`}>
                  {t.cors ? "CORS Enabled" : t.error ? "Failed" : "No CORS"}
                </span>
              </div>
              {t.error ? (
                <p className="text-xs text-red-400 font-mono">{t.error}</p>
              ) : (
                <div className="text-xs space-y-1">
                  <p className="text-gray-400">Status: {t.status}</p>
                  {Object.entries(t.headers || {}).map(([k, v]) => (
                    <div key={k} className="font-mono">
                      <span className="text-purple-400">{k}:</span> <span className="text-white">{v as string}</span>
                    </div>
                  ))}
                  {Object.keys(t.headers || {}).length === 0 && !t.error && (
                    <p className="text-gray-500">No CORS headers found in response</p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-4 text-xs text-[var(--text-secondary)] max-w-lg mx-auto">
        <h3 className="font-bold text-white mb-1">About CORS</h3>
        <p>Cross-Origin Resource Sharing (CORS) is a security feature that controls which domains can access your API. Without proper CORS headers, browsers will block cross-origin requests.</p>
        <p className="mt-1"><strong>Key header:</strong> <code className="text-purple-400">Access-Control-Allow-Origin: *</code> allows any domain.</p>
      </div>
    </div>
  );
}
