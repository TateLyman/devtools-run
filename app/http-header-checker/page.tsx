"use client";
import { useState } from "react";

export default function HTTPHeaderChecker() {
  const [url, setUrl] = useState("");
  const [headers, setHeaders] = useState<[string, string][]>([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<number | null>(null);
  const [error, setError] = useState("");

  const check = async () => {
    if (!url.trim()) return;
    setLoading(true);
    setError("");
    try {
      let fullUrl = url.trim();
      if (!fullUrl.startsWith("http")) fullUrl = "https://" + fullUrl;

      // Use a CORS proxy approach — fetch through our API
      const res = await fetch(fullUrl, { method: "HEAD", mode: "no-cors" });

      // Since no-cors doesn't give us headers, use a different approach
      // Fetch through allorigins proxy
      const proxyRes = await fetch(`https://api.allorigins.win/raw?url=${encodeURIComponent(fullUrl)}`, { method: "HEAD" });

      const h: [string, string][] = [];
      proxyRes.headers.forEach((value, key) => {
        h.push([key, value]);
      });
      setHeaders(h);
      setStatus(proxyRes.status);
    } catch (e: any) {
      setError("Could not fetch headers. The server may block cross-origin requests.");
      setHeaders([]);
    }
    setLoading(false);
  };

  const securityHeaders = [
    "content-security-policy",
    "strict-transport-security",
    "x-content-type-options",
    "x-frame-options",
    "x-xss-protection",
    "referrer-policy",
    "permissions-policy",
  ];

  const hasSecurityHeader = (name: string) => headers.some(([k]) => k.toLowerCase() === name);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">HTTP Header Checker</h1>
        <p className="text-[var(--text-secondary)]">
          Check HTTP response headers for any URL. See security headers, caching, content type. Free HTTP header analyzer.
        </p>
      </div>

      <div className="flex gap-2 max-w-lg mx-auto">
        <input value={url} onChange={(e) => setUrl(e.target.value)} onKeyDown={(e) => e.key === "Enter" && check()} placeholder="https://example.com" className="flex-1 bg-[var(--bg-secondary)] border border-[var(--border)] rounded px-4 py-3 text-white font-mono text-sm" />
        <button onClick={check} disabled={loading} className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white px-6 py-3 rounded font-bold">{loading ? "..." : "Check"}</button>
      </div>

      {error && <p className="text-yellow-400 text-center text-sm">{error}</p>}

      {headers.length > 0 && (
        <div className="max-w-2xl mx-auto space-y-4">
          {status && (
            <div className={`text-center text-sm font-bold ${status < 400 ? "text-emerald-400" : "text-red-400"}`}>
              HTTP {status}
            </div>
          )}

          <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-4">
            <h3 className="font-bold text-sm mb-2">Response Headers</h3>
            <div className="space-y-1 max-h-64 overflow-auto">
              {headers.map(([key, value], i) => (
                <div key={i} className="flex gap-3 text-xs font-mono py-1 border-b border-[var(--border)] last:border-0">
                  <span className="text-purple-400 font-bold w-48 shrink-0">{key}</span>
                  <span className="text-white break-all">{value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-4">
            <h3 className="font-bold text-sm mb-2">Security Headers</h3>
            <div className="space-y-1">
              {securityHeaders.map((h) => (
                <div key={h} className="flex items-center gap-2 text-xs">
                  <span className={hasSecurityHeader(h) ? "text-emerald-400" : "text-red-400"}>
                    {hasSecurityHeader(h) ? "✓" : "✗"}
                  </span>
                  <span className="text-white font-mono">{h}</span>
                </div>
              ))}
            </div>
            <p className="text-[10px] text-gray-500 mt-2">Note: Results may be affected by the CORS proxy. Check directly for accurate security header analysis.</p>
          </div>
        </div>
      )}
    </div>
  );
}
