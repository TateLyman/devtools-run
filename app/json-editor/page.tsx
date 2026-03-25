"use client";
import { useState } from "react";

export default function JsonEditor() {
  const [input, setInput] = useState('{\n  "name": "John",\n  "age": 30,\n  "active": true\n}');
  const [error, setError] = useState("");
  const [view, setView] = useState<"tree" | "raw">("tree");

  let parsed: any = null;
  try {
    parsed = JSON.parse(input);
    if (error) setError("");
  } catch (e: any) {
    if (!error) setError(e.message);
  }

  const renderTree = (data: any, path: string = "", depth: number = 0): JSX.Element => {
    const indent = depth * 16;

    if (data === null) return <span style={{ marginLeft: indent }} className="text-gray-500 font-mono text-sm">null</span>;
    if (typeof data === "boolean") return <span style={{ marginLeft: indent }} className="text-orange-400 font-mono text-sm">{data.toString()}</span>;
    if (typeof data === "number") return <span style={{ marginLeft: indent }} className="text-blue-400 font-mono text-sm">{data}</span>;
    if (typeof data === "string") return <span style={{ marginLeft: indent }} className="text-emerald-400 font-mono text-sm">"{data}"</span>;

    if (Array.isArray(data)) {
      return (
        <div style={{ marginLeft: indent }}>
          <span className="text-gray-400 text-xs">[{data.length} items]</span>
          {data.map((item, i) => (
            <div key={i} className="flex items-start gap-1 py-0.5">
              <span className="text-gray-500 font-mono text-xs w-6 text-right shrink-0">{i}</span>
              <span className="text-gray-600">:</span>
              {renderTree(item, `${path}[${i}]`, 0)}
            </div>
          ))}
        </div>
      );
    }

    if (typeof data === "object") {
      return (
        <div style={{ marginLeft: indent }}>
          <span className="text-gray-400 text-xs">{`{${Object.keys(data).length} keys}`}</span>
          {Object.entries(data).map(([key, value]) => (
            <div key={key} className="flex items-start gap-1 py-0.5">
              <span className="text-purple-400 font-mono text-sm">"{key}"</span>
              <span className="text-gray-600">:</span>
              {renderTree(value, `${path}.${key}`, 0)}
            </div>
          ))}
        </div>
      );
    }

    return <span className="text-white">{String(data)}</span>;
  };

  const format = () => {
    try { setInput(JSON.stringify(JSON.parse(input), null, 2)); setError(""); } catch (e: any) { setError(e.message); }
  };
  const minify = () => {
    try { setInput(JSON.stringify(JSON.parse(input))); setError(""); } catch (e: any) { setError(e.message); }
  };
  const sortKeys = () => {
    try {
      const sorted = JSON.parse(input, (_, v) =>
        v && typeof v === "object" && !Array.isArray(v)
          ? Object.fromEntries(Object.entries(v).sort(([a], [b]) => a.localeCompare(b)))
          : v
      );
      setInput(JSON.stringify(sorted, null, 2));
      setError("");
    } catch (e: any) { setError(e.message); }
  };

  const [copied, setCopied] = useState(false);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">JSON Editor</h1>
        <p className="text-[var(--text-secondary)]">
          Edit JSON with tree view, format, minify, sort keys, and validate. Free online JSON editor with live preview.
        </p>
      </div>

      <div className="flex flex-wrap gap-2 items-center">
        <button onClick={format} className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1.5 rounded text-sm font-bold">Format</button>
        <button onClick={minify} className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1.5 rounded text-sm">Minify</button>
        <button onClick={sortKeys} className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1.5 rounded text-sm">Sort Keys</button>
        <div className="flex gap-1 ml-auto">
          <button onClick={() => setView("tree")} className={`px-2 py-1 rounded text-xs ${view === "tree" ? "bg-purple-600 text-white" : "bg-[var(--bg-secondary)] text-gray-400"}`}>Tree</button>
          <button onClick={() => setView("raw")} className={`px-2 py-1 rounded text-xs ${view === "raw" ? "bg-purple-600 text-white" : "bg-[var(--bg-secondary)] text-gray-400"}`}>Raw</button>
        </div>
        <button onClick={() => { navigator.clipboard.writeText(input); setCopied(true); setTimeout(() => setCopied(false), 2000); }} className="text-xs text-purple-400">{copied ? "Copied!" : "Copy"}</button>
      </div>

      {error && <div className="bg-red-500/10 border border-red-500/30 rounded p-2 text-red-400 text-sm font-mono">{error}</div>}

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="text-sm font-medium mb-1 block">Editor</label>
          <textarea value={input} onChange={(e) => { setInput(e.target.value); setError(""); }} className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded px-3 py-2 text-white h-[500px] resize-none font-mono text-sm" spellCheck={false} />
        </div>
        <div>
          <label className="text-sm font-medium mb-1 block">{view === "tree" ? "Tree View" : "Formatted"}</label>
          <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded px-3 py-2 h-[500px] overflow-auto">
            {view === "tree" && parsed !== null ? (
              renderTree(parsed)
            ) : (
              <pre className="text-emerald-400 font-mono text-sm whitespace-pre-wrap">{parsed ? JSON.stringify(parsed, null, 2) : ""}</pre>
            )}
          </div>
        </div>
      </div>

      {parsed && (
        <div className="flex gap-4 text-xs text-[var(--text-secondary)]">
          <span>{input.length.toLocaleString()} chars</span>
          <span>{typeof parsed === "object" ? (Array.isArray(parsed) ? `${parsed.length} items` : `${Object.keys(parsed).length} keys`) : typeof parsed}</span>
          <span className="text-emerald-400 font-bold">Valid JSON</span>
        </div>
      )}
    </div>
  );
}
