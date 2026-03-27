"use client";
import { useState } from "react";
const SHAPES: Record<string, (h: number) => string> = {
  "Triangle": (h) => `M0,${h} L720,0 L1440,${h} Z`,
  "Curve": (h) => `M0,${h} Q720,${-h*0.5} 1440,${h} Z`,
  "Zigzag": (h) => `M0,${h} L180,${h*0.3} L360,${h} L540,${h*0.3} L720,${h} L900,${h*0.3} L1080,${h} L1260,${h*0.3} L1440,${h} Z`,
  "Tilt": (h) => `M0,${h} L1440,0 L1440,${h} Z`,
  "Arrow": (h) => `M0,${h} L720,0 L1440,${h} L1440,${h} L720,${h*0.6} L0,${h} Z`,
  "Split": (h) => `M0,${h} L720,0 L720,${h} L1440,0 L1440,${h} Z`,
  "Rounded": (h) => `M0,${h} C360,${-h*0.3} 1080,${-h*0.3} 1440,${h} Z`,
  "Waves": (h) => `M0,${h} C240,${h*0.3} 480,${h} 720,${h*0.5} C960,0 1200,${h*0.3} 1440,${h} Z`,
};
export default function ShapeDivider() {
  const [shape, setShape] = useState("Triangle");
  const [height, setHeight] = useState(80);
  const [color, setColor] = useState("#3b82f6");
  const [flip, setFlip] = useState(false);
  const [invert, setInvert] = useState(false);
  const path = SHAPES[shape](height);
  const svg = `<svg viewBox="0 0 1440 ${height}" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none"${flip ? ' style="transform:rotate(180deg)"' : ''}${invert ? ' style="transform:scaleX(-1)"' : ''}>\n  <path d="${path}" fill="${color}" />\n</svg>`;
  return (
    <div className="space-y-6">
      <section className="text-center"><h1 className="text-4xl font-bold mb-2">Shape Divider</h1><p className="text-[var(--text-secondary)]">Section dividers for your website</p></section>
      <div className={`w-full ${flip?"rotate-180":""} ${invert?"scale-x-[-1]":""}`}><svg viewBox={`0 0 1440 ${height}`} preserveAspectRatio="none" className="w-full" style={{height}}><path d={path} fill={color} /></svg></div>
      <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
        {Object.keys(SHAPES).map(s => (<button key={s} onClick={()=>setShape(s)} className={`px-2 py-1 rounded text-xs ${shape===s?"bg-blue-600 text-white":"bg-[var(--bg-secondary)] border border-[var(--border)]"}`}>{s}</button>))}
      </div>
      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-4 grid gap-3 md:grid-cols-4">
        <div><label className="text-xs text-[var(--text-secondary)]">Height: {height}px</label><input type="range" min={30} max={200} value={height} onChange={e=>setHeight(Number(e.target.value))} className="w-full" /></div>
        <div><label className="text-xs text-[var(--text-secondary)]">Color</label><input type="color" value={color} onChange={e=>setColor(e.target.value)} className="w-full h-8 rounded cursor-pointer" /></div>
        <label className="text-xs flex items-center"><input type="checkbox" checked={flip} onChange={e=>setFlip(e.target.checked)} className="mr-1" />Flip vertical</label>
        <label className="text-xs flex items-center"><input type="checkbox" checked={invert} onChange={e=>setInvert(e.target.checked)} className="mr-1" />Mirror horizontal</label>
      </div>
      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-4"><div className="flex justify-between mb-2"><label className="text-sm font-bold">SVG</label><button onClick={()=>navigator.clipboard.writeText(svg)} className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs font-bold">Copy</button></div><pre className="font-mono text-xs text-emerald-400 whitespace-pre-wrap max-h-32 overflow-auto">{svg}</pre></div>
    </div>
  );
}
