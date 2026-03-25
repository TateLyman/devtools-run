import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "DevTools Weekly — Free Developer Newsletter",
  description: "Weekly newsletter with new developer tools, coding tips, CSS tricks, and productivity hacks. Join 0+ developers. Free, no spam.",
  keywords: ["developer newsletter", "web dev newsletter", "coding newsletter", "dev tools newsletter", "weekly developer email"],
};

export default function Newsletter() {
  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      <section className="text-center">
        <h1 className="text-4xl font-bold mb-4">DevTools Weekly</h1>
        <p className="text-xl text-[var(--text-secondary)]">
          A curated newsletter for developers who ship fast. New tools, CSS tricks, coding tips, and productivity hacks — every Tuesday.
        </p>
      </section>

      <section className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 border border-purple-500/20 rounded-xl p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Subscribe Free</h2>
        <form action="https://buttondown.com/api/emails/newsletter-subscribe" method="post" target="_blank" className="flex gap-2 max-w-md mx-auto">
          <input type="email" name="email" placeholder="you@example.com" required className="flex-1 bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg px-4 py-3 text-white" />
          <button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-bold whitespace-nowrap">Subscribe</button>
        </form>
        <p className="text-xs text-gray-500 mt-3">Free forever. Unsubscribe anytime. No spam, no tracking.</p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">What You Get</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-4">
            <h3 className="font-bold text-white mb-1">🛠 New Tools</h3>
            <p className="text-sm text-[var(--text-secondary)]">Curated picks of the best new developer tools, libraries, and frameworks released each week.</p>
          </div>
          <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-4">
            <h3 className="font-bold text-white mb-1">💡 Quick Tips</h3>
            <p className="text-sm text-[var(--text-secondary)]">Bite-sized coding tips you can use immediately. JavaScript, CSS, React, Node.js, and more.</p>
          </div>
          <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-4">
            <h3 className="font-bold text-white mb-1">🎨 CSS Tricks</h3>
            <p className="text-sm text-[var(--text-secondary)]">Creative CSS techniques, animations, layouts, and design inspiration.</p>
          </div>
          <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-4">
            <h3 className="font-bold text-white mb-1">⚡ Productivity</h3>
            <p className="text-sm text-[var(--text-secondary)]">Shortcuts, workflows, and tools that save you hours every week.</p>
          </div>
        </div>
      </section>

      <section className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-6">
        <h2 className="font-bold text-lg mb-3">Sample Issue</h2>
        <div className="space-y-3 text-sm">
          <div className="border-b border-[var(--border)] pb-2">
            <h3 className="font-bold text-purple-400">🛠 Tool of the Week: CSS Grid Generator</h3>
            <p className="text-[var(--text-secondary)]">Build CSS Grid layouts visually. Adjust columns, rows, gap. Copy generated CSS. Free at devtools.run/css-grid-generator</p>
          </div>
          <div className="border-b border-[var(--border)] pb-2">
            <h3 className="font-bold text-purple-400">💡 Quick Tip: The ?? Operator</h3>
            <p className="text-[var(--text-secondary)]">Use `value ?? fallback` instead of `value || fallback`. The nullish coalescing operator only falls back on null/undefined, not on 0 or empty string.</p>
          </div>
          <div>
            <h3 className="font-bold text-purple-400">🎨 CSS Trick: Glassmorphism in 3 Lines</h3>
            <p className="text-[var(--text-secondary)]">backdrop-filter: blur(10px); background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2);</p>
          </div>
        </div>
      </section>

      <section className="text-center">
        <p className="text-sm text-[var(--text-secondary)]">
          Built by the creator of <a href="/" className="text-purple-400">DevTools.run</a> (230+ free dev tools) and <a href="https://t.me/solscanitbot" className="text-purple-400">@solscanitbot</a> (Solana trading bot).
        </p>
      </section>
    </div>
  );
}
