"use client";
import { useState } from "react";
export default function Page() {
  const [input, setInput] = useState("");
  return (
    <div className="space-y-6">
      <section className="text-center"><h1 className="text-4xl font-bold mb-2">Gitignore Generator</h1><p className="text-[var(--text-secondary)]">Generate .gitignore files</p></section>
      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-4">
        <input value={input} onChange={e=>setInput(e.target.value)} placeholder="Enter value..." className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg px-3 py-2" />
      </div>
      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-8 text-center text-sm text-[var(--text-secondary)]">Full implementation coming soon. Try our <a href="/" className="text-blue-400">475+ other tools</a></div>
    </div>
  );
}
