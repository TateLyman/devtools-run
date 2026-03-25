"use client";
import { useState } from "react";

function hslToHex(h: number, s: number, l: number): string {
  l /= 100; s /= 100;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => { const k = (n + h / 30) % 12; return Math.round(255 * (l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1))); };
  return `#${[f(0), f(8), f(4)].map(x => x.toString(16).padStart(2, "0")).join("")}`;
}

export default function PalettePage() {
  const [hue, setHue] = useState(260);
  const shades = [95, 85, 75, 60, 50, 40, 30, 20, 10, 5].map(l => hslToHex(hue, 70, l));
  const complements = [hue, (hue+30)%360, (hue+60)%360, (hue+180)%360, (hue+210)%360].map(h => hslToHex(h, 70, 50));

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-3xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-extrabold mb-2 text-center">Color Palette Generator</h1>
        <p className="text-gray-400 text-center mb-8">Generate harmonious color palettes from a base hue.</p>
        <div className="mb-6">
          <label className="text-xs text-gray-400 block mb-1">Base Hue: {hue}°</label>
          <input type="range" min="0" max="360" value={hue} onChange={e=>setHue(parseInt(e.target.value))} className="w-full" />
        </div>
        <div className="mb-6">
          <div className="text-xs text-gray-400 mb-2">Shades (click to copy hex)</div>
          <div className="flex rounded-xl overflow-hidden">
            {shades.map((c,i)=><button key={i} onClick={()=>navigator.clipboard.writeText(c)} className="flex-1 h-16 relative group" style={{backgroundColor:c}}>
              <span className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/60 text-[10px] font-mono">{c}</span>
            </button>)}
          </div>
        </div>
        <div className="mb-6">
          <div className="text-xs text-gray-400 mb-2">Complementary Colors</div>
          <div className="flex gap-2">
            {complements.map((c,i)=><button key={i} onClick={()=>navigator.clipboard.writeText(c)} className="flex-1 h-16 rounded-lg relative group" style={{backgroundColor:c}}>
              <span className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/60 text-xs font-mono rounded-lg">{c}</span>
            </button>)}
          </div>
        </div>
        <div className="text-center text-gray-500 text-sm">
          <a href="/color" className="text-purple-400 hover:underline">Color Picker</a>{" | "}
          <a href="/tailwind-colors" className="text-purple-400 hover:underline">Tailwind</a>{" | "}
          <a href="/gradient" className="text-purple-400 hover:underline">Gradients</a>{" | "}
          <a href="/hex-rgb" className="text-purple-400 hover:underline">Hex/RGB</a>
        </div>
      </div>
    </div>
  );
}
