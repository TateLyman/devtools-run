"use client";
import { useState } from "react";

export default function BaseConverter() {
  const [input, setInput] = useState("255");
  const [fromBase, setFromBase] = useState(10);
  const [toBase, setToBase] = useState(16);

  let result = "";
  let error = "";
  try {
    const decimal = parseInt(input, fromBase);
    if (isNaN(decimal)) throw new Error("Invalid");
    result = decimal.toString(toBase).toUpperCase();
  } catch { error = "Invalid input for base " + fromBase; }

  const copy = () => navigator.clipboard.writeText(result);
  const presets = [2, 8, 10, 16, 32, 36];

  return (
    <div className="space-y-6">
      <section className="text-center"><h1 className="text-4xl font-bold mb-2">Base Converter</h1><p className="text-[var(--text-secondary)]">Convert between any number base (2-36)</p></section>
      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-6">
        <div className="grid gap-4 md:grid-cols-3">
          <div><label className="text-sm text-[var(--text-secondary)]">Input</label><input value={input} onChange={e => setInput(e.target.value)} className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg px-3 py-2 font-mono text-lg" /></div>
          <div><label className="text-sm text-[var(--text-secondary)]">From Base</label><div className="flex gap-1 flex-wrap">{presets.map(b => <button key={b} onClick={() => setFromBase(b)} className={`px-2 py-1 rounded text-xs ${fromBase === b ? "bg-blue-600 text-white" : "bg-[var(--bg-primary)] border border-[var(--border)]"}`}>{b}</button>)}<input type="number" min={2} max={36} value={fromBase} onChange={e => setFromBase(Number(e.target.value))} className="w-14 bg-[var(--bg-primary)] border border-[var(--border)] rounded px-2 py-1 text-sm" /></div></div>
          <div><label className="text-sm text-[var(--text-secondary)]">To Base</label><div className="flex gap-1 flex-wrap">{presets.map(b => <button key={b} onClick={() => setToBase(b)} className={`px-2 py-1 rounded text-xs ${toBase === b ? "bg-blue-600 text-white" : "bg-[var(--bg-primary)] border border-[var(--border)]"}`}>{b}</button>)}<input type="number" min={2} max={36} value={toBase} onChange={e => setToBase(Number(e.target.value))} className="w-14 bg-[var(--bg-primary)] border border-[var(--border)] rounded px-2 py-1 text-sm" /></div></div>
        </div>
      </div>
      {error ? <div className="text-red-400 text-center">{error}</div> : (
        <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-blue-500/20 rounded-xl p-6 text-center cursor-pointer" onClick={copy}>
          <div className="text-xs text-[var(--text-secondary)]">Base {fromBase} → Base {toBase}</div>
          <div className="text-4xl font-bold text-blue-400 font-mono my-2">{result}</div>
          <div className="text-xs text-[var(--text-secondary)]">Click to copy</div>
        </div>
      )}
      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-4 text-sm">
        <h2 className="font-bold mb-2">All Bases</h2>
        <div className="grid gap-1 md:grid-cols-2">{[2,8,10,16].map(b => { try { const d = parseInt(input, fromBase); const r = d.toString(b).toUpperCase(); return <div key={b} className="flex justify-between bg-[var(--bg-primary)] rounded px-3 py-1"><span>Base {b}</span><code className="font-mono">{r}</code></div>; } catch { return null; } })}</div>
      </div>
    </div>
  );
}
