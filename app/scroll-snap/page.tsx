"use client";
import { useState } from "react";
export default function ScrollSnap() {
  const [dir, setDir] = useState<"x"|"y">("x");
  const [type, setType] = useState("mandatory");
  const [align, setAlign] = useState("start");
  const [gap, setGap] = useState(16);
  const [items] = useState(8);
  const colors = ["#3b82f6","#ef4444","#22c55e","#f97316","#8b5cf6","#ec4899","#06b6d4","#eab308"];

  const containerCss = `display: flex;\nflex-direction: ${dir === "x" ? "row" : "column"};\noverflow-${dir}: auto;\nscroll-snap-type: ${dir} ${type};\ngap: ${gap}px;\npadding: ${gap}px;`;
  const itemCss = `scroll-snap-align: ${align};\nflex-shrink: 0;`;

  return (
    <div className="space-y-6">
      <section className="text-center"><h1 className="text-4xl font-bold mb-2">CSS Scroll Snap</h1><p className="text-[var(--text-secondary)]">Create snapping scroll effects</p></section>
      <div className={`bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl overflow-auto flex ${dir === "y" ? "flex-col h-64" : "flex-row"}`}
        style={{ scrollSnapType: `${dir} ${type}`, gap: `${gap}px`, padding: `${gap}px` }}>
        {Array.from({length: items}, (_, i) => (
          <div key={i} className={`${dir === "x" ? "min-w-[200px] h-40" : "min-h-[150px] w-full"} rounded-xl flex items-center justify-center text-white text-2xl font-bold shrink-0`}
            style={{ scrollSnapAlign: align, backgroundColor: colors[i % colors.length] }}>{i + 1}</div>
        ))}
      </div>
      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-4 grid gap-3 md:grid-cols-4">
        <div><label className="text-xs text-[var(--text-secondary)]">Direction</label><div className="flex gap-1">{(["x","y"] as const).map(d => <button key={d} onClick={()=>setDir(d)} className={`flex-1 px-2 py-1 rounded text-sm ${dir===d?"bg-blue-600 text-white":"bg-[var(--bg-primary)] border border-[var(--border)]"}`}>{d === "x" ? "Horizontal" : "Vertical"}</button>)}</div></div>
        <div><label className="text-xs text-[var(--text-secondary)]">Snap Type</label><select value={type} onChange={e=>setType(e.target.value)} className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded px-2 py-1 text-sm">{["mandatory","proximity"].map(t=><option key={t}>{t}</option>)}</select></div>
        <div><label className="text-xs text-[var(--text-secondary)]">Align</label><select value={align} onChange={e=>setAlign(e.target.value)} className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded px-2 py-1 text-sm">{["start","center","end"].map(a=><option key={a}>{a}</option>)}</select></div>
        <div><label className="text-xs text-[var(--text-secondary)]">Gap: {gap}px</label><input type="range" min={0} max={32} value={gap} onChange={e=>setGap(Number(e.target.value))} className="w-full" /></div>
      </div>
      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-4"><div className="flex justify-between mb-2"><label className="text-sm font-bold">CSS</label><button onClick={()=>navigator.clipboard.writeText(containerCss+"\n\n/* Items */\n"+itemCss)} className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs font-bold">Copy</button></div><pre className="font-mono text-xs text-emerald-400 whitespace-pre">{"/* Container */\n"+containerCss+"\n\n/* Items */\n"+itemCss}</pre></div>
    </div>
  );
}
