"use client";
import { useState, useEffect } from "react";

export default function EpochConverter() {
  const [now, setNow] = useState(Math.floor(Date.now() / 1000));
  const [ts, setTs] = useState(String(Math.floor(Date.now() / 1000)));
  const [date, setDate] = useState("");

  useEffect(() => {
    const t = setInterval(() => setNow(Math.floor(Date.now() / 1000)), 1000);
    return () => clearInterval(t);
  }, []);

  const parsed = parseInt(ts);
  const isMs = ts.length > 10;
  const actualTs = isMs ? Math.floor(parsed / 1000) : parsed;
  const dateObj = new Date(isMs ? parsed : parsed * 1000);
  const valid = !isNaN(dateObj.getTime());

  const dateToTs = date ? Math.floor(new Date(date).getTime() / 1000) : 0;

  const copy = (v: string) => navigator.clipboard.writeText(v);

  return (
    <div className="space-y-6">
      <section className="text-center">
        <h1 className="text-4xl font-bold mb-2">Unix Timestamp Converter</h1>
        <p className="text-[var(--text-secondary)]">Convert between timestamps and dates</p>
      </section>

      <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-blue-500/20 rounded-xl p-6 text-center cursor-pointer" onClick={() => copy(String(now))}>
        <div className="text-xs text-[var(--text-secondary)]">Current Unix Timestamp</div>
        <div className="text-4xl font-bold text-blue-400 font-mono">{now}</div>
        <div className="text-xs text-[var(--text-secondary)] mt-1">Click to copy</div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-6">
          <h2 className="font-bold mb-3">Timestamp → Date</h2>
          <input value={ts} onChange={e => setTs(e.target.value)} type="number"
            className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg px-3 py-2 font-mono mb-3" placeholder="Enter timestamp" />
          {valid && (
            <div className="space-y-2 text-sm">
              {[
                ["UTC", dateObj.toUTCString()],
                ["Local", dateObj.toLocaleString()],
                ["ISO 8601", dateObj.toISOString()],
                ["Date", dateObj.toLocaleDateString()],
                ["Time", dateObj.toLocaleTimeString()],
                ["Relative", (() => { const diff = now - actualTs; if (Math.abs(diff) < 60) return `${diff}s ago`; if (Math.abs(diff) < 3600) return `${Math.round(diff/60)}m ago`; if (Math.abs(diff) < 86400) return `${Math.round(diff/3600)}h ago`; return `${Math.round(diff/86400)}d ago`; })()],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between items-center bg-[var(--bg-primary)] rounded px-3 py-1.5 cursor-pointer hover:border-blue-500/50 border border-transparent" onClick={() => copy(value)}>
                  <span className="text-[var(--text-secondary)]">{label}</span>
                  <span className="font-mono text-xs">{value}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-6">
          <h2 className="font-bold mb-3">Date → Timestamp</h2>
          <input type="datetime-local" value={date} onChange={e => setDate(e.target.value)}
            className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg px-3 py-2 font-mono mb-3" />
          {date && (
            <div className="space-y-2 text-sm">
              {[
                ["Seconds", String(dateToTs)],
                ["Milliseconds", String(dateToTs * 1000)],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between items-center bg-[var(--bg-primary)] rounded px-3 py-1.5 cursor-pointer hover:border-blue-500/50 border border-transparent" onClick={() => copy(value)}>
                  <span className="text-[var(--text-secondary)]">{label}</span>
                  <span className="font-mono">{value}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
