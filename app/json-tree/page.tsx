"use client";
import { useState } from "react";

function JsonNode({ data, path, depth }: { data: unknown; path: string; depth: number }) {
  const [open, setOpen] = useState(depth < 2);
  const copy = (p: string) => navigator.clipboard.writeText(p);

  if (data === null) return <span className="text-gray-500 cursor-pointer hover:underline" onClick={() => copy(path)}>null</span>;
  if (typeof data === "boolean") return <span className="text-yellow-400 cursor-pointer hover:underline" onClick={() => copy(path)}>{String(data)}</span>;
  if (typeof data === "number") return <span className="text-emerald-400 cursor-pointer hover:underline" onClick={() => copy(path)}>{data}</span>;
  if (typeof data === "string") return <span className="text-orange-400 cursor-pointer hover:underline" onClick={() => copy(path)}>&quot;{data.length > 100 ? data.slice(0, 100) + "..." : data}&quot;</span>;

  if (Array.isArray(data)) {
    return (
      <div style={{ marginLeft: depth > 0 ? 16 : 0 }}>
        <span className="cursor-pointer text-gray-400 hover:text-white select-none" onClick={() => setOpen(!open)}>{open ? "▼" : "▶"} [{data.length}]</span>
        {open && data.map((item, i) => (
          <div key={i} className="flex gap-1 items-start"><span className="text-gray-600 text-xs shrink-0">{i}:</span><JsonNode data={item} path={`${path}[${i}]`} depth={depth + 1} /></div>
        ))}
      </div>
    );
  }

  if (typeof data === "object") {
    const entries = Object.entries(data as Record<string, unknown>);
    return (
      <div style={{ marginLeft: depth > 0 ? 16 : 0 }}>
        <span className="cursor-pointer text-gray-400 hover:text-white select-none" onClick={() => setOpen(!open)}>{open ? "▼" : "▶"} {"{" + entries.length + "}"}</span>
        {open && entries.map(([key, val]) => (
          <div key={key} className="flex gap-1 items-start">
            <span className="text-blue-400 cursor-pointer hover:underline shrink-0" onClick={() => copy(`${path}.${key}`)}>"{key}":</span>
            <JsonNode data={val} path={`${path}.${key}`} depth={depth + 1} />
          </div>
        ))}
      </div>
    );
  }
  return null;
}

const SAMPLE = '{"user":{"name":"John Doe","age":30,"email":"john@example.com","address":{"street":"123 Main St","city":"New York","zip":"10001"},"hobbies":["coding","gaming","reading"],"active":true,"score":null}}';

export default function JsonTree() {
  const [input, setInput] = useState(SAMPLE);
  let parsed: unknown = null;
  let error = "";
  try { parsed = JSON.parse(input); } catch (e) { error = (e as Error).message; }

  return (
    <div className="space-y-4">
      <section className="text-center"><h1 className="text-4xl font-bold mb-1">JSON Tree Viewer</h1><p className="text-sm text-[var(--text-secondary)]">Click any key/value to copy its path</p></section>
      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-4">
        <textarea value={input} onChange={e => setInput(e.target.value)} rows={4} className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg p-3 font-mono text-xs resize-none" placeholder="Paste JSON..." />
      </div>
      {error && <div className="text-red-400 text-sm text-center">{error}</div>}
      {parsed !== null && (
        <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-4 font-mono text-sm overflow-auto max-h-[500px]">
          <JsonNode data={parsed} path="$" depth={0} />
        </div>
      )}
    </div>
  );
}
