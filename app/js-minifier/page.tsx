"use client";
import { useState } from "react";

function minifyJS(code: string): string {
  let result = code;
  // Remove single-line comments (but not URLs with //)
  result = result.replace(/(?<![:"'])\/\/(?![\/"']).*$/gm, "");
  // Remove multi-line comments
  result = result.replace(/\/\*[\s\S]*?\*\//g, "");
  // Remove leading/trailing whitespace per line
  result = result.replace(/^\s+|\s+$/gm, "");
  // Collapse multiple newlines
  result = result.replace(/\n\s*\n/g, "\n");
  // Collapse whitespace
  result = result.replace(/\s+/g, " ");
  // Remove spaces around operators
  result = result.replace(/\s*([=+\-*/<>!&|,;:{}()[\]])\s*/g, "$1");
  // Add back needed spaces (function, var, let, const, return, etc.)
  result = result.replace(/\b(function|var|let|const|return|if|else|for|while|do|switch|case|break|continue|new|typeof|instanceof|in|of|class|extends|import|export|from|default|throw|try|catch|finally|async|await|yield)\b/g, " $1 ");
  // Clean up double spaces
  result = result.replace(/  +/g, " ");
  return result.trim();
}

export default function JSMinifier() {
  const [input, setInput] = useState("");
  const [copied, setCopied] = useState(false);

  const output = input.trim() ? minifyJS(input) : "";
  const savings = input.length > 0 && output.length > 0
    ? Math.round((1 - output.length / input.length) * 100)
    : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">JavaScript Minifier</h1>
        <p className="text-[var(--text-secondary)]">
          Minify JavaScript code. Removes comments, collapses whitespace, strips unnecessary characters. See size savings instantly.
        </p>
      </div>

      <div className="flex gap-2 items-center">
        <button onClick={() => { navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 2000); }} className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded text-sm font-bold">{copied ? "Copied!" : "Copy Minified"}</button>
        <button onClick={() => setInput("")} className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 rounded text-sm">Clear</button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="text-sm font-medium mb-1 block">JavaScript Input</label>
          <textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder="Paste JavaScript to minify..." className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded px-3 py-2 text-white h-[400px] resize-none font-mono text-sm" spellCheck={false} />
        </div>
        <div>
          <label className="text-sm font-medium mb-1 block">Minified Output</label>
          <pre className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded px-3 py-2 text-emerald-400 h-[400px] overflow-auto font-mono text-sm whitespace-pre-wrap break-all">{output}</pre>
        </div>
      </div>

      {input.length > 0 && (
        <div className="flex gap-4 text-xs text-[var(--text-secondary)]">
          <span>Original: {input.length.toLocaleString()} chars ({(input.length / 1024).toFixed(1)} KB)</span>
          <span>Minified: {output.length.toLocaleString()} chars ({(output.length / 1024).toFixed(1)} KB)</span>
          {savings > 0 && <span className="text-emerald-400 font-bold">Saved {savings}% ({((input.length - output.length) / 1024).toFixed(1)} KB)</span>}
        </div>
      )}
    </div>
  );
}
