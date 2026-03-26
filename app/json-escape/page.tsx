"use client";
import { useState } from "react";
export default function JsonEscape() {
  const [input, setInput] = useState('Hello "World"\nThis has a\ttab and a\nnewline.');
  const [mode, setMode] = useState<"escape"|"unescape">("escape");
  let output = "";
  try {
    if (mode === "escape") { output = JSON.stringify(input).slice(1, -1); }
    else { output = JSON.parse(`"${input}"`); }
  } catch { output = "Error processing input"; }
  return (
    <div className="space-y-6">
      <section className="text-center"><h1 className="text-4xl font-bold mb-2">JSON String Escape</h1><p className="text-[var(--text-secondary)]">Escape or unescape JSON strings</p></section>
      <div className="flex justify-center gap-2">
        <button onClick={() => setMode("escape")} className={`px-4 py-2 rounded-lg text-sm font-bold ${mode === "escape" ? "bg-blue-600 text-white" : "bg-[var(--bg-secondary)] border border-[var(--border)]"}`}>Escape</button>
        <button onClick={() => setMode("unescape")} className={`px-4 py-2 rounded-lg text-sm font-bold ${mode === "unescape" ? "bg-blue-600 text-white" : "bg-[var(--bg-secondary)] border border-[var(--border)]"}`}>Unescape</button>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-4"><label className="text-sm font-bold block mb-2">Input</label><textarea value={input} onChange={e => setInput(e.target.value)} rows={6} className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg p-3 font-mono text-sm resize-none" /></div>
        <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-4"><div className="flex justify-between mb-2"><label className="text-sm font-bold">Output</label><button onClick={() => navigator.clipboard.writeText(output)} className="text-xs text-blue-400">Copy</button></div><textarea value={output} readOnly rows={6} className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg p-3 font-mono text-sm resize-none" /></div>
      </div>
    </div>
  );
}
