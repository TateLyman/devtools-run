"use client";
import { useState } from "react";
export default function StringLength() {
  const [text, setText] = useState("Hello, World! This is a test string.");
  const chars = text.length;
  const charsNoSpace = text.replace(/\s/g, "").length;
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const lines = text ? text.split("\n").length : 0;
  const sentences = text.split(/[.!?]+/).filter(s => s.trim()).length;
  const bytes = new Blob([text]).size;
  const stats = [
    { label: "Characters", value: chars }, { label: "No Spaces", value: charsNoSpace },
    { label: "Words", value: words }, { label: "Lines", value: lines },
    { label: "Sentences", value: sentences }, { label: "Bytes (UTF-8)", value: bytes },
  ];
  return (
    <div className="space-y-6">
      <section className="text-center"><h1 className="text-4xl font-bold mb-2">String Length Calculator</h1><p className="text-[var(--text-secondary)]">Count characters, words, lines, and more</p></section>
      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-4"><textarea value={text} onChange={e => setText(e.target.value)} rows={6} className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg p-3 font-mono text-sm resize-none" placeholder="Type or paste text..." /></div>
      <div className="grid gap-3 md:grid-cols-3">
        {stats.map(s => (<div key={s.label} className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-4 text-center"><div className="text-xs text-[var(--text-secondary)]">{s.label}</div><div className="text-2xl font-bold text-blue-400">{s.value.toLocaleString()}</div></div>))}
      </div>
    </div>
  );
}
