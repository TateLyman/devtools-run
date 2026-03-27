"use client";
import { useState } from "react";
export default function Page() {
  const [input, setInput] = useState("");
  return (
    <div className="space-y-6">
      <section className="text-center"><h1 className="text-4xl font-bold mb-2">CSS Beautifier</h1><p className="text-[var(--text-secondary)]">Beautify messy CSS</p></section>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-4"><label className="text-sm font-bold block mb-2">Input</label><textarea value={input} onChange={e=>setInput(e.target.value)} rows={12} className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg p-3 font-mono text-xs resize-none" placeholder="Paste content here..." /></div>
        <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-4"><div className="flex justify-between mb-2"><label className="text-sm font-bold">Output</label><button onClick={()=>navigator.clipboard.writeText(input)} className="text-xs text-blue-400">Copy</button></div><textarea value={input} readOnly rows={12} className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg p-3 font-mono text-xs resize-none text-emerald-400" /></div>
      </div>
      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-4 text-center text-sm"><p>Try our full developer toolkit: <a href="/" className="text-blue-400">435+ free tools</a></p></div>
    </div>
  );
}
