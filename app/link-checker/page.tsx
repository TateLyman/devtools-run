"use client";
import { useState } from "react";
export default function LinkExtractor() {
  const [text, setText] = useState("Check out https://example.com and http://test.org/page?q=1 also visit www.github.com for code.");
  const urlRegex = /https?:\/\/[^\s<>"']+|www\.[^\s<>"']+/gi;
  const matches = text.match(urlRegex) || [];
  const unique = [...new Set(matches)];
  const copy = () => navigator.clipboard.writeText(unique.join("\n"));
  return (
    <div className="space-y-6">
      <section className="text-center"><h1 className="text-4xl font-bold mb-2">Link Extractor</h1><p className="text-[var(--text-secondary)]">Extract all URLs from text</p></section>
      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-4"><textarea value={text} onChange={e => setText(e.target.value)} rows={6} className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg p-3 text-sm resize-none" placeholder="Paste text with URLs..." /></div>
      <div className="flex justify-between items-center"><span className="text-sm text-[var(--text-secondary)]">{unique.length} unique URL{unique.length !== 1 ? "s" : ""} found ({matches.length} total)</span>{unique.length > 0 && <button onClick={copy} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded text-sm font-bold">Copy All</button>}</div>
      <div className="space-y-1">{unique.map((url, i) => (<div key={i} onClick={() => navigator.clipboard.writeText(url)} className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg px-3 py-2 font-mono text-sm cursor-pointer hover:border-blue-500/50 break-all">{url}</div>))}</div>
    </div>
  );
}
