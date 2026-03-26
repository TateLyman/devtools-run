"use client";
import { useState, useEffect } from "react";

export default function MyIP() {
  const [data, setData] = useState<Record<string, string> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://ipapi.co/json/")
      .then(r => r.json())
      .then(d => {
        setData({
          "IP Address": d.ip || "Unknown",
          "City": d.city || "Unknown",
          "Region": d.region || "Unknown",
          "Country": `${d.country_name || "Unknown"} (${d.country_code || ""})`,
          "Postal Code": d.postal || "N/A",
          "Latitude": String(d.latitude || ""),
          "Longitude": String(d.longitude || ""),
          "Timezone": d.timezone || "Unknown",
          "ISP": d.org || "Unknown",
          "ASN": d.asn || "Unknown",
          "Network": d.network || "Unknown",
          "IP Version": d.version || "IPv4",
        });
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const copy = (v: string) => navigator.clipboard.writeText(v);

  return (
    <div className="space-y-6">
      <section className="text-center">
        <h1 className="text-4xl font-bold mb-2">What is My IP Address?</h1>
        <p className="text-[var(--text-secondary)]">Your public IP and connection details</p>
      </section>

      {loading ? (
        <div className="text-center text-[var(--text-secondary)] py-12 animate-pulse">Detecting your IP...</div>
      ) : data ? (
        <>
          <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-blue-500/20 rounded-xl p-8 text-center">
            <div className="text-sm text-[var(--text-secondary)]">Your Public IP Address</div>
            <div className="text-4xl md:text-5xl font-bold text-blue-400 font-mono my-2 cursor-pointer" onClick={() => copy(data["IP Address"])}>
              {data["IP Address"]}
            </div>
            <div className="text-sm text-[var(--text-secondary)]">{data["City"]}, {data["Region"]}, {data["Country"]}</div>
            <button onClick={() => copy(data["IP Address"])} className="mt-3 bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded text-sm font-bold">Copy IP</button>
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            {Object.entries(data).map(([k, v]) => (
              <div key={k} className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-4 cursor-pointer hover:border-blue-500/50" onClick={() => copy(v)}>
                <div className="text-xs text-[var(--text-secondary)]">{k}</div>
                <div className="font-bold font-mono text-sm">{v}</div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="text-center text-red-400">Could not detect IP address. Try refreshing.</div>
      )}
    </div>
  );
}
