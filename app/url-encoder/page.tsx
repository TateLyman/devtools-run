"use client";
import { useState } from "react";

export default function URLEncoder() {
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [encodeType, setEncodeType] = useState<"component" | "full">("component");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  let output = "";
  if (input.trim()) {
    try {
      if (mode === "encode") {
        output = encodeType === "component" ? encodeURIComponent(input) : encodeURI(input);
      } else {
        output = encodeType === "component" ? decodeURIComponent(input) : decodeURI(input);
      }
      if (error) setError("");
    } catch {
      output = "";
      if (!error) setError("Invalid input for " + (mode === "decode" ? "decoding" : "encoding"));
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">URL Encoder / Decoder</h1>
        <p className="text-[var(--text-secondary)]">
          Encode and decode URLs and query parameters. Supports encodeURIComponent and encodeURI. Free online URL encoder.
        </p>
      </div>

      <div className="flex gap-2 items-center flex-wrap">
        <button onClick={() => { setMode("encode"); setError(""); }} className={`px-4 py-2 rounded text-sm font-bold ${mode === "encode" ? "bg-purple-600 text-white" : "bg-[var(--bg-secondary)] text-[var(--text-secondary)]"}`}>Encode</button>
        <button onClick={() => { setMode("decode"); setError(""); }} className={`px-4 py-2 rounded text-sm font-bold ${mode === "decode" ? "bg-purple-600 text-white" : "bg-[var(--bg-secondary)] text-[var(--text-secondary)]"}`}>Decode</button>
        <select value={encodeType} onChange={(e) => setEncodeType(e.target.value as any)} className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded px-2 py-2 text-white text-sm">
          <option value="component">encodeURIComponent (query params)</option>
          <option value="full">encodeURI (full URL)</option>
        </select>
      </div>

      {error && <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-2 text-red-400 text-sm">{error}</div>}

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="text-sm font-medium mb-1 block">Input</label>
          <textarea value={input} onChange={(e) => { setInput(e.target.value); setError(""); }} placeholder={mode === "encode" ? "Enter text or URL to encode..." : "Paste URL-encoded string to decode..."} className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded px-3 py-2 text-white h-48 resize-none font-mono text-sm" />
        </div>
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-sm font-medium">Output</label>
            {output && <button onClick={handleCopy} className="text-xs text-purple-400 hover:text-purple-300">{copied ? "Copied!" : "Copy"}</button>}
          </div>
          <textarea value={output} readOnly className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded px-3 py-2 text-emerald-400 h-48 resize-none font-mono text-sm" />
        </div>
      </div>
    </div>
  );
}
