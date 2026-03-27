"use client";
import { useState } from "react";
const RATIOS = [
  { name: "1:1 (Square)", w: 1, h: 1 },
  { name: "4:3 (Classic)", w: 4, h: 3 },
  { name: "3:2 (Photo)", w: 3, h: 2 },
  { name: "16:9 (Widescreen)", w: 16, h: 9 },
  { name: "21:9 (Ultra-wide)", w: 21, h: 9 },
  { name: "9:16 (Portrait/Story)", w: 9, h: 16 },
  { name: "2:3 (Portrait Photo)", w: 2, h: 3 },
  { name: "3:4 (Portrait Classic)", w: 3, h: 4 },
];
export default function AspectRatioCSS() {
  const [w, setW] = useState(16);
  const [h, setH] = useState(9);
  const [maxW, setMaxW] = useState(400);
  const css = `aspect-ratio: ${w} / ${h};\nmax-width: ${maxW}px;\nwidth: 100%;`;
  return (
    <div className="space-y-6">
      <section className="text-center"><h1 className="text-4xl font-bold mb-2">CSS Aspect Ratio</h1><p className="text-[var(--text-secondary)]">Generate aspect-ratio CSS values</p></section>
      <div className="flex justify-center p-8">
        <div className="bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-white font-bold" style={{ aspectRatio: `${w}/${h}`, maxWidth: maxW, width: "100%" }}>{w}:{h}</div>
      </div>
      <div className="flex flex-wrap gap-2 justify-center">
        {RATIOS.map(r => (<button key={r.name} onClick={() => { setW(r.w); setH(r.h); }} className={`px-3 py-1 rounded text-xs ${w===r.w && h===r.h ? "bg-blue-600 text-white" : "bg-[var(--bg-secondary)] border border-[var(--border)]"}`}>{r.name}</button>))}
      </div>
      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-4 grid gap-3 md:grid-cols-3">
        <div><label className="text-xs text-[var(--text-secondary)]">Width Ratio: {w}</label><input type="range" min={1} max={21} value={w} onChange={e=>setW(Number(e.target.value))} className="w-full" /></div>
        <div><label className="text-xs text-[var(--text-secondary)]">Height Ratio: {h}</label><input type="range" min={1} max={21} value={h} onChange={e=>setH(Number(e.target.value))} className="w-full" /></div>
        <div><label className="text-xs text-[var(--text-secondary)]">Max Width: {maxW}px</label><input type="range" min={100} max={800} value={maxW} onChange={e=>setMaxW(Number(e.target.value))} className="w-full" /></div>
      </div>
      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-4"><div className="flex justify-between mb-2"><label className="text-sm font-bold">CSS</label><button onClick={()=>navigator.clipboard.writeText(css)} className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs font-bold">Copy</button></div><pre className="font-mono text-xs text-emerald-400 whitespace-pre">{css}</pre></div>
    </div>
  );
}
