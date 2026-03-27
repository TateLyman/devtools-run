"use client";
import { useState } from "react";
export default function BoxModel() {
  const [m, setM] = useState(20);
  const [b, setB] = useState(3);
  const [p, setP] = useState(20);
  const [w, setW] = useState(200);
  const [h, setH] = useState(100);
  const [bc, setBc] = useState("#3b82f6");
  const totalW = w + p * 2 + b * 2 + m * 2;
  const totalH = h + p * 2 + b * 2 + m * 2;
  const css = `width: ${w}px;\nheight: ${h}px;\nmargin: ${m}px;\npadding: ${p}px;\nborder: ${b}px solid ${bc};`;
  return (
    <div className="space-y-6">
      <section className="text-center"><h1 className="text-4xl font-bold mb-2">CSS Box Model</h1><p className="text-[var(--text-secondary)]">Interactive visualizer — total size: {totalW} x {totalH}px</p></section>
      <div className="flex justify-center">
        <div className="bg-orange-500/20 border-2 border-dashed border-orange-400 flex items-center justify-center relative" style={{ padding: m }}>
          <span className="absolute top-1 left-1/2 -translate-x-1/2 text-xs text-orange-400">margin: {m}px</span>
          <div className="flex items-center justify-center relative" style={{ border: `${b}px solid ${bc}`, padding: p }}>
            <span className="absolute top-0 left-1/2 -translate-x-1/2 text-xs text-blue-400 -mt-4">border: {b}px</span>
            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 text-xs text-emerald-400 -mb-4">padding: {p}px</span>
            <div className="bg-[var(--bg-secondary)] flex items-center justify-center text-xs font-mono" style={{ width: w, height: h }}>
              {w} x {h}
            </div>
          </div>
        </div>
      </div>
      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-6 grid gap-3 md:grid-cols-3">
        <div><label className="text-xs text-orange-400">Margin: {m}px</label><input type="range" min={0} max={60} value={m} onChange={e => setM(Number(e.target.value))} className="w-full" /></div>
        <div><label className="text-xs text-blue-400">Border: {b}px</label><input type="range" min={0} max={20} value={b} onChange={e => setB(Number(e.target.value))} className="w-full" /></div>
        <div><label className="text-xs text-emerald-400">Padding: {p}px</label><input type="range" min={0} max={60} value={p} onChange={e => setP(Number(e.target.value))} className="w-full" /></div>
        <div><label className="text-xs text-[var(--text-secondary)]">Width: {w}px</label><input type="range" min={50} max={400} value={w} onChange={e => setW(Number(e.target.value))} className="w-full" /></div>
        <div><label className="text-xs text-[var(--text-secondary)]">Height: {h}px</label><input type="range" min={50} max={300} value={h} onChange={e => setH(Number(e.target.value))} className="w-full" /></div>
        <div><label className="text-xs text-[var(--text-secondary)]">Border Color</label><input type="color" value={bc} onChange={e => setBc(e.target.value)} className="w-full h-8 rounded cursor-pointer" /></div>
      </div>
      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-4"><div className="flex justify-between mb-2"><label className="text-sm font-bold">CSS</label><button onClick={() => navigator.clipboard.writeText(css)} className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs font-bold">Copy</button></div><pre className="font-mono text-xs text-emerald-400 whitespace-pre">{css}</pre></div>
    </div>
  );
}
