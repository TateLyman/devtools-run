"use client";
import { useState } from "react";
export default function GlassCard() {
  const [blur, setBlur] = useState(10);
  const [opacity, setOpacity] = useState(0.25);
  const [radius, setRadius] = useState(16);
  const [border, setBorder] = useState(1);
  const [color, setColor] = useState("#ffffff");
  const [bgFrom, setBgFrom] = useState("#667eea");
  const [bgTo, setBgTo] = useState("#764ba2");

  const rgba = `rgba(${parseInt(color.slice(1,3),16)}, ${parseInt(color.slice(3,5),16)}, ${parseInt(color.slice(5,7),16)}, ${opacity})`;
  const css = `background: ${rgba};\nbackdrop-filter: blur(${blur}px);\n-webkit-backdrop-filter: blur(${blur}px);\nborder-radius: ${radius}px;\nborder: ${border}px solid rgba(255, 255, 255, 0.18);`;

  return (
    <div className="space-y-6">
      <section className="text-center"><h1 className="text-4xl font-bold mb-2">Glassmorphism Card</h1><p className="text-[var(--text-secondary)]">Create frosted glass effects</p></section>
      <div className="flex justify-center p-12 rounded-xl" style={{ background: `linear-gradient(135deg, ${bgFrom}, ${bgTo})` }}>
        <div className="w-72 h-48 flex items-center justify-center text-white font-bold text-lg" style={{ background: rgba, backdropFilter: `blur(${blur}px)`, WebkitBackdropFilter: `blur(${blur}px)`, borderRadius: `${radius}px`, border: `${border}px solid rgba(255,255,255,0.18)` }}>
          Glass Card
        </div>
      </div>
      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-6 grid gap-3 md:grid-cols-3">
        <div><label className="text-xs text-[var(--text-secondary)]">Blur: {blur}px</label><input type="range" min={0} max={30} value={blur} onChange={e=>setBlur(Number(e.target.value))} className="w-full" /></div>
        <div><label className="text-xs text-[var(--text-secondary)]">Opacity: {opacity}</label><input type="range" min={0} max={1} step={0.05} value={opacity} onChange={e=>setOpacity(Number(e.target.value))} className="w-full" /></div>
        <div><label className="text-xs text-[var(--text-secondary)]">Radius: {radius}px</label><input type="range" min={0} max={40} value={radius} onChange={e=>setRadius(Number(e.target.value))} className="w-full" /></div>
        <div><label className="text-xs text-[var(--text-secondary)]">Border: {border}px</label><input type="range" min={0} max={5} value={border} onChange={e=>setBorder(Number(e.target.value))} className="w-full" /></div>
        <div className="flex gap-2 items-center"><label className="text-xs text-[var(--text-secondary)]">BG</label><input type="color" value={bgFrom} onChange={e=>setBgFrom(e.target.value)} className="w-8 h-8 rounded cursor-pointer" /><input type="color" value={bgTo} onChange={e=>setBgTo(e.target.value)} className="w-8 h-8 rounded cursor-pointer" /></div>
        <div className="flex gap-2 items-center"><label className="text-xs text-[var(--text-secondary)]">Glass</label><input type="color" value={color} onChange={e=>setColor(e.target.value)} className="w-8 h-8 rounded cursor-pointer" /></div>
      </div>
      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-4"><div className="flex justify-between mb-2"><label className="text-sm font-bold">CSS</label><button onClick={()=>navigator.clipboard.writeText(css)} className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs font-bold">Copy</button></div><pre className="font-mono text-xs text-emerald-400 whitespace-pre">{css}</pre></div>
    </div>
  );
}
