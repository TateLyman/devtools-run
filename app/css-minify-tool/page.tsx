"use client";
import { useState } from "react";
function minifyCSS(css: string): string {
  return css.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\s+/g, " ").replace(/\s*([{}:;,>~+])\s*/g, "$1").replace(/;}/g, "}").trim();
}
export default function CSSMinify() {
  const [input, setInput] = useState("body {\n  margin: 0;\n  padding: 0;\n  font-family: Arial, sans-serif;\n}\n\n/* Header styles */\n.header {\n  background-color: #333;\n  color: white;\n  padding: 20px;\n}\n\n.header h1 {\n  font-size: 24px;\n  margin: 0;\n}");
  const output = minifyCSS(input);
  const saved = input.length - output.length;
  return (
    <div className="space-y-6">
      <section className="text-center"><h1 className="text-4xl font-bold mb-2">CSS Minifier</h1></section>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-4"><label className="text-sm font-bold block mb-2">Input ({input.length} chars)</label><textarea value={input} onChange={e => setInput(e.target.value)} rows={10} className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg p-3 font-mono text-xs resize-none" /></div>
        <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-4"><div className="flex justify-between mb-2"><label className="text-sm font-bold">Minified ({output.length} chars)</label><button onClick={() => navigator.clipboard.writeText(output)} className="text-xs text-blue-400">Copy</button></div><textarea value={output} readOnly rows={10} className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg p-3 font-mono text-xs resize-none" /></div>
      </div>
      {saved > 0 && <div className="text-center text-sm text-emerald-400">Saved {saved} characters ({Math.round(saved/input.length*100)}% reduction)</div>}
    </div>
  );
}
