"use client";
import { useState, useEffect } from "react";
export default function TimestampNow() {
  const [now, setNow] = useState(Date.now());
  useEffect(() => { const t = setInterval(() => setNow(Date.now()), 100); return () => clearInterval(t); }, []);
  const sec = Math.floor(now / 1000);
  const date = new Date(now);
  const copy = (v: string) => navigator.clipboard.writeText(v);
  return (
    <div className="space-y-6">
      <section className="text-center"><h1 className="text-4xl font-bold mb-2">Current Timestamp</h1><p className="text-[var(--text-secondary)]">Live Unix epoch time</p></section>
      <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-blue-500/20 rounded-xl p-8 text-center cursor-pointer" onClick={() => copy(String(sec))}>
        <div className="text-xs text-[var(--text-secondary)]">Unix Timestamp (seconds)</div>
        <div className="text-5xl font-bold text-blue-400 font-mono">{sec}</div>
        <div className="text-xs text-[var(--text-secondary)] mt-2">Click to copy</div>
      </div>
      <div className="grid gap-2">
        {[["Milliseconds", String(now)],["UTC", date.toUTCString()],["ISO 8601", date.toISOString()],["Local", date.toLocaleString()]].map(([l,v]) => (
          <div key={l} onClick={() => copy(v)} className="flex justify-between bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl px-4 py-3 cursor-pointer hover:border-blue-500/50">
            <span className="text-sm text-[var(--text-secondary)]">{l}</span><code className="font-mono text-sm">{v}</code>
          </div>
        ))}
      </div>
    </div>
  );
}
