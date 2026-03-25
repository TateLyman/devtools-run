"use client";
import { useState } from "react";

export default function BoxShadowPage() {
  const [x, setX] = useState(5);
  const [y, setY] = useState(5);
  const [blur, setBlur] = useState(15);
  const [spread, setSpread] = useState(0);
  const [color, setColor] = useState("#00000040");
  const [inset, setInset] = useState(false);
  const [copied, setCopied] = useState(false);

  const shadow = `${inset ? "inset " : ""}${x}px ${y}px ${blur}px ${spread}px ${color}`;
  const css = `box-shadow: ${shadow};`;

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-3xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-extrabold mb-2 text-center">CSS Box Shadow Generator</h1>
        <p className="text-gray-400 text-center mb-8">Design box shadows visually and copy the CSS.</p>
        <div className="flex justify-center mb-8">
          <div className="w-48 h-48 bg-gray-800 rounded-xl" style={{ boxShadow: shadow }} />
        </div>
        <div className="bg-gray-900 rounded-xl p-6 mb-6 space-y-4">
          {[["X Offset",x,setX,-50,50],["Y Offset",y,setY,-50,50],["Blur",blur,setBlur,0,100],["Spread",spread,setSpread,-50,50]].map(([label,val,setter,min,max]:any,i)=>(
            <div key={i} className="flex items-center gap-4">
              <div className="w-24 text-sm text-gray-400">{label}: {val}px</div>
              <input type="range" min={min} max={max} value={val} onChange={e=>setter(parseInt(e.target.value))} className="flex-1" />
            </div>
          ))}
          <div className="flex items-center gap-4">
            <div className="w-24 text-sm text-gray-400">Color</div>
            <input type="text" value={color} onChange={e=>setColor(e.target.value)} className="bg-gray-800 border border-gray-700 rounded px-3 py-1 text-sm font-mono" />
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={inset} onChange={e=>setInset(e.target.checked)} />
            <span className="text-sm text-gray-400">Inset</span>
          </label>
        </div>
        <div className="flex gap-2 mb-8">
          <code className="flex-1 bg-gray-800 rounded-lg px-4 py-3 text-sm text-green-400 font-mono">{css}</code>
          <button onClick={()=>{navigator.clipboard.writeText(css);setCopied(true);setTimeout(()=>setCopied(false),2000);}}
            className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg font-bold text-sm">{copied?"Copied!":"Copy"}</button>
        </div>
        <div className="text-center text-gray-500 text-sm">
          <a href="/gradient" className="text-purple-400 hover:underline">Gradients</a>{" | "}
          <a href="/color" className="text-purple-400 hover:underline">Colors</a>{" | "}
          <a href="/css-minify" className="text-purple-400 hover:underline">CSS Minify</a>{" | "}
          <a href="/meta-tags" className="text-purple-400 hover:underline">Meta Tags</a>{" | "}
          <a href="/favicon" className="text-purple-400 hover:underline">Favicon</a>
        </div>
      </div>
    </div>
  );
}
