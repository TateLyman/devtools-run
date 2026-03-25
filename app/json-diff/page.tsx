"use client";
import { useState } from "react";

interface DiffResult { path: string; type: "added" | "removed" | "changed"; oldVal?: any; newVal?: any; }

function diffJSON(a: any, b: any, path: string = ""): DiffResult[] {
  const diffs: DiffResult[] = [];
  if (typeof a !== typeof b) {
    diffs.push({ path: path || "(root)", type: "changed", oldVal: a, newVal: b });
    return diffs;
  }
  if (Array.isArray(a) && Array.isArray(b)) {
    const maxLen = Math.max(a.length, b.length);
    for (let i = 0; i < maxLen; i++) {
      if (i >= a.length) diffs.push({ path: `${path}[${i}]`, type: "added", newVal: b[i] });
      else if (i >= b.length) diffs.push({ path: `${path}[${i}]`, type: "removed", oldVal: a[i] });
      else diffs.push(...diffJSON(a[i], b[i], `${path}[${i}]`));
    }
    return diffs;
  }
  if (typeof a === "object" && a !== null && b !== null) {
    const allKeys = new Set([...Object.keys(a), ...Object.keys(b)]);
    for (const key of allKeys) {
      const newPath = path ? `${path}.${key}` : key;
      if (!(key in a)) diffs.push({ path: newPath, type: "added", newVal: b[key] });
      else if (!(key in b)) diffs.push({ path: newPath, type: "removed", oldVal: a[key] });
      else diffs.push(...diffJSON(a[key], b[key], newPath));
    }
    return diffs;
  }
  if (a !== b) diffs.push({ path: path || "(root)", type: "changed", oldVal: a, newVal: b });
  return diffs;
}

export default function JSONDiff() {
  const [left, setLeft] = useState('{\n  "name": "John",\n  "age": 30,\n  "city": "NYC"\n}');
  const [right, setRight] = useState('{\n  "name": "John",\n  "age": 31,\n  "city": "LA",\n  "email": "john@example.com"\n}');
  const [error, setError] = useState("");

  let diffs: DiffResult[] = [];
  try {
    if (left.trim() && right.trim()) {
      diffs = diffJSON(JSON.parse(left), JSON.parse(right));
    }
    if (error) setError("");
  } catch (e: any) {
    if (!error) setError("Invalid JSON: " + e.message);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">JSON Diff</h1>
        <p className="text-[var(--text-secondary)]">Compare two JSON objects and see exactly what changed. Highlights additions, removals, and modifications.</p>
      </div>
      {error && <div className="bg-red-500/10 border border-red-500/30 rounded p-2 text-red-400 text-sm">{error}</div>}
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="text-sm font-medium mb-1 block">Original</label>
          <textarea value={left} onChange={(e) => { setLeft(e.target.value); setError(""); }} className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded px-3 py-2 text-white h-48 resize-none font-mono text-sm" spellCheck={false} />
        </div>
        <div>
          <label className="text-sm font-medium mb-1 block">Modified</label>
          <textarea value={right} onChange={(e) => { setRight(e.target.value); setError(""); }} className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded px-3 py-2 text-white h-48 resize-none font-mono text-sm" spellCheck={false} />
        </div>
      </div>
      {diffs.length > 0 ? (
        <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-4">
          <div className="flex gap-3 text-xs mb-3">
            <span className="text-emerald-400">{diffs.filter(d => d.type === "added").length} added</span>
            <span className="text-red-400">{diffs.filter(d => d.type === "removed").length} removed</span>
            <span className="text-yellow-400">{diffs.filter(d => d.type === "changed").length} changed</span>
          </div>
          <div className="space-y-1 max-h-64 overflow-auto">
            {diffs.map((d, i) => (
              <div key={i} className={`text-xs font-mono p-1.5 rounded ${d.type === "added" ? "bg-emerald-500/10 text-emerald-400" : d.type === "removed" ? "bg-red-500/10 text-red-400" : "bg-yellow-500/10 text-yellow-400"}`}>
                <span className="font-bold">{d.type === "added" ? "+" : d.type === "removed" ? "-" : "~"}</span>{" "}
                <span className="text-white">{d.path}</span>
                {d.type === "changed" && <span>: {JSON.stringify(d.oldVal)} → {JSON.stringify(d.newVal)}</span>}
                {d.type === "added" && <span>: {JSON.stringify(d.newVal)}</span>}
                {d.type === "removed" && <span>: {JSON.stringify(d.oldVal)}</span>}
              </div>
            ))}
          </div>
        </div>
      ) : left.trim() && right.trim() && !error ? (
        <div className="text-center text-emerald-400 font-bold">JSON objects are identical</div>
      ) : null}
    </div>
  );
}
