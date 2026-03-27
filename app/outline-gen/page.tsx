"use client";
import { useState } from "react";
export default function OutlineGen() {
  const [width, setWidth] = useState(3);
  const [style, setStyle] = useState("solid");
  const [color, setColor] = useState("#3b82f6");
  const [offset, setOffset] = useState(2);
  const [radius, setRadius] = useState(8);
  const css = `outline: ${width}px ${style} ${color};\noutline-offset: ${offset}px;\nborder-radius: ${radius}px;`;
  return (
    <div className="space-y-6">
      <section className="text-center"><h1 className="text-4xl font-bold mb-2">CSS Outline Generator</h1><p className="text-[var(--text-secondary)]">Create focus rings and outlines visually</p></section>
      <div className="flex justify-center p-12">
        <button className="bg-[var(--bg-secondary)] px-8 py-4 text-lg font-bold" style={{ outline: `${width}px ${style} ${color}`, outlineOffset: `${offset}px`, borderRadius: `${radius}px` }}>Focus Element</button>
      </div>
      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-6 grid gap-3 md:grid-cols-3">
        <div><label className="text-xs text-[var(--text-secondary)]">Width: {width}px</label><input type="range" min={1} max={10} value={width} onChange={e=>setWidth(Number(e.target.value))} className="w-full" /></div>
        <div><label className="text-xs text-[var(--text-secondary)]">Style</label><select value={style} onChange={e=>setStyle(e.target.value)} className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded px-2 py-1 text-sm">{["solid","dashed","dotted","double","groove","ridge"].map(s=><option key={s}>{s}</option>)}</select></div>
        <div className="flex items-center gap-2"><label className="text-xs text-[var(--text-secondary)]">Color</label><input type="color" value={color} onChange={e=>setColor(e.target.value)} className="w-full h-8 rounded cursor-pointer" /></div>
        <div><label className="text-xs text-[var(--text-secondary)]">Offset: {offset}px</label><input type="range" min={-5} max={20} value={offset} onChange={e=>setOffset(Number(e.target.value))} className="w-full" /></div>
        <div><label className="text-xs text-[var(--text-secondary)]">Radius: {radius}px</label><input type="range" min={0} max={50} value={radius} onChange={e=>setRadius(Number(e.target.value))} className="w-full" /></div>
      </div>
      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-4"><div className="flex justify-between mb-2"><label className="text-sm font-bold">CSS</label><button onClick={()=>navigator.clipboard.writeText(css)} className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs font-bold">Copy</button></div><pre className="font-mono text-xs text-emerald-400 whitespace-pre">{css}</pre></div>
    </div>
  );
}
