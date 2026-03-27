"use client";
import { useState } from "react";
export default function LineSorter() {
  const [input, setInput] = useState("banana\napple\ncherry\ndate\napple\nbanana\nelderberry");
  const [mode, setMode] = useState("az");
  const [dedup, setDedup] = useState(false);
  let lines = input.split("\n").filter(l => l.trim());
  if (dedup) lines = [...new Set(lines)];
  if (mode === "az") lines.sort();
  else if (mode === "za") lines.sort().reverse();
  else if (mode === "length") lines.sort((a, b) => a.length - b.length);
  else if (mode === "shuffle") lines.sort(() => Math.random() - 0.5);
  const output = lines.join("\n");
  return (
    <div className="space-y-6">
      <section className="text-center"><h1 className="text-4xl font-bold mb-2">Line Sorter</h1></section>
      <div className="flex gap-2 justify-center flex-wrap">{[["az","A→Z"],["za","Z→A"],["length","By Length"],["shuffle","Shuffle"]].map(([v,l]) => (<button key={v} onClick={() => setMode(v)} className={`px-3 py-1 rounded text-sm ${mode === v ? "bg-blue-600 text-white" : "bg-[var(--bg-secondary)] border border-[var(--border)]"}`}>{l}</button>))}<label className="text-sm"><input type="checkbox" checked={dedup} onChange={e => setDedup(e.target.checked)} className="mr-1" />Remove duplicates</label></div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-4"><label className="text-sm font-bold block mb-2">Input ({input.split("\n").filter(l=>l.trim()).length} lines)</label><textarea value={input} onChange={e => setInput(e.target.value)} rows={8} className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg p-3 font-mono text-sm resize-none" /></div>
        <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-4"><div className="flex justify-between mb-2"><label className="text-sm font-bold">Output ({lines.length} lines)</label><button onClick={() => navigator.clipboard.writeText(output)} className="text-xs text-blue-400">Copy</button></div><textarea value={output} readOnly rows={8} className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg p-3 font-mono text-sm resize-none" /></div>
      </div>
    </div>
  );
}
