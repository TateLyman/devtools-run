"use client";
import { useState } from "react";
export default function Page() {
  const [search, setSearch] = useState("");
  return (
    <div className="space-y-6">
      <section className="text-center"><h1 className="text-4xl font-bold mb-2">Prisma Cheatsheet</h1><p className="text-[var(--text-secondary)]">Prisma ORM query reference</p></section>
      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-4"><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search..." className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg px-3 py-2" /></div>
      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-8 text-center"><p>Full reference guide coming soon!</p><p className="text-sm text-[var(--text-secondary)] mt-2">Try our <a href="/git-cheat" className="text-blue-400">Git Cheatsheet</a>, <a href="/regex-cheat" className="text-blue-400">Regex Cheatsheet</a>, or <a href="/http-codes" className="text-blue-400">HTTP Status Codes</a></p></div>
    </div>
  );
}
