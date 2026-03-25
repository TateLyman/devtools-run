"use client";
import { useState } from "react";

function markdownToHtml(md: string): string {
  let html = md;
  html = html.replace(/```(\w*)\n([\s\S]*?)```/g, '<pre><code class="language-$1">$2</code></pre>');
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
  html = html.replace(/^######\s+(.+)$/gm, '<h6>$1</h6>');
  html = html.replace(/^#####\s+(.+)$/gm, '<h5>$1</h5>');
  html = html.replace(/^####\s+(.+)$/gm, '<h4>$1</h4>');
  html = html.replace(/^###\s+(.+)$/gm, '<h3>$1</h3>');
  html = html.replace(/^##\s+(.+)$/gm, '<h2>$1</h2>');
  html = html.replace(/^#\s+(.+)$/gm, '<h1>$1</h1>');
  html = html.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>');
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
  html = html.replace(/~~(.+?)~~/g, '<del>$1</del>');
  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" />');
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
  html = html.replace(/^>\s+(.+)$/gm, '<blockquote>$1</blockquote>');
  html = html.replace(/^---$/gm, '<hr />');
  html = html.replace(/^[-*]\s+(.+)$/gm, '<li>$1</li>');
  html = html.replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>');
  html = html.replace(/^\d+\.\s+(.+)$/gm, '<li>$1</li>');
  html = html.replace(/\n\n(?!<)/g, '</p>\n<p>');
  html = '<p>' + html + '</p>';
  html = html.replace(/<p><(h[1-6]|ul|ol|pre|blockquote|hr)/g, '<$1');
  html = html.replace(/<\/(h[1-6]|ul|ol|pre|blockquote)><\/p>/g, '</$1>');
  return html;
}

export default function MarkdownToHtml() {
  const [input, setInput] = useState("");
  const [view, setView] = useState<"code" | "preview">("code");
  const [copied, setCopied] = useState(false);

  const output = input.trim() ? markdownToHtml(input) : "";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Markdown to HTML Converter</h1>
        <p className="text-[var(--text-secondary)]">
          Convert Markdown to HTML. Supports headings, bold, italic, links, images, code blocks, lists, blockquotes.
        </p>
      </div>

      <div className="flex gap-2 items-center">
        <button onClick={() => setView("code")} className={`px-3 py-1.5 rounded text-sm ${view === "code" ? "bg-purple-600 text-white" : "bg-[var(--bg-secondary)] text-[var(--text-secondary)]"}`}>HTML Code</button>
        <button onClick={() => setView("preview")} className={`px-3 py-1.5 rounded text-sm ${view === "preview" ? "bg-purple-600 text-white" : "bg-[var(--bg-secondary)] text-[var(--text-secondary)]"}`}>Preview</button>
        <button onClick={() => { navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 2000); }} className="text-xs text-purple-400 hover:text-purple-300 ml-auto">{copied ? "Copied!" : "Copy HTML"}</button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="text-sm font-medium mb-1 block">Markdown</label>
          <textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder="Write or paste Markdown..." className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded px-3 py-2 text-white h-[400px] resize-none font-mono text-sm" spellCheck={false} />
        </div>
        <div>
          <label className="text-sm font-medium mb-1 block">{view === "code" ? "HTML Output" : "Preview"}</label>
          {view === "code" ? (
            <pre className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded px-3 py-2 text-emerald-400 h-[400px] overflow-auto font-mono text-sm whitespace-pre-wrap">{output}</pre>
          ) : (
            <div className="w-full bg-white text-black border border-[var(--border)] rounded px-4 py-3 h-[400px] overflow-auto text-sm prose max-w-none" dangerouslySetInnerHTML={{ __html: output }} />
          )}
        </div>
      </div>
    </div>
  );
}
