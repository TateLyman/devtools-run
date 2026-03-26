"use client";
import { useState } from "react";

function renderTree(obj: unknown, path: string, onClick: (p: string, v: string) => void, depth: number = 0): React.ReactNode {
  if (obj === null) return <span className="text-gray-500 cursor-pointer hover:bg-blue-900/20 px-1 rounded" onClick={() => onClick(path, "null")}>null</span>;
  if (typeof obj === "boolean") return <span className="text-yellow-400 cursor-pointer hover:bg-blue-900/20 px-1 rounded" onClick={() => onClick(path, String(obj))}>{String(obj)}</span>;
  if (typeof obj === "number") return <span className="text-emerald-400 cursor-pointer hover:bg-blue-900/20 px-1 rounded" onClick={() => onClick(path, String(obj))}>{obj}</span>;
  if (typeof obj === "string") return <span className="text-orange-400 cursor-pointer hover:bg-blue-900/20 px-1 rounded" onClick={() => onClick(path, obj)}>"{obj}"</span>;
  if (Array.isArray(obj)) {
    return (
      <div style={{ marginLeft: depth > 0 ? 16 : 0 }}>
        <span className="text-gray-500">[</span>
        {obj.map((item, i) => (
          <div key={i} style={{ marginLeft: 16 }}>
            <span className="text-gray-600 text-xs mr-1">{i}:</span>
            {renderTree(item, `${path}[${i}]`, onClick, depth + 1)}
            {i < obj.length - 1 && <span className="text-gray-500">,</span>}
          </div>
        ))}
        <span className="text-gray-500">]</span>
      </div>
    );
  }
  if (typeof obj === "object") {
    const entries = Object.entries(obj as Record<string, unknown>);
    return (
      <div style={{ marginLeft: depth > 0 ? 16 : 0 }}>
        <span className="text-gray-500">{"{"}</span>
        {entries.map(([key, val], i) => (
          <div key={key} style={{ marginLeft: 16 }}>
            <span className="text-blue-400 cursor-pointer hover:bg-blue-900/20 px-1 rounded" onClick={() => onClick(`${path}.${key}`, JSON.stringify(val))}>"{key}"</span>
            <span className="text-gray-500">: </span>
            {renderTree(val, `${path}.${key}`, onClick, depth + 1)}
            {i < entries.length - 1 && <span className="text-gray-500">,</span>}
          </div>
        ))}
        <span className="text-gray-500">{"}"}</span>
      </div>
    );
  }
  return null;
}

const SAMPLE = `{
  "user": {
    "name": "John Doe",
    "age": 30,
    "email": "john@example.com",
    "address": {
      "street": "123 Main St",
      "city": "NYC",
      "zip": "10001"
    },
    "hobbies": ["coding", "gaming", "reading"],
    "active": true
  }
}`;

export default function JsonPath() {
  const [input, setInput] = useState(SAMPLE);
  const [selectedPath, setSelectedPath] = useState("");
  const [selectedValue, setSelectedValue] = useState("");
  const [error, setError] = useState("");

  let parsed: unknown = null;
  try { parsed = JSON.parse(input); setError && error && setError(""); } catch (e) { if (!error) setError((e as Error).message); }

  const handleClick = (path: string, value: string) => {
    const cleanPath = path.startsWith("$.") ? path : "$" + path;
    setSelectedPath(cleanPath);
    setSelectedValue(value);
    navigator.clipboard.writeText(cleanPath);
  };

  return (
    <div className="space-y-6">
      <section className="text-center">
        <h1 className="text-4xl font-bold mb-2">JSON Path Finder</h1>
        <p className="text-[var(--text-secondary)]">Click any value to copy its JSONPath</p>
      </section>

      {selectedPath && (
        <div className="bg-blue-900/20 border border-blue-500/20 rounded-xl p-3 text-center">
          <div className="text-xs text-[var(--text-secondary)]">Copied path:</div>
          <code className="text-blue-400 font-mono">{selectedPath}</code>
          <div className="text-xs text-[var(--text-secondary)] mt-1">Value: {selectedValue.slice(0, 100)}</div>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-4">
          <label className="text-sm font-bold block mb-2">JSON Input</label>
          <textarea value={input} onChange={e => { setInput(e.target.value); setError(""); }} rows={16}
            className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg p-3 font-mono text-sm resize-none" />
          {error && <div className="text-red-400 text-xs mt-1">{error}</div>}
        </div>
        <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-4 overflow-auto" style={{ maxHeight: "500px" }}>
          <label className="text-sm font-bold block mb-2">Tree (click to copy path)</label>
          <div className="font-mono text-sm">
            {parsed !== null && renderTree(parsed, "$", handleClick)}
          </div>
        </div>
      </div>
    </div>
  );
}
