"use client";
import { useState } from "react";

function minifyHTML(html: string): string {
  return html
    .replace(/<!--[\s\S]*?-->/g, "") // Remove comments
    .replace(/\s+/g, " ") // Collapse whitespace
    .replace(/>\s+</g, "><") // Remove spaces between tags
    .replace(/\s+>/g, ">") // Remove spaces before >
    .replace(/<\s+/g, "<") // Remove spaces after <
    .trim();
}

function beautifyHTML(html: string): string {
  const selfClosing = new Set(["br", "hr", "img", "input", "meta", "link", "area", "base", "col", "embed", "source"]);
  let depth = 0;
  const indent = "  ";

  return html
    .replace(/>\s*</g, ">\n<")
    .split("\n")
    .map((line) => {
      line = line.trim();
      if (!line) return "";
      const isClosing = line.startsWith("</");
      const tagMatch = line.match(/<\/?(\w+)/);
      const tagName = tagMatch ? tagMatch[1].toLowerCase() : "";
      const isSelf = selfClosing.has(tagName) || line.endsWith("/>");

      if (isClosing) depth = Math.max(0, depth - 1);
      const result = indent.repeat(depth) + line;
      if (!isClosing && !isSelf && tagMatch && !line.startsWith("<!")) depth++;

      return result;
    })
    .filter(Boolean)
    .join("\n");
}

export default function HTMLMinifier() {
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<"minify" | "beautify">("minify");
  const [copied, setCopied] = useState(false);

  const output = input.trim()
    ? mode === "minify" ? minifyHTML(input) : beautifyHTML(input)
    : "";

  const savings = input.length > 0 && output.length > 0
    ? Math.round((1 - output.length / input.length) * 100)
    : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">HTML Minifier / Beautifier</h1>
        <p className="text-[var(--text-secondary)]">
          Minify HTML to reduce file size or beautify for readability. Removes comments, collapses whitespace, strips unnecessary spaces.
        </p>
      </div>

      <div className="flex gap-2 items-center">
        <button onClick={() => setMode("minify")} className={`px-4 py-2 rounded text-sm font-bold ${mode === "minify" ? "bg-purple-600 text-white" : "bg-[var(--bg-secondary)] text-[var(--text-secondary)]"}`}>Minify</button>
        <button onClick={() => setMode("beautify")} className={`px-4 py-2 rounded text-sm font-bold ${mode === "beautify" ? "bg-purple-600 text-white" : "bg-[var(--bg-secondary)] text-[var(--text-secondary)]"}`}>Beautify</button>
        <button onClick={() => { navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 2000); }} className="text-xs text-purple-400 hover:text-purple-300 ml-auto">{copied ? "Copied!" : "Copy"}</button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="text-sm font-medium mb-1 block">Input HTML</label>
          <textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder="Paste HTML to minify or beautify..." className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded px-3 py-2 text-white h-[400px] resize-none font-mono text-sm" spellCheck={false} />
        </div>
        <div>
          <label className="text-sm font-medium mb-1 block">Output</label>
          <pre className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded px-3 py-2 text-emerald-400 h-[400px] overflow-auto font-mono text-sm whitespace-pre-wrap">{output}</pre>
        </div>
      </div>

      {input.length > 0 && (
        <div className="flex gap-4 text-xs text-[var(--text-secondary)]">
          <span>Original: {input.length.toLocaleString()} chars</span>
          <span>Result: {output.length.toLocaleString()} chars</span>
          {mode === "minify" && savings > 0 && <span className="text-emerald-400">Saved {savings}%</span>}
        </div>
      )}
    </div>
  );
}
