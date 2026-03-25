"use client";
import { useState } from "react";

export default function DomainChecker() {
  const [domain, setDomain] = useState("");
  const [results, setResults] = useState<{ domain: string; available: boolean | null; checking: boolean }[]>([]);
  const [loading, setLoading] = useState(false);

  const tlds = [".com", ".io", ".dev", ".co", ".app", ".xyz", ".ai", ".tech", ".org", ".net"];

  const check = async () => {
    if (!domain.trim()) return;
    const base = domain.trim().toLowerCase().replace(/[^a-z0-9-]/g, "").replace(/\.(com|io|dev|co|app|xyz|ai|tech|org|net)$/i, "");

    const checks = tlds.map((tld) => ({ domain: base + tld, available: null as boolean | null, checking: true }));
    setResults(checks);
    setLoading(true);

    // Check each domain using DNS lookup (if no DNS record, likely available)
    for (let i = 0; i < checks.length; i++) {
      try {
        const res = await fetch(`https://cloudflare-dns.com/dns-query?name=${checks[i].domain}&type=A`, {
          headers: { Accept: "application/dns-json" },
        });
        const data = await res.json();
        checks[i].available = !data.Answer || data.Answer.length === 0;
        checks[i].checking = false;
        setResults([...checks]);
      } catch {
        checks[i].available = null;
        checks[i].checking = false;
        setResults([...checks]);
      }
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Domain Name Checker</h1>
        <p className="text-[var(--text-secondary)]">
          Check domain availability across 10 TLDs instantly. See which .com, .io, .dev, .ai domains are available. Free domain checker.
        </p>
      </div>

      <div className="flex gap-2 max-w-lg mx-auto">
        <input value={domain} onChange={(e) => setDomain(e.target.value)} onKeyDown={(e) => e.key === "Enter" && check()} placeholder="Enter domain name (e.g. myapp)" className="flex-1 bg-[var(--bg-secondary)] border border-[var(--border)] rounded px-4 py-3 text-white font-mono" />
        <button onClick={check} disabled={loading} className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white px-6 py-3 rounded font-bold">{loading ? "..." : "Check"}</button>
      </div>

      {results.length > 0 && (
        <div className="max-w-lg mx-auto space-y-2">
          {results.map((r) => (
            <div key={r.domain} className={`flex items-center justify-between bg-[var(--bg-secondary)] border rounded-lg p-3 ${r.available === true ? "border-emerald-500/30" : r.available === false ? "border-red-500/30" : "border-[var(--border)]"}`}>
              <span className="font-mono text-white text-sm">{r.domain}</span>
              <span className={`text-xs font-bold ${r.checking ? "text-gray-400" : r.available ? "text-emerald-400" : "text-red-400"}`}>
                {r.checking ? "Checking..." : r.available ? "Likely Available ✓" : "Taken ✗"}
              </span>
            </div>
          ))}
          <p className="text-xs text-gray-500 text-center mt-2">
            Note: Availability is estimated via DNS lookup. Confirm on your registrar before purchasing.
          </p>
        </div>
      )}

      <div className="max-w-lg mx-auto bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-4 text-xs text-[var(--text-secondary)]">
        <h3 className="font-bold text-white mb-1">Popular Registrars</h3>
        <div className="grid grid-cols-2 gap-1">
          <span>Namecheap — from $5.98/yr</span>
          <span>Cloudflare — at-cost pricing</span>
          <span>Google Domains — $12/yr</span>
          <span>Porkbun — from $5.19/yr</span>
        </div>
      </div>
    </div>
  );
}
