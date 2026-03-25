"use client";
import { useState } from "react";

function htmlToMarkdown(html: string): string {
  let md = html;
  // Headers
  md = md.replace(/<h1[^>]*>(.*?)<\/h1>/gi, "# $1\n\n");
  md = md.replace(/<h2[^>]*>(.*?)<\/h2>/gi, "## $1\n\n");
  md = md.replace(/<h3[^>]*>(.*?)<\/h3>/gi, "### $1\n\n");
  md = md.replace(/<h4[^>]*>(.*?)<\/h4>/gi, "#### $1\n\n");
  md = md.replace(/<h5[^>]*>(.*?)<\/h5>/gi, "##### $1\n\n");
  md = md.replace(/<h6[^>]*>(.*?)<\/h6>/gi, "###### $1\n\n");
  // Bold & italic
  md = md.replace(/<(strong|b)[^>]*>(.*?)<\/(strong|b)>/gi, "**$2**");
  md = md.replace(/<(em|i)[^>]*>(.*?)<\/(em|i)>/gi, "*$2*");
  md = md.replace(/<(del|s|strike)[^>]*>(.*?)<\/(del|s|strike)>/gi, "~~$2~~");
  // Links
  md = md.replace(/<a[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/gi, "[$2]($1)");
  // Images
  md = md.replace(/<img[^>]*src="([^"]*)"[^>]*alt="([^"]*)"[^>]*\/?>/gi, "![$2]($1)");
  md = md.replace(/<img[^>]*src="([^"]*)"[^>]*\/?>/gi, "![]($1)");
  // Code
  md = md.replace(/<code[^>]*>(.*?)<\/code>/gi, "`$1`");
  md = md.replace(/<pre[^>]*><code[^>]*>([\s\S]*?)<\/code><\/pre>/gi, "\n```\n$1\n```\n");
  md = md.replace(/<pre[^>]*>([\s\S]*?)<\/pre>/gi, "\n```\n$1\n```\n");
  // Lists
  md = md.replace(/<li[^>]*>(.*?)<\/li>/gi, "- $1\n");
  md = md.replace(/<\/?[ou]l[^>]*>/gi, "\n");
  // Blockquote
  md = md.replace(/<blockquote[^>]*>([\s\S]*?)<\/blockquote>/gi, "> $1\n");
  // Paragraph & breaks
  md = md.replace(/<p[^>]*>(.*?)<\/p>/gi, "$1\n\n");
  md = md.replace(/<br\s*\/?>/gi, "  \n");
  md = md.replace(/<hr\s*\/?>/gi, "\n---\n\n");
  // Remove remaining tags
  md = md.replace(/<\/?[^>]+(>|$)/g, "");
  // Decode entities
  md = md.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, " ");
  // Clean up whitespace
  md = md.replace(/\n{3,}/g, "\n\n").trim();
  return md;
}

export default function HtmlToMarkdown() {
  const [input, setInput] = useState("");
  const [copied, setCopied] = useState(false);

  const output = input.trim() ? htmlToMarkdown(input) : "";

  const sampleHTML = `<h1>Getting Started</h1>
<p>Welcome to <strong>DevTools.run</strong> — a collection of <em>free</em> developer tools.</p>
<h2>Features</h2>
<ul>
  <li>200+ tools</li>
  <li>100% client-side</li>
  <li>No signup required</li>
</ul>
<h2>Quick Start</h2>
<p>Visit <a href="https://devtools.run">devtools.run</a> and start using tools immediately.</p>
<pre><code>npm install devtools-cli</code></pre>
<blockquote>All tools run in your browser. No data is sent to any server.</blockquote>
<hr>
<p>Built with <del>tears</del> love.</p>`;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">HTML to Markdown Converter</h1>
        <p className="text-[var(--text-secondary)]">
          Convert HTML to clean Markdown. Handles headings, bold, italic, links, images, code blocks, lists, blockquotes.
        </p>
      </div>

      <div className="flex gap-2">
        <button onClick={() => setInput(sampleHTML)} className="text-xs text-purple-400 hover:text-purple-300">Load Example</button>
        <button onClick={() => { navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 2000); }} className="text-xs text-purple-400 hover:text-purple-300 ml-auto">{copied ? "Copied!" : "Copy Markdown"}</button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="text-sm font-medium mb-1 block">HTML Input</label>
          <textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder="Paste HTML here..." className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded px-3 py-2 text-white h-[400px] resize-none font-mono text-sm" spellCheck={false} />
        </div>
        <div>
          <label className="text-sm font-medium mb-1 block">Markdown Output</label>
          <pre className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded px-3 py-2 text-emerald-400 h-[400px] overflow-auto font-mono text-sm whitespace-pre-wrap">{output}</pre>
        </div>
      </div>
    </div>
  );
}
