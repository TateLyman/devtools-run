"use client";
import { useState } from "react";
export default function BinaryText() {
  const [text, setText] = useState("Hello World");
  const [binary, setBinary] = useState("");
  const [mode, setMode] = useState<"encode"|"decode">("encode");
  const textToBin = (t: string) => t.split("").map(c => c.charCodeAt(0).toString(2).padStart(8, "0")).join(" ");
  const binToText = (b: string) => b.trim().split(/\s+/).map(bin => String.fromCharCode(parseInt(bin, 2))).join("");
  const output = mode === "encode" ? textToBin(text) : binToText(binary);
  return (
    <div className="space-y-6">
      <section className="text-center"><h1 className="text-4xl font-bold mb-2">Binary ↔ Text</h1><p className="text-[var(--text-secondary)]">Convert between binary and text</p></section>
      <div className="flex justify-center gap-2"><button onClick={() => setMode("encode")} className={`px-4 py-2 rounded-lg text-sm font-bold ${mode === "encode" ? "bg-blue-600 text-white" : "bg-[var(--bg-secondary)] border border-[var(--border)]"}`}>Text → Binary</button><button onClick={() => setMode("decode")} className={`px-4 py-2 rounded-lg text-sm font-bold ${mode === "decode" ? "bg-blue-600 text-white" : "bg-[var(--bg-secondary)] border border-[var(--border)]"}`}>Binary → Text</button></div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-4"><label className="text-sm font-bold block mb-2">{mode === "encode" ? "Text" : "Binary"}</label><textarea value={mode === "encode" ? text : binary} onChange={e => mode === "encode" ? setText(e.target.value) : setBinary(e.target.value)} rows={6} className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg p-3 font-mono text-sm resize-none" /></div>
        <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-4"><div className="flex justify-between mb-2"><label className="text-sm font-bold">{mode === "encode" ? "Binary" : "Text"}</label><button onClick={() => navigator.clipboard.writeText(output)} className="text-xs text-blue-400">Copy</button></div><textarea value={output} readOnly rows={6} className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg p-3 font-mono text-sm resize-none" /></div>
      </div>
    </div>
  );
}
