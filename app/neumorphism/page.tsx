"use client";
import { useState } from "react";
function hexToRgb(hex: string): [number,number,number] { return [parseInt(hex.slice(1,3),16), parseInt(hex.slice(3,5),16), parseInt(hex.slice(5,7),16)]; }
function adjustBrightness(hex: string, pct: number): string {
  const [r,g,b] = hexToRgb(hex);
  const adjust = (v: number) => Math.max(0, Math.min(255, Math.round(v * (1 + pct/100))));
  return `rgb(${adjust(r)}, ${adjust(g)}, ${adjust(b)})`;
}
export default function Neumorphism() {
  const [bg, setBg] = useState("#e0e5ec");
  const [size, setSize] = useState(200);
  const [radius, setRadius] = useState(24);
  const [distance, setDistance] = useState(10);
  const [intensity, setIntensity] = useState(15);
  const [blur, setBlur] = useState(20);
  const [shape, setShape] = useState<"flat"|"concave"|"convex">("flat");
  const [inset, setInset] = useState(false);

  const light = adjustBrightness(bg, intensity);
  const dark = adjustBrightness(bg, -intensity);
  const shadow = `${inset ? "inset " : ""}${distance}px ${distance}px ${blur}px ${dark}, ${inset ? "inset " : ""}-${distance}px -${distance}px ${blur}px ${light}`;
  const bgGrad = shape === "concave" ? `linear-gradient(145deg, ${adjustBrightness(bg, -5)}, ${adjustBrightness(bg, 5)})` : shape === "convex" ? `linear-gradient(145deg, ${adjustBrightness(bg, 5)}, ${adjustBrightness(bg, -5)})` : bg;
  const css = `background: ${shape === "flat" ? bg : bgGrad};\nborder-radius: ${radius}px;\nbox-shadow: ${shadow};`;

  return (
    <div className="space-y-6">
      <section className="text-center"><h1 className="text-4xl font-bold mb-2">Neumorphism Generator</h1><p className="text-[var(--text-secondary)]">Create soft UI shadow effects</p></section>
      <div className="flex justify-center p-16 rounded-xl" style={{ backgroundColor: bg }}>
        <div className="flex items-center justify-center text-lg font-bold" style={{ width: size, height: size, borderRadius: radius, boxShadow: shadow, background: shape === "flat" ? bg : bgGrad, color: adjustBrightness(bg, -40) }}>Soft UI</div>
      </div>
      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-6 grid gap-3 md:grid-cols-3">
        <div><label className="text-xs text-[var(--text-secondary)]">Background</label><input type="color" value={bg} onChange={e=>setBg(e.target.value)} className="w-full h-8 rounded cursor-pointer" /></div>
        <div><label className="text-xs text-[var(--text-secondary)]">Size: {size}px</label><input type="range" min={80} max={300} value={size} onChange={e=>setSize(Number(e.target.value))} className="w-full" /></div>
        <div><label className="text-xs text-[var(--text-secondary)]">Radius: {radius}px</label><input type="range" min={0} max={100} value={radius} onChange={e=>setRadius(Number(e.target.value))} className="w-full" /></div>
        <div><label className="text-xs text-[var(--text-secondary)]">Distance: {distance}px</label><input type="range" min={1} max={30} value={distance} onChange={e=>setDistance(Number(e.target.value))} className="w-full" /></div>
        <div><label className="text-xs text-[var(--text-secondary)]">Intensity: {intensity}%</label><input type="range" min={5} max={40} value={intensity} onChange={e=>setIntensity(Number(e.target.value))} className="w-full" /></div>
        <div><label className="text-xs text-[var(--text-secondary)]">Blur: {blur}px</label><input type="range" min={5} max={50} value={blur} onChange={e=>setBlur(Number(e.target.value))} className="w-full" /></div>
      </div>
      <div className="flex justify-center gap-2">
        {(["flat","concave","convex"] as const).map(s => (<button key={s} onClick={()=>setShape(s)} className={`px-3 py-1 rounded text-sm capitalize ${shape===s?"bg-blue-600 text-white":"bg-[var(--bg-secondary)] border border-[var(--border)]"}`}>{s}</button>))}
        <button onClick={()=>setInset(!inset)} className={`px-3 py-1 rounded text-sm ${inset?"bg-blue-600 text-white":"bg-[var(--bg-secondary)] border border-[var(--border)]"}`}>Inset</button>
      </div>
      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-4"><div className="flex justify-between mb-2"><label className="text-sm font-bold">CSS</label><button onClick={()=>navigator.clipboard.writeText(css)} className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs font-bold">Copy</button></div><pre className="font-mono text-xs text-emerald-400 whitespace-pre">{css}</pre></div>
    </div>
  );
}
