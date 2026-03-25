"use client";
import { useState } from "react";

export default function Whois() {
  const [domain, setDomain] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const lookup = async () => {
    if (!domain.trim()) return;
    setLoading(true);
    try {
      const clean = domain.trim().replace(/^https?:\/\//, "").split("/")[0];
      // Use RDAP (Registration Data Access Protocol) - the modern WHOIS replacement
      const res = await fetch(`https://rdap.org/domain/${clean}`);
      if (!res.ok) throw new Error("Domain not found");
      const data = await res.json();
      setResult(data);
    } catch {
      setResult({ error: true });
    }
    setLoading(false);
  };

  const getEvent = (events: any[], type: string) => {
    const evt = events?.find((e: any) => e.eventAction === type);
    return evt ? new Date(evt.eventDate).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : "N/A";
  };

  const getNameservers = (nameservers: any[]) => {
    return nameservers?.map((ns: any) => ns.ldhName).filter(Boolean) || [];
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">WHOIS Lookup</h1>
        <p className="text-[var(--text-secondary)]">
          Look up domain registration info. See registrar, creation date, expiry, nameservers. Uses RDAP protocol. Free WHOIS checker.
        </p>
      </div>

      <div className="flex gap-2 max-w-lg mx-auto">
        <input value={domain} onChange={(e) => setDomain(e.target.value)} onKeyDown={(e) => e.key === "Enter" && lookup()} placeholder="Enter domain (e.g. google.com)..." className="flex-1 bg-[var(--bg-secondary)] border border-[var(--border)] rounded px-4 py-3 text-white font-mono" />
        <button onClick={lookup} disabled={loading} className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white px-6 py-3 rounded font-bold">{loading ? "..." : "Lookup"}</button>
      </div>

      {result && !result.error && (
        <div className="max-w-2xl mx-auto space-y-4">
          <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-4">
            <h3 className="font-bold text-sm mb-3 text-purple-400">Domain Info</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-gray-400">Domain</span><span className="text-white font-mono">{result.ldhName || domain}</span></div>
              <div className="flex justify-between"><span className="text-gray-400">Status</span>
                <div className="flex gap-1 flex-wrap justify-end">
                  {result.status?.slice(0, 3).map((s: string, i: number) => (
                    <span key={i} className="text-xs px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400">{s.replace("https://icann.org/epp#", "")}</span>
                  ))}
                </div>
              </div>
              <div className="flex justify-between"><span className="text-gray-400">Registered</span><span className="text-white">{getEvent(result.events, "registration")}</span></div>
              <div className="flex justify-between"><span className="text-gray-400">Expires</span><span className="text-white">{getEvent(result.events, "expiration")}</span></div>
              <div className="flex justify-between"><span className="text-gray-400">Last Updated</span><span className="text-white">{getEvent(result.events, "last changed")}</span></div>
            </div>
          </div>

          {result.entities?.length > 0 && (
            <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-4">
              <h3 className="font-bold text-sm mb-3 text-blue-400">Registrar</h3>
              {result.entities.map((entity: any, i: number) => (
                <div key={i} className="text-sm">
                  {entity.vcardArray?.[1]?.map((card: any[], ci: number) => {
                    if (card[0] === "fn") return <p key={ci} className="text-white font-bold">{card[3]}</p>;
                    if (card[0] === "email") return <p key={ci} className="text-gray-400 text-xs">{card[3]}</p>;
                    return null;
                  })}
                  {entity.roles && <p className="text-xs text-gray-500 mt-1">Role: {entity.roles.join(", ")}</p>}
                </div>
              ))}
            </div>
          )}

          {result.nameservers?.length > 0 && (
            <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-4">
              <h3 className="font-bold text-sm mb-2 text-orange-400">Nameservers</h3>
              <div className="space-y-1">
                {getNameservers(result.nameservers).map((ns: string, i: number) => (
                  <p key={i} className="text-sm font-mono text-white">{ns}</p>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {result?.error && <p className="text-red-400 text-center">Domain not found or RDAP data unavailable.</p>}
    </div>
  );
}
