"use client";
export default function Page() {
  return (
    <div className="space-y-6">
      <section className="text-center"><h1 className="text-4xl font-bold mb-2">CSS Overflow Demo</h1><p className="text-[var(--text-secondary)]">Interactive overflow demo</p></section>
      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-8 text-center">
        <p className="text-lg">Interactive tool coming soon!</p>
        <p className="text-sm text-[var(--text-secondary)] mt-2">Check out our <a href="/flexbox-playground" className="text-blue-400">Flexbox Playground</a> or <a href="/grid-playground" className="text-blue-400">Grid Playground</a> in the meantime.</p>
      </div>
    </div>
  );
}
