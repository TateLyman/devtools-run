"use client";
import { useState } from "react";
export default function WordFreq() {
  const [text, setText] = useState("the quick brown fox jumps over the lazy dog the fox the dog");
  const words = text.toLowerCase().replace(/[^a-z0-9\s]/g, "").split(/\s+/).filter(Boolean);
  const freq: Record<string, number> = {};
  words.forEach(w => freq[w] = (freq[w] || 0) + 1);
  const sorted = Object.entries(freq).sort((a, b) => b[1] - a[1]);
  const max = sorted[0]?.[1] || 1;
  return (
    <div className="space-y-6">
      <section className="text-center"><h1 className="text-4xl font-bold mb-2">Word Frequency Counter</h1></section>
      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-4"><textarea value={text} onChange={e => setText(e.target.value)} rows={4} className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg p-3 text-sm resize-none" /></div>
      <div className="text-center text-sm text-[var(--text-secondary)]">{words.length} words, {sorted.length} unique</div>
      <div className="space-y-1">{sorted.slice(0, 30).map(([word, count]) => (<div key={word} className="flex items-center gap-3 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg px-3 py-1.5"><span className="font-mono text-sm w-24">{word}</span><div className="flex-1 bg-[var(--bg-primary)] rounded-full h-3"><div className="h-3 rounded-full bg-blue-500" style={{ width: `${count / max * 100}%` }} /></div><span className="text-sm font-bold w-8 text-right">{count}</span></div>))}</div>
    </div>
  );
}
