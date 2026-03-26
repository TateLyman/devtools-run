"use client";
import { useState } from "react";
const rot13 = (s: string) => s.replace(/[a-zA-Z]/g, c => String.fromCharCode(c.charCodeAt(0) + (c.toLowerCase() < "n" ? 13 : -13)));
export default function ROT13() {
  const [input, setInput] = useState("Hello World! This is a secret message.");
  const output = rot13(input);
  return (
    <div className="space-y-6">
      <section className="text-center"><h1 className="text-4xl font-bold mb-2">ROT13 Encoder</h1><p className="text-[var(--text-secondary)]">Apply ROT13 cipher (encode = decode)</p></section>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-4"><label className="text-sm font-bold block mb-2">Input</label><textarea value={input} onChange={e => setInput(e.target.value)} rows={6} className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg p-3 font-mono text-sm resize-none" /></div>
        <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-4"><div className="flex justify-between mb-2"><label className="text-sm font-bold">ROT13</label><button onClick={() => navigator.clipboard.writeText(output)} className="text-xs text-blue-400">Copy</button></div><textarea value={output} readOnly rows={6} className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg p-3 font-mono text-sm resize-none" /></div>
      </div>
    </div>
  );
}
