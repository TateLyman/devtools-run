"use client";
import { useState } from "react";
function hexToRgb(h: string): [number,number,number] { return [parseInt(h.slice(1,3),16),parseInt(h.slice(3,5),16),parseInt(h.slice(5,7),16)]; }
function rgbToHex(r: number,g: number,b: number): string { return "#"+[r,g,b].map(v=>Math.round(v).toString(16).padStart(2,"0")).join(""); }
export default function ColorBlend() {
  const [c1, setC1] = useState("#3b82f6");
  const [c2, setC2] = useState("#ef4444");
  const [steps, setSteps] = useState(7);
  const [r1,g1,b1] = hexToRgb(c1);
  const [r2,g2,b2] = hexToRgb(c2);
  const colors = Array.from({length: steps}, (_,i) => {
    const t = i / (steps - 1);
    return rgbToHex(r1+(r2-r1)*t, g1+(g2-g1)*t, b1+(b2-b1)*t);
  });
  return (
    <div className="space-y-6">
      <section className="text-center"><h1 className="text-4xl font-bold mb-2">Color Blender</h1></section>
      <div className="flex justify-center gap-4 items-center"><input type="color" value={c1} onChange={e=>setC1(e.target.value)} className="w-16 h-16 rounded-lg cursor-pointer" /><span className="text-2xl">→</span><input type="color" value={c2} onChange={e=>setC2(e.target.value)} className="w-16 h-16 rounded-lg cursor-pointer" /></div>
      <div className="text-center"><label className="text-sm text-[var(--text-secondary)]">Steps: {steps}</label><input type="range" min={3} max={15} value={steps} onChange={e=>setSteps(Number(e.target.value))} className="w-48 ml-2" /></div>
      <div className="flex gap-1 rounded-xl overflow-hidden h-20">{colors.map((c,i) => (<button key={i} onClick={() => navigator.clipboard.writeText(c)} className="flex-1 hover:scale-y-110 transition-transform" style={{backgroundColor:c}} title={c} />))}</div>
      <div className="flex flex-wrap gap-2 justify-center">{colors.map((c,i) => (<div key={i} onClick={() => navigator.clipboard.writeText(c)} className="flex items-center gap-1 bg-[var(--bg-secondary)] rounded px-2 py-1 cursor-pointer hover:scale-105 transition-transform text-xs font-mono"><div className="w-4 h-4 rounded" style={{backgroundColor:c}} />{c}</div>))}</div>
    </div>
  );
}
