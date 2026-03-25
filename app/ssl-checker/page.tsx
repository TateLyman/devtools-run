"use client";
import { useState } from "react";

export default function SSLChecker() {
  const [domain, setDomain] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const check = async () => {
    if (!domain.trim()) return;
    setLoading(true);
    try {
      const clean = domain.trim().replace(/^https?:\/\//, "").split("/")[0];
      // Use a public SSL checker API
      const res = await fetch(`https://api.ssllabs.com/api/v3/analyze?host=${clean}&fromCache=on&maxAge=24`);
      const data = await res.json();
      setResult(data);
    } catch {
      // Fallback: just check if HTTPS works
      try {
        const clean = domain.trim().replace(/^https?:\/\//, "").split("/")[0];
        const res = await fetch(`https://${clean}`, { mode: "no-cors" });
        setResult({ status: "READY", host: clean, endpoints: [{ grade: "Unknown", statusMessage: "HTTPS connection successful" }] });
      } catch {
        setResult({ error: true });
      }
    }
    setLoading(false);
  };

  const gradeColor = (grade: string) => {
    if (grade?.startsWith("A")) return "text-emerald-400";
    if (grade?.startsWith("B")) return "text-yellow-400";
    if (grade?.startsWith("C")) return "text-orange-400";
    return "text-red-400";
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">SSL Certificate Checker</h1>
        <p className="text-[var(--text-secondary)]">
          Check SSL/TLS certificate status and grade for any domain. Powered by SSL Labs. Free online SSL checker.
        </p>
      </div>

      <div className="flex gap-2 max-w-lg mx-auto">
        <input value={domain} onChange={(e) => setDomain(e.target.value)} onKeyDown={(e) => e.key === "Enter" && check()} placeholder="Enter domain (e.g. google.com)..." className="flex-1 bg-[var(--bg-secondary)] border border-[var(--border)] rounded px-4 py-3 text-white font-mono" />
        <button onClick={check} disabled={loading} className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white px-6 py-3 rounded font-bold">{loading ? "Checking..." : "Check"}</button>
      </div>

      {result && !result.error && (
        <div className="max-w-lg mx-auto space-y-4">
          <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-6 text-center">
            <p className="text-xs text-gray-400 mb-1">SSL Grade</p>
            {result.endpoints?.[0]?.grade ? (
              <p className={`text-6xl font-bold ${gradeColor(result.endpoints[0].grade)}`}>{result.endpoints[0].grade}</p>
            ) : (
              <p className="text-lg text-yellow-400">{result.endpoints?.[0]?.statusMessage || result.status || "Analyzing..."}</p>
            )}
            <p className="text-sm text-gray-400 mt-2">{result.host}</p>
          </div>

          {result.status === "IN_PROGRESS" && (
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 text-sm text-yellow-400 text-center">
              Analysis in progress... This can take 1-2 minutes. Refresh to check status.
            </div>
          )}

          {result.endpoints?.length > 0 && (
            <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-4">
              <h3 className="font-bold text-sm mb-2">Endpoints</h3>
              {result.endpoints.map((ep: any, i: number) => (
                <div key={i} className="text-sm space-y-1 py-2 border-b border-[var(--border)] last:border-0">
                  {ep.ipAddress && <div className="flex justify-between"><span className="text-gray-400">IP</span><span className="text-white font-mono">{ep.ipAddress}</span></div>}
                  {ep.grade && <div className="flex justify-between"><span className="text-gray-400">Grade</span><span className={`font-bold ${gradeColor(ep.grade)}`}>{ep.grade}</span></div>}
                  {ep.statusMessage && <div className="flex justify-between"><span className="text-gray-400">Status</span><span className="text-white">{ep.statusMessage}</span></div>}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {result?.error && <p className="text-red-400 text-center">Could not check SSL for this domain.</p>}

      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-4 text-xs text-[var(--text-secondary)] max-w-lg mx-auto">
        <h3 className="font-bold text-white mb-1">SSL Grades Explained</h3>
        <div className="grid grid-cols-2 gap-1">
          <span><span className="text-emerald-400 font-bold">A+/A</span> — Excellent, modern config</span>
          <span><span className="text-yellow-400 font-bold">B</span> — Good but room for improvement</span>
          <span><span className="text-orange-400 font-bold">C</span> — Some issues, needs attention</span>
          <span><span className="text-red-400 font-bold">D/F</span> — Serious vulnerabilities</span>
        </div>
      </div>
    </div>
  );
}
