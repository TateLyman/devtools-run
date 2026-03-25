"use client";
import { useState } from "react";

function parseMarkdown(md: string): string {
  let html = md;
  // Code blocks
  html = html.replace(/```(\w*)\n([\s\S]*?)```/g, '<pre class="bg-gray-900 rounded p-3 overflow-auto my-2"><code>$2</code></pre>');
  // Inline code
  html = html.replace(/`([^`]+)`/g, '<code class="bg-gray-800 px-1 rounded text-pink-400">$1</code>');
  // Headers
  html = html.replace(/^######\s+(.+)$/gm, '<h6 class="text-sm font-bold mt-4 mb-1">$1</h6>');
  html = html.replace(/^#####\s+(.+)$/gm, '<h5 class="text-base font-bold mt-4 mb-1">$1</h5>');
  html = html.replace(/^####\s+(.+)$/gm, '<h4 class="text-lg font-bold mt-4 mb-2">$1</h4>');
  html = html.replace(/^###\s+(.+)$/gm, '<h3 class="text-xl font-bold mt-4 mb-2">$1</h3>');
  html = html.replace(/^##\s+(.+)$/gm, '<h2 class="text-2xl font-bold mt-6 mb-2 pb-1 border-b border-gray-700">$1</h2>');
  html = html.replace(/^#\s+(.+)$/gm, '<h1 class="text-3xl font-bold mt-6 mb-3">$1</h1>');
  // Bold & italic
  html = html.replace(/\*\*\*(.+?)\*\*\*/g, "<strong><em>$1</em></strong>");
  html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/\*(.+?)\*/g, "<em>$1</em>");
  html = html.replace(/~~(.+?)~~/g, "<del>$1</del>");
  // Links & images
  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="max-w-full rounded my-2" />');
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-400 underline" target="_blank">$1</a>');
  // Blockquotes
  html = html.replace(/^>\s+(.+)$/gm, '<blockquote class="border-l-4 border-purple-500 pl-4 my-2 text-gray-400 italic">$1</blockquote>');
  // Horizontal rule
  html = html.replace(/^---$/gm, '<hr class="border-gray-700 my-4" />');
  // Unordered lists
  html = html.replace(/^[-*]\s+(.+)$/gm, '<li class="ml-4 list-disc">$1</li>');
  // Ordered lists
  html = html.replace(/^\d+\.\s+(.+)$/gm, '<li class="ml-4 list-decimal">$1</li>');
  // Checkboxes
  html = html.replace(/\[ \]/g, '<input type="checkbox" disabled class="mr-1" />');
  html = html.replace(/\[x\]/gi, '<input type="checkbox" checked disabled class="mr-1" />');
  // Paragraphs
  html = html.replace(/\n\n/g, "</p><p class='my-2'>");
  // Line breaks
  html = html.replace(/\n/g, "<br>");

  return `<p class="my-2">${html}</p>`;
}

const sampleMd = `# Markdown Preview

## Features

This is a **free** markdown editor with *live preview*.

### Formatting

- **Bold** text
- *Italic* text
- ~~Strikethrough~~
- \`inline code\`

### Code Block

\`\`\`javascript
const greeting = "Hello, World!";
console.log(greeting);
\`\`\`

### Links & Images

[DevTools.run](https://devtools.run) — Free developer tools

### Blockquote

> The best way to predict the future is to create it.

### Checklist

- [x] Write markdown
- [x] Preview it
- [ ] Ship it

---

*Made with DevTools.run*`;

export default function MarkdownPreview() {
  const [input, setInput] = useState(sampleMd);
  const [view, setView] = useState<"split" | "edit" | "preview">("split");
  const [copied, setCopied] = useState(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const wordCount = input.trim() ? input.trim().split(/\s+/).length : 0;
  const charCount = input.length;

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold mb-2">Markdown Preview</h1>
        <p className="text-[var(--text-secondary)]">
          Write Markdown and see a live preview. Supports headers, bold, italic, code blocks, lists, links, images, and more.
        </p>
      </div>

      <div className="flex gap-2 items-center">
        {(["split", "edit", "preview"] as const).map((v) => (
          <button key={v} onClick={() => setView(v)} className={`px-3 py-1 rounded text-sm capitalize ${view === v ? "bg-purple-600 text-white" : "bg-[var(--bg-secondary)] text-[var(--text-secondary)]"}`}>{v}</button>
        ))}
        <span className="text-xs text-[var(--text-secondary)] ml-auto">{wordCount} words · {charCount} chars</span>
        <button onClick={() => handleCopy(input)} className="text-xs text-purple-400 hover:text-purple-300">{copied ? "Copied!" : "Copy MD"}</button>
        <button onClick={() => handleCopy(parseMarkdown(input))} className="text-xs text-purple-400 hover:text-purple-300">Copy HTML</button>
      </div>

      <div className={`grid gap-4 ${view === "split" ? "md:grid-cols-2" : ""}`}>
        {(view === "split" || view === "edit") && (
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded px-4 py-3 text-white h-[600px] resize-none font-mono text-sm"
            spellCheck={false}
          />
        )}
        {(view === "split" || view === "preview") && (
          <div
            className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded px-6 py-4 h-[600px] overflow-auto prose prose-invert max-w-none text-sm"
            dangerouslySetInnerHTML={{ __html: parseMarkdown(input) }}
          />
        )}
      </div>
    </div>
  );
}
