"use client";
import { useState } from "react";
export default function HtmlToText() {
  const [html, setHtml] = useState('<h1>Hello World</h1>\n<p>This is a <strong>bold</strong> and <em>italic</em> paragraph.</p>\n<ul>\n  <li>Item 1</li>\n  <li>Item 2</li>\n</ul>');
  const strip = (h: string) => { const d = typeof document !== "undefined" ? document.createElement("div") : null; if (!d) return h; d.innerHTML = h; return d.textContent || ""; };
  const text = strip(html);
  return (
    <div className="space-y-6">
      <section className="text-center"><h1 className="text-4xl font-bold mb-2">HTML to Text</h1><p className="text-[var(--text-secondary)]">Strip HTML tags, keep plain text</p></section>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-4"><label className="text-sm font-bold block mb-2">HTML Input</label><textarea value={html} onChange={e => setHtml(e.target.value)} rows={10} className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg p-3 font-mono text-sm resize-none" /></div>
        <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-4"><div className="flex justify-between mb-2"><label className="text-sm font-bold">Plain Text</label><button onClick={() => navigator.clipboard.writeText(text)} className="text-xs text-blue-400">Copy</button></div><textarea value={text} readOnly rows={10} className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg p-3 text-sm resize-none" /></div>
      </div>
    </div>
  );
}
