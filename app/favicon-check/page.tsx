"use client";
import { useState } from "react";
export default function FaviconCheck() {
  const [domain, setDomain] = useState("google.com");
  const sizes = [16, 32, 48, 64, 128, 256];
  return (
    <div className="space-y-6">
      <section className="text-center"><h1 className="text-4xl font-bold mb-2">Favicon Checker</h1><p className="text-[var(--text-secondary)]">Check any website favicon</p></section>
      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-4 flex gap-2">
        <input value={domain} onChange={e => setDomain(e.target.value)} placeholder="example.com" className="flex-1 bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg px-3 py-2 font-mono" />
      </div>
      <div className="grid grid-cols-3 md:grid-cols-6 gap-4 justify-items-center">
        {sizes.map(s => (
          <div key={s} className="text-center">
            <div className="bg-white rounded-lg p-2 inline-block"><img src={`https://www.google.com/s2/favicons?domain=${domain}&sz=${s}`} alt={`${s}px`} width={s} height={s} /></div>
            <div className="text-xs text-[var(--text-secondary)] mt-1">{s}x{s}</div>
          </div>
        ))}
      </div>
      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-4">
        <h2 className="text-sm font-bold mb-2">Direct URLs</h2>
        <div className="space-y-1">{sizes.map(s => { const url = `https://www.google.com/s2/favicons?domain=${domain}&sz=${s}`; return <div key={s} onClick={() => navigator.clipboard.writeText(url)} className="text-xs font-mono text-blue-400 cursor-pointer hover:underline truncate">{url}</div>; })}</div>
      </div>
    </div>
  );
}
