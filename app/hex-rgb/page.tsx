"use client";
import { useState } from "react";

export default function HexRgbPage() {
  const [hex, setHex] = useState("#6c5ce7");
  
  const r = parseInt(hex.slice(1,3), 16) || 0;
  const g = parseInt(hex.slice(3,5), 16) || 0;
  const b = parseInt(hex.slice(5,7), 16) || 0;
  const rgb = `rgb(${r}, ${g}, ${b})`;
  const hsl = (() => {
    const rr=r/255, gg=g/255, bb=b/255;
    const max=Math.max(rr,gg,bb), min=Math.min(rr,gg,bb);
    let h=0, s=0, l=(max+min)/2;
    if(max!==min){
      const d=max-min;
      s=l>0.5?d/(2-max-min):d/(max+min);
      if(max===rr) h=((gg-bb)/d+(gg<bb?6:0))/6;
      else if(max===gg) h=((bb-rr)/d+2)/6;
      else h=((rr-gg)/d+4)/6;
    }
    return `hsl(${Math.round(h*360)}, ${Math.round(s*100)}%, ${Math.round(l*100)}%)`;
  })();

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-3xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-extrabold mb-2 text-center">Hex to RGB Converter</h1>
        <p className="text-gray-400 text-center mb-8">Convert between HEX, RGB, and HSL color formats.</p>
        <div className="flex justify-center mb-6">
          <div className="w-32 h-32 rounded-xl border border-gray-700" style={{backgroundColor: hex}} />
        </div>
        <div className="bg-gray-900 rounded-xl p-6 mb-6 space-y-3">
          <div className="flex items-center gap-3">
            <input type="color" value={hex} onChange={e=>setHex(e.target.value)} className="w-12 h-12 rounded cursor-pointer" />
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2"><span className="text-xs text-gray-400 w-10">HEX</span><input type="text" value={hex} onChange={e=>setHex(e.target.value)} className="flex-1 bg-gray-800 border border-gray-700 rounded px-3 py-1 text-sm font-mono" /></div>
              <div className="flex items-center gap-2"><span className="text-xs text-gray-400 w-10">RGB</span><div className="flex-1 bg-gray-800 border border-gray-700 rounded px-3 py-1 text-sm font-mono cursor-pointer" onClick={()=>navigator.clipboard.writeText(rgb)}>{rgb}</div></div>
              <div className="flex items-center gap-2"><span className="text-xs text-gray-400 w-10">HSL</span><div className="flex-1 bg-gray-800 border border-gray-700 rounded px-3 py-1 text-sm font-mono cursor-pointer" onClick={()=>navigator.clipboard.writeText(hsl)}>{hsl}</div></div>
            </div>
          </div>
          <div className="text-xs text-gray-500 text-center">Click any value to copy</div>
        </div>
        <div className="text-center text-gray-500 text-sm">
          <a href="/color" className="text-purple-400 hover:underline">Color Picker</a>{" | "}
          <a href="/tailwind-colors" className="text-purple-400 hover:underline">Tailwind</a>{" | "}
          <a href="/gradient" className="text-purple-400 hover:underline">Gradients</a>{" | "}
          <a href="/css-minify" className="text-purple-400 hover:underline">CSS Minify</a>{" | "}
          <a href="/box-shadow" className="text-purple-400 hover:underline">Box Shadow</a>
        </div>
      </div>
    </div>
  );
}
