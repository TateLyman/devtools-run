"use client";
import { useState } from "react";

function mdToHtml(md: string): string {
  return md
    .replace(/^### (.+)$/gm, "<h3>$1</h3>")
    .replace(/^## (.+)$/gm, "<h2>$1</h2>")
    .replace(/^# (.+)$/gm, "<h1>$1</h1>")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/~~(.+?)~~/g, "<del>$1</del>")
    .replace(/`(.+?)`/g, "<code>$1</code>")
    .replace(/^\- (.+)$/gm, "<li>$1</li>")
    .replace(/^\d+\. (.+)$/gm, "<li>$1</li>")
    .replace(/^> (.+)$/gm, "<blockquote>$1</blockquote>")
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2">$1</a>')
    .replace(/^---$/gm, "<hr>")
    .replace(/\n\n/g, "\n<br>\n");
}

const SAMPLE = `# Hello World

## This is a heading

Some **bold** and *italic* text with a [link](https://example.com).

- Item one
- Item two
- Item three

> A blockquote

\`inline code\` here

---

1. First
2. Second
3. Third`;

export default function MdToHtml() {
  const [md, setMd] = useState(SAMPLE);
  const html = mdToHtml(md);
  const copy = () => navigator.clipboard.writeText(html);

  return (
    <div className="space-y-6">
      <section className="text-center">
        <h1 className="text-4xl font-bold mb-2">Markdown to HTML</h1>
        <p className="text-[var(--text-secondary)]">Convert Markdown to HTML instantly</p>
      </section>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-4">
          <label className="text-sm font-bold block mb-2">Markdown</label>
          <textarea value={md} onChange={e => setMd(e.target.value)} rows={16}
            className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg p-3 font-mono text-sm resize-none" />
        </div>
        <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-4">
          <div className="flex justify-between mb-2">
            <label className="text-sm font-bold">HTML Output</label>
            <button onClick={copy} className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs font-bold">Copy</button>
          </div>
          <pre className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg p-3 font-mono text-xs text-emerald-400 whitespace-pre-wrap overflow-auto" style={{ minHeight: "400px" }}>{html}</pre>
        </div>
      </div>
    </div>
  );
}
