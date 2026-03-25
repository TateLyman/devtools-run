"use client";
import { useState } from "react";

function formatXML(xml: string, indent: number = 2): string {
  const sp = " ".repeat(indent);
  let formatted = "";
  let depth = 0;

  xml = xml.replace(/>\s*</g, ">\n<");

  xml.split("\n").forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed) return;

    if (trimmed.startsWith("</")) {
      depth = Math.max(0, depth - 1);
    }

    formatted += sp.repeat(depth) + trimmed + "\n";

    if (
      !trimmed.startsWith("<?") &&
      !trimmed.startsWith("<!") &&
      !trimmed.startsWith("</") &&
      !trimmed.endsWith("/>") &&
      !trimmed.includes("</")
    ) {
      depth++;
    }
  });

  return formatted.trim();
}

function minifyXML(xml: string): string {
  return xml
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/>\s+</g, "><")
    .replace(/\s+/g, " ")
    .trim();
}

export default function XMLFormatter() {
  const [input, setInput] = useState("");
  const [indent, setIndent] = useState(2);
  const [copied, setCopied] = useState(false);
  const [mode, setMode] = useState<"format" | "minify">("format");

  const output = input.trim()
    ? mode === "format" ? formatXML(input, indent) : minifyXML(input)
    : "";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">XML Formatter & Minifier</h1>
        <p className="text-[var(--text-secondary)]">
          Format and beautify XML or minify it. Customizable indentation. Free online XML formatter.
        </p>
      </div>

      <div className="flex gap-2 items-center">
        <button onClick={() => setMode("format")} className={`px-4 py-2 rounded text-sm font-bold ${mode === "format" ? "bg-purple-600 text-white" : "bg-[var(--bg-secondary)] text-[var(--text-secondary)]"}`}>Format</button>
        <button onClick={() => setMode("minify")} className={`px-4 py-2 rounded text-sm font-bold ${mode === "minify" ? "bg-purple-600 text-white" : "bg-[var(--bg-secondary)] text-[var(--text-secondary)]"}`}>Minify</button>
        <select value={indent} onChange={(e) => setIndent(Number(e.target.value))} className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded px-2 py-2 text-white text-sm">
          <option value={2}>2 spaces</option>
          <option value={4}>4 spaces</option>
        </select>
        <button onClick={() => { navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 2000); }} className="text-xs text-purple-400 hover:text-purple-300 ml-auto">{copied ? "Copied!" : "Copy"}</button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="text-sm font-medium mb-1 block">XML Input</label>
          <textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder="Paste XML here..." className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded px-3 py-2 text-white h-[400px] resize-none font-mono text-sm" spellCheck={false} />
        </div>
        <div>
          <label className="text-sm font-medium mb-1 block">Output</label>
          <pre className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded px-3 py-2 text-emerald-400 h-[400px] overflow-auto font-mono text-sm whitespace-pre-wrap">{output}</pre>
        </div>
      </div>
    </div>
  );
}
