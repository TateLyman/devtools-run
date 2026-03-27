"use client";
import { useState } from "react";
export default function MetaLength() {
  const [title, setTitle] = useState("My Awesome Page Title — Brand Name");
  const [desc, setDesc] = useState("This is a description of my page that should be between 120-160 characters for optimal SEO performance in search engine results pages.");
  const [url, setUrl] = useState("https://example.com/my-page");
  const titleOk = title.length >= 30 && title.length <= 60;
  const descOk = desc.length >= 120 && desc.length <= 160;
  return (
    <div className="space-y-6">
      <section className="text-center"><h1 className="text-4xl font-bold mb-2">Meta Tag Length Checker</h1><p className="text-[var(--text-secondary)]">Preview how your page looks in Google search results</p></section>
      <div className="bg-white rounded-xl p-6 max-w-2xl mx-auto">
        <div className="text-blue-700 text-xl hover:underline cursor-pointer" style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{title || "Page Title"}</div>
        <div className="text-green-700 text-sm">{url}</div>
        <div className="text-gray-600 text-sm mt-1" style={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{desc || "Meta description..."}</div>
      </div>
      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-6 space-y-4 max-w-2xl mx-auto">
        <div>
          <div className="flex justify-between mb-1"><label className="text-sm font-bold">Title Tag</label><span className={`text-xs font-bold ${titleOk ? "text-emerald-400" : "text-red-400"}`}>{title.length}/60 {titleOk ? "✓" : title.length < 30 ? "Too short" : "Too long"}</span></div>
          <input value={title} onChange={e => setTitle(e.target.value)} className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg px-3 py-2" />
          <div className="w-full bg-[var(--bg-primary)] rounded-full h-1.5 mt-1"><div className={`h-1.5 rounded-full ${titleOk ? "bg-emerald-500" : "bg-red-500"}`} style={{ width: `${Math.min(title.length / 60 * 100, 100)}%` }} /></div>
        </div>
        <div>
          <div className="flex justify-between mb-1"><label className="text-sm font-bold">Meta Description</label><span className={`text-xs font-bold ${descOk ? "text-emerald-400" : "text-red-400"}`}>{desc.length}/160 {descOk ? "✓" : desc.length < 120 ? "Too short" : "Too long"}</span></div>
          <textarea value={desc} onChange={e => setDesc(e.target.value)} rows={3} className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg px-3 py-2 resize-none" />
          <div className="w-full bg-[var(--bg-primary)] rounded-full h-1.5 mt-1"><div className={`h-1.5 rounded-full ${descOk ? "bg-emerald-500" : "bg-red-500"}`} style={{ width: `${Math.min(desc.length / 160 * 100, 100)}%` }} /></div>
        </div>
        <div><label className="text-sm font-bold block mb-1">URL</label><input value={url} onChange={e => setUrl(e.target.value)} className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg px-3 py-2 font-mono text-sm" /></div>
      </div>
      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-4 max-w-2xl mx-auto text-sm">
        <h2 className="font-bold mb-2">SEO Guidelines</h2>
        <div className="grid gap-2 md:grid-cols-2">
          <div className={`rounded-lg p-2 ${titleOk ? "bg-emerald-500/10" : "bg-red-500/10"}`}><strong>Title:</strong> 30-60 characters ideal</div>
          <div className={`rounded-lg p-2 ${descOk ? "bg-emerald-500/10" : "bg-red-500/10"}`}><strong>Description:</strong> 120-160 characters ideal</div>
        </div>
      </div>
    </div>
  );
}
