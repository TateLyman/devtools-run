"use client";
import { useState } from "react";
export default function WhitespaceClean() {
  const [input, setInput] = useState("  Hello   World  \n\n\nThis   has   extra   spaces  \n  and trailing spaces   \n\n");
  const [opts, setOpts] = useState({ trimLines: true, collapseSpaces: true, removeBlank: true, trimAll: true });
  let output = input;
  if (opts.trimLines) output = output.split("\n").map(l => l.trim()).join("\n");
  if (opts.collapseSpaces) output = output.replace(/ {2,}/g, " ");
  if (opts.removeBlank) output = output.replace(/\n{3,}/g, "\n\n");
  if (opts.trimAll) output = output.trim();
  return (
    <div className="space-y-6">
      <section className="text-center"><h1 className="text-4xl font-bold mb-2">Whitespace Remover</h1></section>
      <div className="flex flex-wrap gap-3 justify-center">{Object.entries({ trimLines: "Trim lines", collapseSpaces: "Collapse spaces", removeBlank: "Remove blank lines", trimAll: "Trim start/end" }).map(([k, l]) => (<label key={k} className="text-sm"><input type="checkbox" checked={opts[k as keyof typeof opts]} onChange={e => setOpts({ ...opts, [k]: e.target.checked })} className="mr-1" />{l}</label>))}</div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-4"><label className="text-sm font-bold block mb-2">Input ({input.length} chars)</label><textarea value={input} onChange={e => setInput(e.target.value)} rows={8} className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg p-3 font-mono text-sm resize-none" /></div>
        <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-4"><div className="flex justify-between mb-2"><label className="text-sm font-bold">Output ({output.length} chars)</label><button onClick={() => navigator.clipboard.writeText(output)} className="text-xs text-blue-400">Copy</button></div><textarea value={output} readOnly rows={8} className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg p-3 font-mono text-sm resize-none" /></div>
      </div>
      <div className="text-center text-sm text-emerald-400">{input.length - output.length} characters removed</div>
    </div>
  );
}
