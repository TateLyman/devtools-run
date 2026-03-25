"use client";
import { useState } from "react";

export default function DNSLookup() {
  const [domain, setDomain] = useState("");
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const lookup = async () => {
    if (!domain.trim()) return;
    setLoading(true);
    setError("");
    try {
      const clean = domain.trim().replace(/^https?:\/\//, "").split("/")[0];

      // Use DNS over HTTPS (Cloudflare)
      const types = ["A", "AAAA", "CNAME", "MX", "NS", "TXT", "SOA"];
      const results: Record<string, any[]> = {};

      await Promise.all(
        types.map(async (type) => {
          try {
            const res = await fetch(`https://cloudflare-dns.com/dns-query?name=${clean}&type=${type}`, {
              headers: { Accept: "application/dns-json" },
            });
            const data = await res.json();
            if (data.Answer) results[type] = data.Answer;
          } catch {}
        })
      );

      setResults(results);
    } catch (e: any) {
      setError(e.message);
    }
    setLoading(false);
  };

  const typeColors: Record<string, string> = {
    A: "text-emerald-400",
    AAAA: "text-blue-400",
    CNAME: "text-yellow-400",
    MX: "text-purple-400",
    NS: "text-orange-400",
    TXT: "text-pink-400",
    SOA: "text-cyan-400",
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">DNS Lookup</h1>
        <p className="text-[var(--text-secondary)]">
          Look up DNS records for any domain. A, AAAA, CNAME, MX, NS, TXT, SOA records. Uses Cloudflare DNS-over-HTTPS.
        </p>
      </div>

      <div className="flex gap-2 max-w-lg mx-auto">
        <input value={domain} onChange={(e) => setDomain(e.target.value)} onKeyDown={(e) => e.key === "Enter" && lookup()} placeholder="Enter domain (e.g. google.com)..." className="flex-1 bg-[var(--bg-secondary)] border border-[var(--border)] rounded px-4 py-3 text-white font-mono" />
        <button onClick={lookup} disabled={loading} className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white px-6 py-3 rounded font-bold">{loading ? "..." : "Lookup"}</button>
      </div>

      {error && <p className="text-red-400 text-center">{error}</p>}

      {results && (
        <div className="space-y-4 max-w-2xl mx-auto">
          {Object.keys(results).length === 0 && <p className="text-center text-gray-400">No DNS records found for this domain.</p>}

          {Object.entries(results).map(([type, records]) => (
            <div key={type} className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-4">
              <h3 className={`font-bold text-sm mb-2 ${typeColors[type] || "text-white"}`}>{type} Records</h3>
              <div className="space-y-1">
                {records.map((record: any, i: number) => (
                  <div key={i} className="flex items-start gap-3 text-xs font-mono py-1 border-b border-[var(--border)] last:border-0">
                    <span className="text-gray-500 w-8">TTL: {record.TTL}</span>
                    <span className="text-white break-all flex-1">{record.data}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-4 text-xs text-[var(--text-secondary)] max-w-2xl mx-auto">
        <h3 className="font-bold text-white mb-1">Record Types</h3>
        <div className="grid grid-cols-2 gap-1">
          <span><span className="text-emerald-400 font-bold">A</span> — IPv4 address</span>
          <span><span className="text-blue-400 font-bold">AAAA</span> — IPv6 address</span>
          <span><span className="text-yellow-400 font-bold">CNAME</span> — Canonical name (alias)</span>
          <span><span className="text-purple-400 font-bold">MX</span> — Mail exchange server</span>
          <span><span className="text-orange-400 font-bold">NS</span> — Name server</span>
          <span><span className="text-pink-400 font-bold">TXT</span> — Text records (SPF, DKIM, etc.)</span>
          <span><span className="text-cyan-400 font-bold">SOA</span> — Start of authority</span>
        </div>
      </div>
    </div>
  );
}
