"use client";
import { useState } from "react";
function hexToRgb(hex: string): [number,number,number] { return [parseInt(hex.slice(1,3),16),parseInt(hex.slice(3,5),16),parseInt(hex.slice(5,7),16)]; }
function luminance(r: number, g: number, b: number): number { const [rs,gs,bs] = [r,g,b].map(c => { const s = c/255; return s <= 0.03928 ? s/12.92 : Math.pow((s+0.055)/1.055, 2.4); }); return 0.2126*rs + 0.7152*gs + 0.0722*bs; }
function contrast(hex1: string, hex2: string): number { const [r1,g1,b1] = hexToRgb(hex1); const [r2,g2,b2] = hexToRgb(hex2); const l1 = luminance(r1,g1,b1); const l2 = luminance(r2,g2,b2); return (Math.max(l1,l2)+0.05)/(Math.min(l1,l2)+0.05); }
function simulate(hex: string, type: string): string {
  let [r,g,b] = hexToRgb(hex);
  if (type === "protanopia") { const nr = 0.567*r+0.433*g; const ng = 0.558*r+0.442*g; const nb = 0.242*g+0.758*b; r=nr; g=ng; b=nb; }
  else if (type === "deuteranopia") { const nr = 0.625*r+0.375*g; const ng = 0.7*r+0.3*g; const nb = 0.3*g+0.7*b; r=nr; g=ng; b=nb; }
  else if (type === "tritanopia") { const nr = 0.95*r+0.05*g; const ng = 0.433*g+0.567*b; const nb = 0.475*g+0.525*b; r=nr; g=ng; b=nb; }
  return `rgb(${Math.round(Math.max(0,Math.min(255,r)))},${Math.round(Math.max(0,Math.min(255,g)))},${Math.round(Math.max(0,Math.min(255,b)))})`;
}
export default function ColorA11y() {
  const [fg, setFg] = useState("#000000");
  const [bg, setBg] = useState("#ffffff");
  const ratio = contrast(fg, bg);
  const aaLarge = ratio >= 3; const aaNormal = ratio >= 4.5; const aaaLarge = ratio >= 4.5; const aaaNormal = ratio >= 7;
  const types = [["Normal Vision","normal"],["Protanopia (Red-blind)","protanopia"],["Deuteranopia (Green-blind)","deuteranopia"],["Tritanopia (Blue-blind)","tritanopia"]];
  return (
    <div className="space-y-6">
      <section className="text-center"><h1 className="text-4xl font-bold mb-2">Color Accessibility</h1><p className="text-[var(--text-secondary)]">Contrast check + color blind simulation</p></section>
      <div className="flex justify-center gap-4 items-center flex-wrap">
        <div className="text-center"><label className="text-xs text-[var(--text-secondary)]">Text</label><div className="flex items-center gap-2"><input type="color" value={fg} onChange={e=>setFg(e.target.value)} className="w-12 h-12 rounded cursor-pointer" /><input value={fg} onChange={e=>setFg(e.target.value)} className="w-20 bg-[var(--bg-primary)] border border-[var(--border)] rounded px-2 py-1 font-mono text-xs" /></div></div>
        <div className="text-4xl font-bold" style={{color: ratio >= 4.5 ? "#22c55e" : ratio >= 3 ? "#eab308" : "#ef4444"}}>{ratio.toFixed(1)}:1</div>
        <div className="text-center"><label className="text-xs text-[var(--text-secondary)]">Background</label><div className="flex items-center gap-2"><input type="color" value={bg} onChange={e=>setBg(e.target.value)} className="w-12 h-12 rounded cursor-pointer" /><input value={bg} onChange={e=>setBg(e.target.value)} className="w-20 bg-[var(--bg-primary)] border border-[var(--border)] rounded px-2 py-1 font-mono text-xs" /></div></div>
      </div>
      <div className="grid gap-2 md:grid-cols-2">
        {[["AA Normal", aaNormal, "4.5:1"], ["AA Large", aaLarge, "3:1"], ["AAA Normal", aaaNormal, "7:1"], ["AAA Large", aaaLarge, "4.5:1"]].map(([label, pass, req]) => (
          <div key={label as string} className={`rounded-xl p-3 flex justify-between border ${pass ? "bg-emerald-500/10 border-emerald-500/30" : "bg-red-500/10 border-red-500/30"}`}><div><div className="font-bold text-sm">{label as string}</div><div className="text-xs text-[var(--text-secondary)]">Requires {req as string}</div></div><span className={`text-lg font-bold ${pass ? "text-emerald-400" : "text-red-400"}`}>{pass ? "PASS" : "FAIL"}</span></div>
        ))}
      </div>
      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-4">
        <h2 className="font-bold text-sm mb-3">Color Blind Simulation</h2>
        <div className="grid gap-3 md:grid-cols-2">
          {types.map(([label, type]) => (
            <div key={type} className="rounded-xl p-4" style={{ backgroundColor: type === "normal" ? bg : simulate(bg, type) }}>
              <div className="text-lg font-bold" style={{ color: type === "normal" ? fg : simulate(fg, type) }}>Sample Text</div>
              <div className="text-sm" style={{ color: type === "normal" ? fg : simulate(fg, type) }}>{label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
