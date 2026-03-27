"use client";
import { useState } from "react";
function beautifyHtml(html: string): string {
  let indent = 0; const tab = "  ";
  return html.replace(/>\s*</g, ">\n<").split("\n").map(line => {
    line = line.trim(); if (!line) return "";
    if (line.match(/^<\/(div|section|main|header|footer|nav|ul|ol|li|table|tr|td|th|thead|tbody|form|article|aside|details|figure|fieldset|select|body|html|head)/i)) indent = Math.max(0, indent - 1);
    const result = tab.repeat(indent) + line;
    if (line.match(/^<(div|section|main|header|footer|nav|ul|ol|li|table|tr|td|th|thead|tbody|form|article|aside|details|figure|fieldset|select|body|html|head)[^/]*>$/i) && !line.match(/\/>/)) indent++;
    return result;
  }).filter(Boolean).join("\n");
}
export default function HtmlBeautify() {
  const [input, setInput] = useState('<div><h1>Hello</h1><p>World</p><ul><li>Item 1</li><li>Item 2</li></ul></div>');
  const output = beautifyHtml(input);
  return (
    <div className="space-y-6">
      <section className="text-center"><h1 className="text-4xl font-bold mb-2">HTML Beautifier</h1></section>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-4"><label className="text-sm font-bold block mb-2">Messy HTML</label><textarea value={input} onChange={e=>setInput(e.target.value)} rows={12} className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg p-3 font-mono text-xs resize-none" /></div>
        <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-4"><div className="flex justify-between mb-2"><label className="text-sm font-bold">Formatted</label><button onClick={()=>navigator.clipboard.writeText(output)} className="text-xs text-blue-400">Copy</button></div><textarea value={output} readOnly rows={12} className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg p-3 font-mono text-xs resize-none text-emerald-400" /></div>
      </div>
    </div>
  );
}
