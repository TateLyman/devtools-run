"use client";
import { useState, useEffect } from "react";

async function hash(text: string, algo: string): Promise<string> {
  const data = new TextEncoder().encode(text);
  const buf = await crypto.subtle.digest(algo, data);
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, "0")).join("");
}

export default function HashText() {
  const [text, setText] = useState("Hello, World!");
  const [hashes, setHashes] = useState<Record<string, string>>({});

  useEffect(() => {
    (async () => {
      const results: Record<string, string> = {};
      for (const [name, algo] of [["SHA-1", "SHA-1"], ["SHA-256", "SHA-256"], ["SHA-384", "SHA-384"], ["SHA-512", "SHA-512"]]) {
        results[name] = await hash(text, algo);
      }
      setHashes(results);
    })();
  }, [text]);

  const copy = (v: string) => navigator.clipboard.writeText(v);

  return (
    <div className="space-y-6">
      <section className="text-center"><h1 className="text-4xl font-bold mb-2">Text Hash Generator</h1><p className="text-[var(--text-secondary)]">Generate cryptographic hashes</p></section>
      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-4">
        <textarea value={text} onChange={e => setText(e.target.value)} rows={4} className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg p-3 font-mono text-sm resize-none" placeholder="Enter text to hash..." />
      </div>
      <div className="space-y-2">
        {Object.entries(hashes).map(([name, value]) => (
          <div key={name} onClick={() => copy(value)} className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-3 cursor-pointer hover:border-blue-500/50">
            <div className="flex justify-between items-center"><span className="text-sm font-bold w-20">{name}</span><span className="text-xs text-blue-400">Copy</span></div>
            <code className="text-xs font-mono text-emerald-400 break-all">{value}</code>
          </div>
        ))}
      </div>
      <div className="bg-blue-900/20 border border-blue-500/20 rounded-xl p-3 text-center text-sm text-blue-400">Uses Web Crypto API. Your text never leaves your browser.</div>
    </div>
  );
}
