"use client";
import { useState } from "react";
export default function WaveGen() {
  const [amplitude, setAmplitude] = useState(40);
  const [frequency, setFrequency] = useState(2);
  const [color, setColor] = useState("#3b82f6");
  const [height, setHeight] = useState(120);
  const [flip, setFlip] = useState(false);

  const points: string[] = [];
  const steps = 100;
  for (let i = 0; i <= steps; i++) {
    const x = (i / steps) * 1440;
    const y = height - amplitude + Math.sin((i / steps) * Math.PI * frequency * 2) * amplitude;
    points.push(`${x},${y}`);
  }
  points.push(`1440,${height}`, `0,${height}`);
  const path = `M0,${height - amplitude} ` + Array.from({length: steps + 1}, (_, i) => {
    const x = (i / steps) * 1440;
    const y = height - amplitude + Math.sin((i / steps) * Math.PI * frequency * 2) * amplitude;
    return `L${x},${y}`;
  }).join(" ") + ` L1440,${height} L0,${height} Z`;

  const svg = `<svg viewBox="0 0 1440 ${height}" xmlns="http://www.w3.org/2000/svg"${flip ? ' style="transform: rotate(180deg)"' : ''}>\n  <path d="${path}" fill="${color}" />\n</svg>`;

  return (
    <div className="space-y-6">
      <section className="text-center"><h1 className="text-4xl font-bold mb-2">SVG Wave Generator</h1><p className="text-[var(--text-secondary)]">Create section dividers for your website</p></section>
      <div className={`w-full ${flip ? "rotate-180" : ""}`}>
        <svg viewBox={`0 0 1440 ${height}`} xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path d={path} fill={color} />
        </svg>
      </div>
      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-6 grid gap-3 md:grid-cols-3">
        <div><label className="text-xs text-[var(--text-secondary)]">Amplitude: {amplitude}</label><input type="range" min={10} max={80} value={amplitude} onChange={e=>setAmplitude(Number(e.target.value))} className="w-full" /></div>
        <div><label className="text-xs text-[var(--text-secondary)]">Frequency: {frequency}</label><input type="range" min={1} max={6} step={0.5} value={frequency} onChange={e=>setFrequency(Number(e.target.value))} className="w-full" /></div>
        <div><label className="text-xs text-[var(--text-secondary)]">Height: {height}px</label><input type="range" min={60} max={200} value={height} onChange={e=>setHeight(Number(e.target.value))} className="w-full" /></div>
        <div className="flex items-center gap-2"><label className="text-xs text-[var(--text-secondary)]">Color</label><input type="color" value={color} onChange={e=>setColor(e.target.value)} className="w-full h-8 rounded cursor-pointer" /></div>
        <div><label className="text-xs"><input type="checkbox" checked={flip} onChange={e=>setFlip(e.target.checked)} className="mr-1" />Flip (top divider)</label></div>
      </div>
      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-4"><div className="flex justify-between mb-2"><label className="text-sm font-bold">SVG</label><button onClick={()=>navigator.clipboard.writeText(svg)} className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs font-bold">Copy SVG</button></div><pre className="font-mono text-xs text-emerald-400 whitespace-pre-wrap max-h-40 overflow-auto">{svg}</pre></div>
    </div>
  );
}
