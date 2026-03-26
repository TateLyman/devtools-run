"use client";
import { useState } from "react";

export default function JsonPretty() {
  const [input, setInput] = useState('{"name":"John","age":30,"address":{"city":"NYC","zip":"10001"},"hobbies":["coding","gaming"]}');
  const [indent, setIndent] = useState(2);
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

  const prettify = () => {
    try { setOutput(JSON.stringify(JSON.parse(input), null, indent)); setError(""); }
    catch (e) { setError((e as Error).message); setOutput(""); }
  };

  const minify = () => {
    try { setOutput(JSON.stringify(JSON.parse(input))); setError(""); }
    catch (e) { setError((e as Error).message); setOutput(""); }
  };

  const copy = () => navigator.clipboard.writeText(output);
  const swap = () => { if (output) { setInput(output); setOutput(""); } };

  const parsed = (() => { try { const p = JSON.parse(input); return { valid: true, type: Array.isArray(p) ? "array" : typeof p, keys: typeof p === "object" && p ? Object.keys(p).length : 0, size: new Blob([input]).size }; } catch { return null; } })();

  return (
    <div className="space-y-6">
      <section className="text-center">
        <h1 className="text-4xl font-bold mb-2">JSON Prettifier & Minifier</h1>
        <p className="text-[var(--text-secondary)]">Format or compress JSON instantly</p>
      </section>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-4">
          <div className="flex justify-between mb-2">
            <label className="text-sm font-bold">Input</label>
            {parsed && <span className="text-xs text-emerald-400">Valid {parsed.type} ({parsed.keys} keys, {parsed.size}B)</span>}
            {!parsed && input && <span className="text-xs text-red-400">Invalid JSON</span>}
          </div>
          <textarea value={input} onChange={e => setInput(e.target.value)} rows={12}
            className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg p-3 font-mono text-sm resize-none" />
        </div>
        <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-4">
          <div className="flex justify-between mb-2">
            <label className="text-sm font-bold">Output</label>
            {output && <div className="flex gap-2">
              <button onClick={copy} className="text-xs text-blue-400">Copy</button>
              <button onClick={swap} className="text-xs text-emerald-400">Use as Input</button>
            </div>}
          </div>
          <textarea value={output} readOnly rows={12}
            className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg p-3 font-mono text-sm resize-none" />
        </div>
      </div>

      {error && <div className="text-red-400 text-sm text-center">{error}</div>}

      <div className="flex justify-center gap-3 items-center">
        <button onClick={prettify} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-bold">Prettify</button>
        <button onClick={minify} className="bg-[var(--bg-secondary)] border border-[var(--border)] hover:bg-[var(--bg-primary)] px-6 py-2 rounded-lg font-bold">Minify</button>
        <select value={indent} onChange={e => setIndent(Number(e.target.value))} className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded px-2 py-2 text-sm">
          <option value={2}>2 spaces</option>
          <option value={4}>4 spaces</option>
          <option value={1}>1 space</option>
        </select>
      </div>
    </div>
  );
}
