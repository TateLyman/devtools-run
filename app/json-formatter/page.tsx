"use client";
import { useState } from "react";

export default function JsonFormatter() {
  const [input, setInput] = useState("");
  const [indent, setIndent] = useState(2);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  let output = "";
  if (input.trim()) {
    try {
      const parsed = JSON.parse(input);
      output = JSON.stringify(parsed, null, indent);
      if (error) setError("");
    } catch (e: any) {
      output = "";
      if (!error) setError(e.message);
    }
  }

  const minify = () => {
    try {
      setInput(JSON.stringify(JSON.parse(input)));
      setError("");
    } catch (e: any) {
      setError(e.message);
    }
  };

  const format = () => {
    try {
      setInput(JSON.stringify(JSON.parse(input), null, indent));
      setError("");
    } catch (e: any) {
      setError(e.message);
    }
  };

  const sortKeys = () => {
    try {
      const sorted = JSON.parse(input, (_, v) =>
        v && typeof v === "object" && !Array.isArray(v)
          ? Object.fromEntries(Object.entries(v).sort(([a], [b]) => a.localeCompare(b)))
          : v
      );
      setInput(JSON.stringify(sorted, null, indent));
      setError("");
    } catch (e: any) {
      setError(e.message);
    }
  };

  const stats = input.trim()
    ? (() => {
        try {
          const parsed = JSON.parse(input);
          const str = JSON.stringify(parsed);
          const keys = new Set<string>();
          const countKeys = (obj: any) => {
            if (typeof obj === "object" && obj !== null) {
              if (Array.isArray(obj)) obj.forEach(countKeys);
              else Object.keys(obj).forEach((k) => { keys.add(k); countKeys(obj[k]); });
            }
          };
          countKeys(parsed);
          return { size: str.length, keys: keys.size, depth: JSON.stringify(parsed, null, 1).split("\n").length };
        } catch {
          return null;
        }
      })()
    : null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">JSON Formatter & Validator</h1>
        <p className="text-[var(--text-secondary)]">
          Format, validate, minify, and sort JSON. Instant error detection with line numbers. Free online JSON beautifier.
        </p>
      </div>

      <div className="flex flex-wrap gap-2 items-center">
        <button onClick={format} className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded text-sm font-bold">Format</button>
        <button onClick={minify} className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 rounded text-sm">Minify</button>
        <button onClick={sortKeys} className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 rounded text-sm">Sort Keys</button>
        <select value={indent} onChange={(e) => setIndent(Number(e.target.value))} className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded px-2 py-2 text-white text-sm">
          <option value={2}>2 spaces</option>
          <option value={4}>4 spaces</option>
          <option value={1}>1 space</option>
        </select>
        <button onClick={() => { navigator.clipboard.writeText(output || input); setCopied(true); setTimeout(() => setCopied(false), 2000); }} className="text-sm text-purple-400 hover:text-purple-300 ml-auto">{copied ? "Copied!" : "Copy"}</button>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-red-400 text-sm font-mono">
          Error: {error}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="text-sm font-medium mb-1 block">Input</label>
          <textarea
            value={input}
            onChange={(e) => { setInput(e.target.value); setError(""); }}
            placeholder='{"key": "value"}'
            className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded px-3 py-2 text-white h-[500px] resize-none font-mono text-sm"
            spellCheck={false}
          />
        </div>
        <div>
          <label className="text-sm font-medium mb-1 block">Output</label>
          <pre className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded px-3 py-2 text-emerald-400 h-[500px] overflow-auto font-mono text-sm whitespace-pre-wrap">{output}</pre>
        </div>
      </div>

      {stats && (
        <div className="flex gap-6 text-sm text-[var(--text-secondary)]">
          <span>Size: {stats.size.toLocaleString()} chars</span>
          <span>Keys: {stats.keys}</span>
          <span>Lines: {stats.depth}</span>
          <span className="text-emerald-400 font-bold">Valid JSON</span>
        </div>
      )}
    </div>
  );
}
