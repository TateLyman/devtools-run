"use client";

import { useState, useMemo } from "react";

function parseMarkdown(md: string): string {
  let html = md;

  // Escape HTML entities
  html = html
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  // Code blocks (``` ... ```)
  html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (_match, _lang, code) => {
    return `<pre><code>${code.trim()}</code></pre>`;
  });

  // Inline code
  html = html.replace(/`([^`]+)`/g, "<code>$1</code>");

  // Headings
  html = html.replace(/^######\s+(.+)$/gm, "<h6>$1</h6>");
  html = html.replace(/^#####\s+(.+)$/gm, "<h5>$1</h5>");
  html = html.replace(/^####\s+(.+)$/gm, "<h4>$1</h4>");
  html = html.replace(/^###\s+(.+)$/gm, "<h3>$1</h3>");
  html = html.replace(/^##\s+(.+)$/gm, "<h2>$1</h2>");
  html = html.replace(/^#\s+(.+)$/gm, "<h1>$1</h1>");

  // Bold and italic
  html = html.replace(/\*\*\*(.+?)\*\*\*/g, "<strong><em>$1</em></strong>");
  html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/\*(.+?)\*/g, "<em>$1</em>");
  html = html.replace(/___(.+?)___/g, "<strong><em>$1</em></strong>");
  html = html.replace(/__(.+?)__/g, "<strong>$1</strong>");
  html = html.replace(/_(.+?)_/g, "<em>$1</em>");

  // Links
  html = html.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>'
  );

  // Blockquotes
  html = html.replace(/^&gt;\s+(.+)$/gm, "<blockquote>$1</blockquote>");

  // Unordered lists
  html = html.replace(/^[-*+]\s+(.+)$/gm, "<li>$1</li>");
  html = html.replace(/((?:<li>.*<\/li>\n?)+)/g, "<ul>$1</ul>");

  // Ordered lists
  html = html.replace(/^\d+\.\s+(.+)$/gm, "<li>$1</li>");

  // Horizontal rules
  html = html.replace(/^---+$/gm, "<hr>");

  // Paragraphs - wrap remaining lines
  const lines = html.split("\n");
  const result: string[] = [];
  let inPre = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.includes("<pre>")) inPre = true;
    if (line.includes("</pre>")) {
      inPre = false;
      result.push(line);
      continue;
    }
    if (inPre) {
      result.push(line);
      continue;
    }

    const isBlock =
      /^<(h[1-6]|ul|ol|li|blockquote|pre|hr)/.test(line.trim()) ||
      line.trim() === "";

    if (!isBlock && line.trim()) {
      result.push(`<p>${line}</p>`);
    } else {
      result.push(line);
    }
  }

  return result.join("\n");
}

export default function MarkdownPreviewPage() {
  const [input, setInput] = useState(
    `# Hello World

This is a **Markdown** preview tool. It supports *italic*, **bold**, and ***bold italic*** text.

## Features

- Headings (h1-h6)
- **Bold** and *italic* text
- [Links](https://example.com)
- Code blocks
- Lists and blockquotes

> This is a blockquote

\`\`\`js
const greeting = "Hello!";
console.log(greeting);
\`\`\`

Inline \`code\` is also supported.`
  );

  const renderedHtml = useMemo(() => parseMarkdown(input), [input]);

  function copyHtml() {
    navigator.clipboard.writeText(renderedHtml);
  }

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">Markdown Preview</h1>
        <p className="text-[var(--text-secondary)] text-sm">
          Write Markdown on the left and see the rendered preview on the right.
          Runs entirely in your browser.
        </p>
      </div>

      {/* AD SLOT - Top */}
      <div className="ad-slot mb-6">
        {/* AD SLOT: in-content ad */}
        <span>Ad Space</span>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div>
          <label className="block text-sm font-medium mb-2">
            Markdown Input
          </label>
          <textarea
            rows={18}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your Markdown here..."
            spellCheck={false}
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium">Preview</label>
            {renderedHtml && (
              <button
                onClick={copyHtml}
                className="text-xs text-[var(--accent)] hover:underline"
              >
                Copy HTML
              </button>
            )}
          </div>
          <div
            className="rounded-lg border border-[var(--border)] bg-[var(--bg-tertiary)] p-4 min-h-[430px] overflow-auto prose-dark"
            dangerouslySetInnerHTML={{ __html: renderedHtml }}
            style={{
              fontSize: "0.875rem",
              lineHeight: "1.6",
            }}
          />
        </div>
      </div>

      {/* AD SLOT - Bottom */}
      <div className="ad-slot mt-8">
        {/* AD SLOT: in-content ad */}
        <span>Ad Space</span>
      </div>

      <section className="mt-10 text-sm text-[var(--text-secondary)] space-y-2">
        <h2 className="text-lg font-semibold text-white">
          About Markdown Preview
        </h2>
        <p>
          This free online Markdown preview tool lets you write Markdown and
          instantly see the rendered HTML output. Supports headings, bold,
          italic, links, code blocks, lists, and blockquotes. All processing
          happens in your browser &mdash; your data never leaves your machine.
        </p>
      </section>

      <style jsx global>{`
        .prose-dark h1 {
          font-size: 1.5rem;
          font-weight: 700;
          margin: 0.75rem 0;
          color: white;
        }
        .prose-dark h2 {
          font-size: 1.25rem;
          font-weight: 700;
          margin: 0.75rem 0;
          color: white;
        }
        .prose-dark h3 {
          font-size: 1.1rem;
          font-weight: 600;
          margin: 0.5rem 0;
          color: white;
        }
        .prose-dark h4,
        .prose-dark h5,
        .prose-dark h6 {
          font-size: 1rem;
          font-weight: 600;
          margin: 0.5rem 0;
          color: white;
        }
        .prose-dark p {
          margin: 0.5rem 0;
        }
        .prose-dark a {
          color: var(--accent);
          text-decoration: underline;
        }
        .prose-dark strong {
          color: white;
          font-weight: 600;
        }
        .prose-dark blockquote {
          border-left: 3px solid var(--accent);
          padding-left: 1rem;
          color: var(--text-secondary);
          margin: 0.5rem 0;
        }
        .prose-dark pre {
          background: var(--bg-secondary);
          border: 1px solid var(--border);
          border-radius: 0.375rem;
          padding: 0.75rem;
          overflow-x: auto;
          margin: 0.5rem 0;
          font-size: 0.8125rem;
        }
        .prose-dark code {
          background: var(--bg-secondary);
          padding: 0.125rem 0.375rem;
          border-radius: 0.25rem;
          font-size: 0.8125rem;
          font-family: "SF Mono", "Fira Code", "Fira Mono", Menlo, Consolas,
            monospace;
        }
        .prose-dark pre code {
          background: none;
          padding: 0;
        }
        .prose-dark ul {
          list-style: disc;
          padding-left: 1.5rem;
          margin: 0.5rem 0;
        }
        .prose-dark li {
          margin: 0.25rem 0;
        }
        .prose-dark hr {
          border: none;
          border-top: 1px solid var(--border);
          margin: 1rem 0;
        }
      `}</style>
    </>
  );
}
