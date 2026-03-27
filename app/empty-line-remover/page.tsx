"use client";
import { useState } from "react";
export default function Page() {
  const [input, setInput] = useState("");
  return (
    <div className="space-y-6">
      <section className="text-center"><h1 className="text-4xl font-bold mb-2">Empty Line Remover</h1><p className="text-[var(--text-secondary)]">Remove blank lines from text</p></section>
      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-4">
        <textarea value={input} onChange={e=>setInput(e.target.value)} rows={6} className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg p-3 text-sm resize-none" placeholder="Enter text here..." />
      </div>
      <div className="text-center text-sm text-[var(--text-secondary)]">{input.length} characters | {input.trim() ? input.trim().split(/\s+/).length : 0} words</div>
    </div>
  );
}
