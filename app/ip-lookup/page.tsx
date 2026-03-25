"use client";
import { useState, useEffect } from "react";

export default function IPLookup() {
  const [ip, setIp] = useState("");
  const [myIp, setMyIp] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("https://api.ipify.org?format=json")
      .then((r) => r.json())
      .then((d) => { setMyIp(d.ip); setIp(d.ip); lookup(d.ip); })
      .catch(() => {});
  }, []);

  const lookup = async (ipAddr?: string) => {
    const target = ipAddr || ip.trim();
    if (!target) return;
    setLoading(true);
    try {
      const res = await fetch(`https://ipapi.co/${target}/json/`);
      const data = await res.json();
      setResult(data);
    } catch {
      setResult({ error: true });
    }
    setLoading(false);
  };

  const [copied, setCopied] = useState(false);
  const copy = (text: string) => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1500); };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">IP Address Lookup</h1>
        <p className="text-[var(--text-secondary)]">
          Look up any IP address or find your own. See location, ISP, timezone, ASN. Free IP geolocation tool.
        </p>
      </div>

      <div className="flex gap-2 max-w-lg mx-auto">
        <input value={ip} onChange={(e) => setIp(e.target.value)} onKeyDown={(e) => e.key === "Enter" && lookup()} placeholder="Enter IP address or leave blank for yours" className="flex-1 bg-[var(--bg-secondary)] border border-[var(--border)] rounded px-4 py-3 text-white font-mono" />
        <button onClick={() => lookup()} disabled={loading} className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white px-6 py-3 rounded font-bold">{loading ? "..." : "Lookup"}</button>
      </div>

      {myIp && (
        <p className="text-center text-sm text-gray-400">Your IP: <span className="text-white font-mono cursor-pointer" onClick={() => copy(myIp)}>{myIp}</span> {copied ? "(Copied!)" : "(click to copy)"}</p>
      )}

      {result && !result.error && (
        <div className="max-w-lg mx-auto space-y-4">
          <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-6 text-center">
            <p className="text-3xl font-bold font-mono text-purple-400">{result.ip}</p>
            <p className="text-lg text-white mt-2">{[result.city, result.region, result.country_name].filter(Boolean).join(", ")}</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "City", value: result.city },
              { label: "Region", value: result.region },
              { label: "Country", value: `${result.country_name} (${result.country_code})` },
              { label: "Postal", value: result.postal },
              { label: "Timezone", value: result.timezone },
              { label: "ISP", value: result.org },
              { label: "ASN", value: result.asn },
              { label: "Latitude", value: result.latitude },
              { label: "Longitude", value: result.longitude },
              { label: "Currency", value: result.currency },
            ].filter((item) => item.value).map((item) => (
              <div key={item.label} className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded px-3 py-2">
                <p className="text-xs text-gray-400">{item.label}</p>
                <p className="text-sm text-white font-mono">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
