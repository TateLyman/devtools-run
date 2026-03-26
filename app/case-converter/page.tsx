"use client";
import { useState } from "react";

const conversions = [
  { name: "UPPERCASE", fn: (s: string) => s.toUpperCase() },
  { name: "lowercase", fn: (s: string) => s.toLowerCase() },
  { name: "Title Case", fn: (s: string) => s.toLowerCase().replace(/\b\w/g, c => c.toUpperCase()) },
  { name: "Sentence case", fn: (s: string) => s.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, c => c.toUpperCase()) },
  { name: "camelCase", fn: (s: string) => s.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (_, c) => c.toUpperCase()) },
  { name: "PascalCase", fn: (s: string) => s.toLowerCase().replace(/(^|[^a-zA-Z0-9]+)(.)/g, (_, _2, c) => c.toUpperCase()) },
  { name: "snake_case", fn: (s: string) => s.toLowerCase().replace(/[^a-zA-Z0-9]+/g, "_").replace(/^_|_$/g, "") },
  { name: "kebab-case", fn: (s: string) => s.toLowerCase().replace(/[^a-zA-Z0-9]+/g, "-").replace(/^-|-$/g, "") },
  { name: "CONSTANT_CASE", fn: (s: string) => s.toUpperCase().replace(/[^A-Z0-9]+/g, "_").replace(/^_|_$/g, "") },
  { name: "dot.case", fn: (s: string) => s.toLowerCase().replace(/[^a-zA-Z0-9]+/g, ".").replace(/^\.|\.$/g, "") },
  { name: "aLtErNaTiNg", fn: (s: string) => s.split("").map((c, i) => i % 2 === 0 ? c.toLowerCase() : c.toUpperCase()).join("") },
];

export default function CaseConverter() {
  const [text, setText] = useState("Hello World Example Text");
  const copy = (t: string) => navigator.clipboard.writeText(t);

  return (
    <div className="space-y-6">
      <section className="text-center"><h1 className="text-4xl font-bold mb-2">Case Converter</h1><p className="text-[var(--text-secondary)]">Convert text to any case format</p></section>
      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-4">
        <textarea value={text} onChange={e => setText(e.target.value)} rows={3} className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg p-3 text-lg resize-none" placeholder="Type text here..." />
      </div>
      <div className="space-y-2">
        {conversions.map(c => {
          const result = c.fn(text);
          return (
            <div key={c.name} onClick={() => copy(result)} className="flex justify-between items-center bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl px-4 py-3 cursor-pointer hover:border-blue-500/50">
              <span className="text-sm font-bold w-32 shrink-0">{c.name}</span>
              <code className="font-mono text-sm flex-1 text-right truncate ml-2">{result}</code>
              <span className="text-xs text-blue-400 ml-3">Copy</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
