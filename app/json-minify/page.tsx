"use client";
import { useState } from "react";
export default function JsonMinify() {
  const [input, setInput] = useState('{\n  "name": "John",\n  "age": 30,\n  "city": "NYC"\n}');
  let output = ""; let error = "";
  try { output = JSON.stringify(JSON.parse(input)); } catch (e) { error = (e as Error).message; }
  const saved = input.length - output.length;
  return (
    <div className="space-y-6">
      <section className="text-center"><h1 className="text-4xl font-bold mb-2">JSON Minifier</h1></section>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-4"><label className="text-sm font-bold block mb-2">Input ({input.length} chars)</label><textarea value={input} onChange={e => setInput(e.target.value)} rows={8} className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg p-3 font-mono text-xs resize-none" /></div>
        <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-4"><div className="flex justify-between mb-2"><label className="text-sm font-bold">Minified ({output.length} chars)</label><button onClick={() => navigator.clipboard.writeText(output)} className="text-xs text-blue-400">Copy</button></div><textarea value={error || output} readOnly rows={8} className={`w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg p-3 font-mono text-xs resize-none ${error ? "text-red-400" : ""}`} /></div>
      </div>
      {!error && saved > 0 && <div className="text-center text-sm text-emerald-400">Saved {saved} characters ({Math.round(saved/input.length*100)}% reduction)</div>}
    </div>
  );
}
