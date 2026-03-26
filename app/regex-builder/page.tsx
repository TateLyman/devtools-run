"use client";
import { useState } from "react";

const BLOCKS = [
  { label: "Any character", pattern: "." },
  { label: "Digit", pattern: "\\d" },
  { label: "Non-digit", pattern: "\\D" },
  { label: "Word char", pattern: "\\w" },
  { label: "Whitespace", pattern: "\\s" },
  { label: "Letter (a-z)", pattern: "[a-z]" },
  { label: "Letter (A-Z)", pattern: "[A-Z]" },
  { label: "Start of line", pattern: "^" },
  { label: "End of line", pattern: "$" },
  { label: "Word boundary", pattern: "\\b" },
  { label: "0 or more (*)", pattern: "*" },
  { label: "1 or more (+)", pattern: "+" },
  { label: "Optional (?)", pattern: "?" },
  { label: "Group ()", pattern: "()" },
  { label: "Or (|)", pattern: "|" },
  { label: "Literal @", pattern: "@" },
  { label: "Literal .", pattern: "\\." },
  { label: "Literal /", pattern: "\\/" },
];

export default function RegexBuilder() {
  const [pattern, setPattern] = useState("\\w+@\\w+\\.\\w+");
  const [flags, setFlags] = useState("gi");
  const [testText, setTestText] = useState("Contact us at hello@example.com or support@test.org for help.");
  const [matches, setMatches] = useState<string[]>([]);
  const [error, setError] = useState("");

  const test = () => {
    try {
      const re = new RegExp(pattern, flags);
      const found = testText.match(re) || [];
      setMatches(found);
      setError("");
    } catch (e) { setError((e as Error).message); setMatches([]); }
  };

  const addBlock = (p: string) => setPattern(prev => prev + p);

  return (
    <div className="space-y-6">
      <section className="text-center">
        <h1 className="text-4xl font-bold mb-2">Regex Builder</h1>
        <p className="text-[var(--text-secondary)]">Build and test regular expressions</p>
      </section>

      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-4">
        <label className="text-sm font-bold block mb-2">Pattern</label>
        <div className="flex gap-2">
          <span className="text-[var(--text-secondary)] py-2">/</span>
          <input value={pattern} onChange={e => setPattern(e.target.value)}
            className="flex-1 bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg px-3 py-2 font-mono text-lg text-blue-400" />
          <span className="text-[var(--text-secondary)] py-2">/</span>
          <input value={flags} onChange={e => setFlags(e.target.value)} className="w-16 bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg px-2 py-2 font-mono text-center" />
          <button onClick={test} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-bold">Test</button>
        </div>
        {error && <div className="text-red-400 text-sm mt-2">{error}</div>}
      </div>

      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-4">
        <label className="text-xs text-[var(--text-secondary)] mb-1 block">Quick Add</label>
        <div className="flex flex-wrap gap-1">
          {BLOCKS.map(b => (
            <button key={b.label} onClick={() => addBlock(b.pattern)}
              className="bg-[var(--bg-primary)] border border-[var(--border)] px-2 py-1 rounded text-xs font-mono hover:border-blue-500/50" title={b.pattern}>{b.label}</button>
          ))}
        </div>
      </div>

      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-4">
        <label className="text-sm font-bold block mb-2">Test Text</label>
        <textarea value={testText} onChange={e => setTestText(e.target.value)} rows={3}
          className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg p-3 font-mono text-sm resize-none" />
      </div>

      {matches.length > 0 && (
        <div className="bg-emerald-900/20 border border-emerald-500/20 rounded-xl p-4">
          <div className="text-sm font-bold text-emerald-400 mb-2">{matches.length} match{matches.length > 1 ? "es" : ""}</div>
          <div className="flex flex-wrap gap-2">
            {matches.map((m, i) => (
              <code key={i} className="bg-emerald-500/10 border border-emerald-500/30 rounded px-2 py-1 text-sm font-mono text-emerald-400">{m}</code>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-2 justify-center">
        <button onClick={() => setPattern("")} className="bg-[var(--bg-secondary)] border border-[var(--border)] px-4 py-2 rounded-lg text-sm">Clear Pattern</button>
        <button onClick={() => navigator.clipboard.writeText(`/${pattern}/${flags}`)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-bold">Copy Regex</button>
      </div>
    </div>
  );
}
