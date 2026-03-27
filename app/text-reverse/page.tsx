"use client";
import { useState } from "react";
export default function TextReverse() {
  const [input, setInput] = useState("Hello World! This is reversed text.");
  const reversed = { "Characters": input.split("").reverse().join(""), "Words": input.split(" ").reverse().join(" "), "Lines": input.split("\n").reverse().join("\n") };
  return (
    <div className="space-y-6">
      <section className="text-center"><h1 className="text-4xl font-bold mb-2">Text Reverser</h1></section>
      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-4"><textarea value={input} onChange={e => setInput(e.target.value)} rows={3} className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg p-3 font-mono text-sm resize-none" /></div>
      <div className="space-y-2">{Object.entries(reversed).map(([type, val]) => (<div key={type} onClick={() => navigator.clipboard.writeText(val)} className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-4 cursor-pointer hover:border-blue-500/50"><div className="flex justify-between mb-1"><span className="text-sm font-bold">{type}</span><span className="text-xs text-blue-400">Copy</span></div><code className="font-mono text-sm text-emerald-400">{val}</code></div>))}</div>
    </div>
  );
}
