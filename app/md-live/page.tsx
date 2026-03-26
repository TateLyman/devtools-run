"use client";
import { useState } from "react";

function renderMd(md: string): string {
  return md
    .replace(/^### (.+)$/gm, '<h3 class="text-lg font-bold mt-4 mb-1">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="text-xl font-bold mt-4 mb-2">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 class="text-2xl font-bold mt-4 mb-2">$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/~~(.+?)~~/g, '<del>$1</del>')
    .replace(/`(.+?)`/g, '<code class="bg-gray-800 px-1 rounded text-sm">$1</code>')
    .replace(/^\- (.+)$/gm, '<li class="ml-4">$1</li>')
    .replace(/^\d+\. (.+)$/gm, '<li class="ml-4 list-decimal">$1</li>')
    .replace(/^> (.+)$/gm, '<blockquote class="border-l-4 border-blue-500 pl-4 italic text-gray-400">$1</blockquote>')
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" class="text-blue-400 underline">$1</a>')
    .replace(/^---$/gm, '<hr class="border-gray-700 my-4" />')
    .replace(/\n\n/g, '</p><p class="mb-2">')
    .replace(/\n/g, '<br />');
}

const SAMPLE = `# Markdown Editor

## Features

- **Bold** and *italic* text
- ~~Strikethrough~~ text
- \`Inline code\` blocks
- [Links](https://example.com)

### Lists

1. First item
2. Second item
3. Third item

> Blockquotes look like this

---

Write your markdown on the left, see the preview on the right.`;

export default function MdLive() {
  const [md, setMd] = useState(SAMPLE);

  const download = () => {
    const blob = new Blob([md], { type: "text/markdown" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "document.md"; a.click();
  };

  const copy = () => navigator.clipboard.writeText(md);
  const wordCount = md.trim() ? md.trim().split(/\s+/).length : 0;

  return (
    <div className="space-y-4">
      <section className="text-center">
        <h1 className="text-4xl font-bold mb-1">Markdown Editor</h1>
        <p className="text-sm text-[var(--text-secondary)]">Write Markdown with live preview</p>
      </section>

      <div className="flex gap-2 justify-center text-xs text-[var(--text-secondary)]">
        <span>{wordCount} words</span>
        <span>|</span>
        <span>{md.length} chars</span>
        <span>|</span>
        <button onClick={copy} className="text-blue-400">Copy</button>
        <span>|</span>
        <button onClick={download} className="text-emerald-400">Download .md</button>
      </div>

      <div className="grid gap-4 md:grid-cols-2" style={{ minHeight: "500px" }}>
        <textarea value={md} onChange={e => setMd(e.target.value)}
          className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-4 font-mono text-sm resize-none" style={{ minHeight: "500px" }} />
        <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-4 overflow-y-auto prose prose-invert max-w-none text-sm"
          dangerouslySetInnerHTML={{ __html: `<p class="mb-2">${renderMd(md)}</p>` }} />
      </div>
    </div>
  );
}
