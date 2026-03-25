"use client";
import { useState } from "react";

const transforms: Record<string, { label: string; fn: (t: string) => string }> = {
  upper: { label: "UPPERCASE", fn: (t) => t.toUpperCase() },
  lower: { label: "lowercase", fn: (t) => t.toLowerCase() },
  title: { label: "Title Case", fn: (t) => t.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase()) },
  sentence: { label: "Sentence case", fn: (t) => t.toLowerCase().replace(/(^|[.!?]\s+)\w/g, (c) => c.toUpperCase()) },
  camel: { label: "camelCase", fn: (t) => t.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (_, c) => c.toUpperCase()) },
  pascal: { label: "PascalCase", fn: (t) => t.toLowerCase().replace(/(^|[^a-zA-Z0-9]+)(.)/g, (_, __, c) => c.toUpperCase()) },
  snake: { label: "snake_case", fn: (t) => t.toLowerCase().replace(/[^a-zA-Z0-9]+/g, "_").replace(/^_|_$/g, "") },
  kebab: { label: "kebab-case", fn: (t) => t.toLowerCase().replace(/[^a-zA-Z0-9]+/g, "-").replace(/^-|-$/g, "") },
  constant: { label: "CONSTANT_CASE", fn: (t) => t.toUpperCase().replace(/[^A-Z0-9]+/g, "_").replace(/^_|_$/g, "") },
  dot: { label: "dot.case", fn: (t) => t.toLowerCase().replace(/[^a-zA-Z0-9]+/g, ".").replace(/^\.|\.$/g, "") },
  alternating: { label: "aLtErNaTiNg", fn: (t) => t.split("").map((c, i) => i % 2 === 0 ? c.toLowerCase() : c.toUpperCase()).join("") },
  inverse: { label: "iNVERSE", fn: (t) => t.split("").map((c) => c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase()).join("") },
};

export default function TextCase() {
  const [input, setInput] = useState("Hello World! This is a test.");
  const [copied, setCopied] = useState<string | null>(null);

  const copy = (text: string, key: string) => { navigator.clipboard.writeText(text); setCopied(key); setTimeout(() => setCopied(null), 1500); };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Text Case Converter</h1>
        <p className="text-[var(--text-secondary)]">Convert text between 12 cases. UPPER, lower, Title, camelCase, snake_case, kebab-case, and more. One-click copy.</p>
      </div>
      <div className="max-w-lg mx-auto space-y-4">
        <textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type or paste text..." className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl px-4 py-3 text-white h-24 resize-none text-sm" />
        <div className="space-y-2">
          {Object.entries(transforms).map(([key, { label, fn }]) => {
            const result = fn(input);
            return (
              <div key={key} className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-3 flex items-center justify-between cursor-pointer hover:border-purple-500/30" onClick={() => copy(result, key)}>
                <div className="min-w-0 flex-1">
                  <span className="text-xs text-gray-500">{label}</span>
                  <p className="text-sm text-white font-mono truncate">{result}</p>
                </div>
                <span className="text-xs text-purple-400 ml-2 shrink-0">{copied === key ? "✓" : "Copy"}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
