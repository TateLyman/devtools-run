"use client";
import { useState } from "react";

export default function JsonValidate() {
  const [input, setInput] = useState('{\n  "name": "John",\n  "age": 30,\n  "active": true\n}');

  let valid = false;
  let error = "";
  let parsed = null;
  let stats = { keys: 0, type: "", size: 0 };

  try {
    parsed = JSON.parse(input);
    valid = true;
    stats.type = Array.isArray(parsed) ? "Array" : typeof parsed;
    stats.keys = typeof parsed === "object" && parsed ? Object.keys(parsed).length : 0;
    stats.size = new Blob([input]).size;
  } catch (e) {
    error = (e as Error).message;
  }

  return (
    <div className="space-y-6">
      <section className="text-center">
        <h1 className="text-4xl font-bold mb-2">JSON Validator</h1>
        <p className="text-[var(--text-secondary)]">Check if your JSON is valid</p>
      </section>

      <div className={`rounded-xl p-4 text-center font-bold text-lg ${valid ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400" : input ? "bg-red-500/10 border border-red-500/30 text-red-400" : "bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-secondary)]"}`}>
        {valid ? "Valid JSON" : input ? "Invalid JSON" : "Paste JSON to validate"}
      </div>

      {valid && (
        <div className="flex gap-4 justify-center text-sm text-[var(--text-secondary)]">
          <span>Type: <strong className="text-white">{stats.type}</strong></span>
          <span>Keys: <strong className="text-white">{stats.keys}</strong></span>
          <span>Size: <strong className="text-white">{stats.size} bytes</strong></span>
        </div>
      )}

      {error && <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 text-red-400 text-sm font-mono">{error}</div>}

      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-4">
        <textarea value={input} onChange={e => setInput(e.target.value)} rows={14}
          className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg p-3 font-mono text-sm resize-none" placeholder="Paste JSON here..." />
      </div>

      <div className="flex gap-2 justify-center">
        <button onClick={() => { try { setInput(JSON.stringify(JSON.parse(input), null, 2)); } catch {} }} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-bold">Prettify</button>
        <button onClick={() => { try { setInput(JSON.stringify(JSON.parse(input))); } catch {} }} className="bg-[var(--bg-secondary)] border border-[var(--border)] px-4 py-2 rounded-lg text-sm font-bold">Minify</button>
        <button onClick={() => navigator.clipboard.writeText(input)} className="bg-[var(--bg-secondary)] border border-[var(--border)] px-4 py-2 rounded-lg text-sm font-bold">Copy</button>
      </div>
    </div>
  );
}
