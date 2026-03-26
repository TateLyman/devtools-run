"use client";
import { useState } from "react";
export default function UrlEncodeDecode() {
  const [input, setInput] = useState("Hello World! How are you? price=$100&name=John Doe");
  const [mode, setMode] = useState<"encode"|"decode">("encode");
  let output = "";
  try { output = mode === "encode" ? encodeURIComponent(input) : decodeURIComponent(input); } catch { output = "Error: Invalid input"; }
  return (
    <div className="space-y-6">
      <section className="text-center"><h1 className="text-4xl font-bold mb-2">URL Encoder/Decoder</h1><p className="text-[var(--text-secondary)]">Encode or decode URL strings</p></section>
      <div className="flex justify-center gap-2">
        <button onClick={() => setMode("encode")} className={`px-4 py-2 rounded-lg text-sm font-bold ${mode === "encode" ? "bg-blue-600 text-white" : "bg-[var(--bg-secondary)] border border-[var(--border)]"}`}>Encode</button>
        <button onClick={() => setMode("decode")} className={`px-4 py-2 rounded-lg text-sm font-bold ${mode === "decode" ? "bg-blue-600 text-white" : "bg-[var(--bg-secondary)] border border-[var(--border)]"}`}>Decode</button>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-4"><label className="text-sm font-bold block mb-2">Input</label><textarea value={input} onChange={e => setInput(e.target.value)} rows={6} className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg p-3 font-mono text-sm resize-none" /></div>
        <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-4"><div className="flex justify-between mb-2"><label className="text-sm font-bold">Output</label><button onClick={() => navigator.clipboard.writeText(output)} className="text-xs text-blue-400">Copy</button></div><textarea value={output} readOnly rows={6} className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg p-3 font-mono text-sm resize-none" /></div>
      </div>
    </div>
  );
}
