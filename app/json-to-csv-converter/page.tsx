"use client";
import { useState } from "react";

function flatten(obj: Record<string, unknown>, prefix = ""): Record<string, string> {
  const result: Record<string, string> = {};
  for (const [key, val] of Object.entries(obj)) {
    const newKey = prefix ? `${prefix}.${key}` : key;
    if (val && typeof val === "object" && !Array.isArray(val)) {
      Object.assign(result, flatten(val as Record<string, unknown>, newKey));
    } else {
      result[newKey] = String(val ?? "");
    }
  }
  return result;
}

function jsonToCsv(json: unknown[]): string {
  if (!json.length) return "";
  const flat = json.map(row => flatten(row as Record<string, unknown>));
  const headers = [...new Set(flat.flatMap(r => Object.keys(r)))];
  const escape = (v: string) => v.includes(",") || v.includes('"') || v.includes("\n") ? `"${v.replace(/"/g, '""')}"` : v;
  const lines = [headers.join(","), ...flat.map(row => headers.map(h => escape(row[h] || "")).join(","))];
  return lines.join("\n");
}

const SAMPLE = `[
  { "name": "Alice", "age": 30, "city": "NYC" },
  { "name": "Bob", "age": 25, "city": "LA" },
  { "name": "Charlie", "age": 35, "city": "Chicago" }
]`;

export default function JsonToCsvConverter() {
  const [input, setInput] = useState(SAMPLE);
  const [csv, setCsv] = useState("");
  const [error, setError] = useState("");

  const convert = () => {
    try {
      const parsed = JSON.parse(input);
      if (!Array.isArray(parsed)) { setError("Input must be a JSON array"); setCsv(""); return; }
      setCsv(jsonToCsv(parsed));
      setError("");
    } catch (e) { setError("Invalid JSON: " + (e as Error).message); setCsv(""); }
  };

  const download = () => {
    const blob = new Blob([csv], { type: "text/csv" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "data.csv"; a.click();
  };

  const copy = () => navigator.clipboard.writeText(csv);

  return (
    <div className="space-y-6">
      <section className="text-center">
        <h1 className="text-4xl font-bold mb-2">JSON to CSV Converter</h1>
        <p className="text-[var(--text-secondary)]">Convert JSON arrays to CSV format</p>
      </section>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-4">
          <div className="flex justify-between mb-2">
            <label className="text-sm font-bold">JSON Input</label>
            <button onClick={() => setInput(SAMPLE)} className="text-xs text-blue-400">Load Sample</button>
          </div>
          <textarea value={input} onChange={e => setInput(e.target.value)} rows={12}
            className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg p-3 font-mono text-sm resize-none" placeholder="Paste JSON array here..." />
        </div>
        <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-4">
          <div className="flex justify-between mb-2">
            <label className="text-sm font-bold">CSV Output</label>
            {csv && <div className="flex gap-2">
              <button onClick={copy} className="text-xs text-blue-400">Copy</button>
              <button onClick={download} className="text-xs text-emerald-400">Download</button>
            </div>}
          </div>
          <textarea value={csv} readOnly rows={12}
            className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg p-3 font-mono text-sm resize-none" placeholder="CSV output will appear here..." />
        </div>
      </div>

      {error && <div className="text-red-400 text-sm text-center">{error}</div>}

      <div className="flex justify-center">
        <button onClick={convert} className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-bold">Convert to CSV</button>
      </div>
    </div>
  );
}
