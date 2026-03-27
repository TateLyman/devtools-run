"use client";
import { useState } from "react";
export default function HexViewer() {
  const [input, setInput] = useState("Hello, World! This is a hex dump.");
  const bytes = Array.from(new TextEncoder().encode(input));
  const lines: { offset: string; hex: string; ascii: string }[] = [];
  for (let i = 0; i < bytes.length; i += 16) {
    const chunk = bytes.slice(i, i + 16);
    lines.push({
      offset: i.toString(16).padStart(8, "0"),
      hex: chunk.map(b => b.toString(16).padStart(2, "0")).join(" ").padEnd(47, " "),
      ascii: chunk.map(b => b >= 32 && b < 127 ? String.fromCharCode(b) : ".").join(""),
    });
  }
  return (
    <div className="space-y-6">
      <section className="text-center"><h1 className="text-4xl font-bold mb-2">Hex Viewer</h1><p className="text-[var(--text-secondary)]">View text as hexadecimal dump</p></section>
      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-4"><textarea value={input} onChange={e => setInput(e.target.value)} rows={3} className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg p-3 text-sm resize-none" placeholder="Enter text..." /></div>
      <div className="bg-[var(--bg-primary)] border border-[var(--border)] rounded-xl p-4 overflow-x-auto">
        <pre className="font-mono text-xs"><span className="text-[var(--text-secondary)]">Offset   </span><span className="text-blue-400">Hex                                             </span><span className="text-emerald-400">ASCII</span>{"\n"}{lines.map(l => `${l.offset}  ${l.hex}  ${l.ascii}`).join("\n")}</pre>
      </div>
      <div className="text-center text-xs text-[var(--text-secondary)]">{bytes.length} bytes</div>
    </div>
  );
}
