"use client";
import { useState } from "react";

export default function Base64Encoder() {
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  let output = "";
  if (input.trim()) {
    try {
      if (mode === "encode") {
        output = btoa(unescape(encodeURIComponent(input)));
      } else {
        output = decodeURIComponent(escape(atob(input.replace(/\s/g, ""))));
      }
      if (error) setError("");
    } catch (e) {
      output = "";
      if (!error) setError(mode === "decode" ? "Invalid Base64 string" : "Encoding error");
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const swap = () => {
    setInput(output);
    setMode(mode === "encode" ? "decode" : "encode");
    setError("");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Base64 Encoder / Decoder</h1>
        <p className="text-[var(--text-secondary)]">
          Encode and decode Base64 strings instantly. Supports UTF-8 text. Free online Base64 converter.
        </p>
      </div>

      <div className="flex gap-2 items-center">
        <button onClick={() => { setMode("encode"); setError(""); }} className={`px-4 py-2 rounded text-sm font-bold ${mode === "encode" ? "bg-purple-600 text-white" : "bg-[var(--bg-secondary)] text-[var(--text-secondary)]"}`}>Encode</button>
        <button onClick={() => { setMode("decode"); setError(""); }} className={`px-4 py-2 rounded text-sm font-bold ${mode === "decode" ? "bg-purple-600 text-white" : "bg-[var(--bg-secondary)] text-[var(--text-secondary)]"}`}>Decode</button>
        <button onClick={swap} className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 rounded text-sm">Swap</button>
      </div>

      {error && <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-2 text-red-400 text-sm">{error}</div>}

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="text-sm font-medium mb-1 block">{mode === "encode" ? "Text Input" : "Base64 Input"}</label>
          <textarea value={input} onChange={(e) => { setInput(e.target.value); setError(""); }} placeholder={mode === "encode" ? "Enter text to encode..." : "Paste Base64 to decode..."} className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded px-3 py-2 text-white h-64 resize-none font-mono text-sm" />
        </div>
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-sm font-medium">{mode === "encode" ? "Base64 Output" : "Decoded Text"}</label>
            {output && <button onClick={handleCopy} className="text-xs text-purple-400 hover:text-purple-300">{copied ? "Copied!" : "Copy"}</button>}
          </div>
          <textarea value={output} readOnly className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded px-3 py-2 text-emerald-400 h-64 resize-none font-mono text-sm" />
        </div>
      </div>

      <div className="flex gap-4 text-xs text-[var(--text-secondary)]">
        <span>Input: {input.length} chars</span>
        <span>Output: {output.length} chars</span>
        {mode === "encode" && output && <span>Size increase: +{Math.round((output.length / input.length - 1) * 100)}%</span>}
      </div>
    </div>
  );
}
