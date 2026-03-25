"use client";
import { useState } from "react";

const sampleHTML = `<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial; max-width: 600px; margin: 40px auto; padding: 0 20px; }
    h1 { color: #7c3aed; }
    .card { background: #f0f0f0; padding: 20px; border-radius: 8px; margin: 10px 0; }
    button { background: #7c3aed; color: white; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer; }
  </style>
</head>
<body>
  <h1>Hello World!</h1>
  <p>This is a live HTML preview.</p>
  <div class="card">
    <h3>Card Title</h3>
    <p>Some card content here.</p>
    <button onclick="alert('Clicked!')">Click Me</button>
  </div>
</body>
</html>`;

export default function HTMLPreview() {
  const [html, setHtml] = useState(sampleHTML);
  const [view, setView] = useState<"split" | "code" | "preview">("split");

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold mb-2">HTML Live Preview</h1>
        <p className="text-[var(--text-secondary)]">
          Write HTML and see a live preview side by side. Includes CSS and JavaScript execution. Free online HTML editor.
        </p>
      </div>

      <div className="flex gap-2">
        {(["split", "code", "preview"] as const).map((v) => (
          <button key={v} onClick={() => setView(v)} className={`px-3 py-1 rounded text-sm capitalize ${view === v ? "bg-purple-600 text-white" : "bg-[var(--bg-secondary)] text-[var(--text-secondary)]"}`}>{v}</button>
        ))}
      </div>

      <div className={`grid gap-4 ${view === "split" ? "md:grid-cols-2" : ""}`}>
        {(view === "split" || view === "code") && (
          <textarea
            value={html}
            onChange={(e) => setHtml(e.target.value)}
            className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded px-3 py-2 text-white h-[500px] resize-none font-mono text-sm"
            spellCheck={false}
          />
        )}
        {(view === "split" || view === "preview") && (
          <iframe
            srcDoc={html}
            className="w-full bg-white border border-[var(--border)] rounded h-[500px]"
            sandbox="allow-scripts allow-modals"
            title="HTML Preview"
          />
        )}
      </div>
    </div>
  );
}
