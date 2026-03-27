"use client";
import { useState } from "react";
export default function JsonFormatOnline() {
  const [input, setInput] = useState('{"name":"John","age":30,"address":{"city":"NYC","zip":"10001"},"hobbies":["coding","gaming"]}');
  let output = "", error = "";
  try { output = JSON.stringify(JSON.parse(input), null, 2); } catch(e) { error = (e as Error).message; }
  return (
    <div className="space-y-6">
      <section className="text-center"><h1 className="text-4xl font-bold mb-2">JSON Formatter Online</h1><p className="text-[var(--text-secondary)]">Pretty print and validate JSON</p></section>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-4"><label className="text-sm font-bold block mb-2">Input</label><textarea value={input} onChange={e=>setInput(e.target.value)} rows={14} className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg p-3 font-mono text-xs resize-none" /></div>
        <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-4"><div className="flex justify-between mb-2"><label className="text-sm font-bold">{error ? "Error" : "Formatted"}</label>{!error && <button onClick={()=>navigator.clipboard.writeText(output)} className="text-xs text-blue-400">Copy</button>}</div><textarea value={error||output} readOnly rows={14} className={`w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg p-3 font-mono text-xs resize-none ${error?"text-red-400":"text-emerald-400"}`} /></div>
      </div>
    </div>
  );
}
