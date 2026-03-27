"use client";
import { useState } from "react";
export default function Page() {
  const [search, setSearch] = useState("");
  return (
    <div className="space-y-6">
      <section className="text-center"><h1 className="text-4xl font-bold mb-2">Go Cheatsheet</h1><p className="text-[var(--text-secondary)]">Go language quick reference</p></section>
      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-4"><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search..." className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg px-3 py-2" /></div>
      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-8 text-center"><p>Full cheatsheet coming soon.</p><p className="text-sm text-[var(--text-secondary)] mt-2">Browse <a href="/" className="text-blue-400">510+ free tools</a></p></div>
    </div>
  );
}
