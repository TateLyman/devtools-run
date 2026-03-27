"use client";
import { useState } from "react";
function hexToHsl(hex: string): [number,number,number] {
  let r=parseInt(hex.slice(1,3),16)/255, g=parseInt(hex.slice(3,5),16)/255, b=parseInt(hex.slice(5,7),16)/255;
  const max=Math.max(r,g,b), min=Math.min(r,g,b), l=(max+min)/2;
  if(max===min) return [0,0,l*100];
  const d=max-min, s=l>0.5?d/(2-max-min):d/(max+min);
  let h=0;
  if(max===r)h=((g-b)/d+(g<b?6:0))/6; else if(max===g)h=((b-r)/d+2)/6; else h=((r-g)/d+4)/6;
  return [h*360, s*100, l*100];
}
function hslToHex(h: number,s: number,l: number): string {
  s/=100; l/=100;
  const a=s*Math.min(l,1-l);
  const f=(n: number)=>{const k=(n+h/30)%12; return l-a*Math.max(Math.min(k-3,9-k,1),-1);};
  return "#"+[f(0),f(8),f(4)].map(v=>Math.round(v*255).toString(16).padStart(2,"0")).join("");
}
export default function PaletteGen() {
  const [base, setBase] = useState("#3b82f6");
  const [h,s] = hexToHsl(base);
  const shades = [
    {name:"50",l:97},{name:"100",l:94},{name:"200",l:86},{name:"300",l:76},
    {name:"400",l:64},{name:"500",l:50},{name:"600",l:42},{name:"700",l:35},
    {name:"800",l:27},{name:"900",l:20},{name:"950",l:12},
  ].map(shade => ({...shade, hex: hslToHex(h, s, shade.l)}));
  const [copied, setCopied] = useState("");
  const copy = (hex: string, name: string) => { navigator.clipboard.writeText(hex); setCopied(`${name}: ${hex}`); setTimeout(()=>setCopied(""),800); };
  const cssVars = shades.map(s => `  --color-${s.name}: ${s.hex};`).join("\n");
  return (
    <div className="space-y-6">
      <section className="text-center"><h1 className="text-4xl font-bold mb-2">Color Palette Generator</h1><p className="text-[var(--text-secondary)]">Generate a full shade scale from one color {copied && <span className="text-emerald-400">{copied}</span>}</p></section>
      <div className="flex justify-center gap-4 items-center"><input type="color" value={base} onChange={e=>setBase(e.target.value)} className="w-16 h-16 rounded-xl cursor-pointer" /><input value={base} onChange={e=>setBase(e.target.value)} className="w-28 bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg px-3 py-2 font-mono text-lg" /></div>
      <div className="flex gap-1 rounded-xl overflow-hidden h-20">
        {shades.map(s => (<button key={s.name} onClick={()=>copy(s.hex,s.name)} className="flex-1 hover:scale-y-110 transition-transform" style={{backgroundColor:s.hex}} title={`${s.name}: ${s.hex}`} />))}
      </div>
      <div className="grid grid-cols-11 gap-1">
        {shades.map(s => (
          <button key={s.name} onClick={()=>copy(s.hex,s.name)} className="text-center">
            <div className="h-12 rounded" style={{backgroundColor:s.hex}} />
            <div className="text-xs font-bold mt-1">{s.name}</div>
            <div className="text-xs text-[var(--text-secondary)] font-mono">{s.hex}</div>
          </button>
        ))}
      </div>
      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-4"><div className="flex justify-between mb-2"><label className="text-sm font-bold">CSS Variables</label><button onClick={()=>navigator.clipboard.writeText(`:root {\n${cssVars}\n}`)} className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs font-bold">Copy</button></div><pre className="font-mono text-xs text-emerald-400 whitespace-pre">{`:root {\n${cssVars}\n}`}</pre></div>
    </div>
  );
}
