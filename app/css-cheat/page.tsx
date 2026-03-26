"use client";
export default function Page() {
  return (
    <div className="space-y-6">
      <section className="text-center"><h1 className="text-4xl font-bold mb-2">CSS Cheatsheet</h1><p className="text-[var(--text-secondary)]">Quick reference — coming soon with full commands</p></section>
      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-8 text-center">
        <p className="text-[var(--text-secondary)]">This cheatsheet is being built. Check back soon!</p>
        <p className="text-sm text-[var(--text-secondary)] mt-2">In the meantime, check our <a href="/git-cheat" className="text-blue-400">Git Cheatsheet</a> or <a href="/regex-cheat" className="text-blue-400">Regex Cheatsheet</a>.</p>
      </div>
    </div>
  );
}
