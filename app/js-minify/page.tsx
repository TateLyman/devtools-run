"use client";
import { useState } from "react";
function minifyJs(js: string): string {
  return js.replace(/\/\/.*$/gm, "").replace(/\/\*[\s\S]*?\*\//g, "").replace(/\n\s*\n/g, "\n").replace(/\s{2,}/g, " ").replace(/\s*([{};,=+\-*/<>!&|?:])\s*/g, "$1").trim();
}
export default function JsMinify() {
  const [input, setInput] = useState('// Hello World function\nfunction greet(name) {\n  // Log greeting\n  console.log("Hello, " + name + "!");\n  return true;\n}\n\n/* Multi-line\n   comment */\nconst result = greet("World");');
  const output = minifyJs(input);
  const saved = input.length - output.length;
  return (
    <div className="space-y-6">
      <section className="text-center"><h1 className="text-4xl font-bold mb-2">JavaScript Minifier</h1></section>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-4"><label className="text-sm font-bold block mb-2">Input ({input.length} chars)</label><textarea value={input} onChange={e=>setInput(e.target.value)} rows={10} className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg p-3 font-mono text-xs resize-none" /></div>
        <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-4"><div className="flex justify-between mb-2"><label className="text-sm font-bold">Minified ({output.length} chars)</label><button onClick={()=>navigator.clipboard.writeText(output)} className="text-xs text-blue-400">Copy</button></div><textarea value={output} readOnly rows={10} className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg p-3 font-mono text-xs resize-none text-emerald-400" /></div>
      </div>
      {saved > 0 && <div className="text-center text-sm text-emerald-400">Saved {saved} chars ({Math.round(saved/input.length*100)}%)</div>}
    </div>
  );
}
