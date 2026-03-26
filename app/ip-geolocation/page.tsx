"use client";
import { useState } from "react";

export default function IPGeolocation() {
  const [ip, setIp] = useState("");
  const [data, setData] = useState<Record<string, string> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const lookup = async () => {
    setLoading(true); setError("");
    try {
      const target = ip.trim() || "json";
      const res = await fetch(`https://ipapi.co/${target}/json/`);
      const d = await res.json();
      if (d.error) { setError(d.reason || "Invalid IP"); setData(null); }
      else {
        setData({
          "IP Address": d.ip,
          "City": d.city || "Unknown",
          "Region": d.region || "Unknown",
          "Country": `${d.country_name} (${d.country_code})`,
          "Continent": d.continent_code || "Unknown",
          "Postal Code": d.postal || "N/A",
          "Latitude": String(d.latitude),
          "Longitude": String(d.longitude),
          "Timezone": d.timezone || "Unknown",
          "UTC Offset": d.utc_offset || "Unknown",
          "ISP": d.org || "Unknown",
          "ASN": d.asn || "Unknown",
          "Network": d.network || "Unknown",
          "Country Calling Code": d.country_calling_code || "N/A",
          "Currency": `${d.currency_name} (${d.currency})` || "Unknown",
          "Languages": d.languages || "Unknown",
        });
      }
    } catch { setError("Failed to look up IP"); setData(null); }
    setLoading(false);
  };

  const copy = (v: string) => navigator.clipboard.writeText(v);

  return (
    <div className="space-y-6">
      <section className="text-center">
        <h1 className="text-4xl font-bold mb-2">IP Geolocation Lookup</h1>
        <p className="text-[var(--text-secondary)]">Find the location of any IP address</p>
      </section>

      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-6">
        <div className="flex gap-2">
          <input value={ip} onChange={e => setIp(e.target.value)} placeholder="Enter IP address (leave blank for your IP)"
            className="flex-1 bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg px-3 py-2 font-mono" />
          <button onClick={lookup} disabled={loading} className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-6 py-2 rounded-lg font-bold">
            {loading ? "Looking up..." : "Lookup"}
          </button>
        </div>
      </div>

      {error && <div className="text-red-400 text-center">{error}</div>}

      {data && (
        <div className="grid gap-3 md:grid-cols-3">
          {Object.entries(data).map(([k, v]) => (
            <div key={k} className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-3 cursor-pointer hover:border-blue-500/50" onClick={() => copy(v)}>
              <div className="text-xs text-[var(--text-secondary)]">{k}</div>
              <div className="font-bold font-mono text-sm">{v}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
