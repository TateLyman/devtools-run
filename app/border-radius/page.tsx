"use client";
import { useState } from "react";

export default function BorderRadiusPage() {
  const [tl, setTl] = useState(20);
  const [tr, setTr] = useState(20);
  const [bl, setBl] = useState(20);
  const [br, setBr] = useState(20);
  const [copied, setCopied] = useState(false);
  const css = `border-radius: ${tl}px ${tr}px ${br}px ${bl}px;`;

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-3xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-extrabold mb-2 text-center">Border Radius Generator</h1>
        <p className="text-gray-400 text-center mb-8">Design border-radius visually and copy CSS.</p>
        <div className="flex justify-center mb-8">
          <div className="w-48 h-48 bg-purple-600" style={{ borderRadius: `${tl}px ${tr}px ${br}px ${bl}px` }} />
        </div>
        <div className="bg-gray-900 rounded-xl p-6 mb-6 grid grid-cols-2 gap-4">
          {[["Top Left",tl,setTl],["Top Right",tr,setTr],["Bottom Left",bl,setBl],["Bottom Right",br,setBr]].map(([l,v,s]:any,i)=>(
            <div key={i}>
              <div className="text-xs text-gray-400 mb-1">{l}: {v}px</div>
              <input type="range" min="0" max="100" value={v} onChange={e=>s(parseInt(e.target.value))} className="w-full" />
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <code className="flex-1 bg-gray-800 rounded-lg px-4 py-3 text-sm text-green-400 font-mono">{css}</code>
          <button onClick={()=>{navigator.clipboard.writeText(css);setCopied(true);setTimeout(()=>setCopied(false),1500);}} className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg font-bold text-sm">{copied?"Copied!":"Copy"}</button>
        </div>
        <div className="mt-4 flex gap-2 justify-center">
          {[0,10,20,50,100].map(v=><button key={v} onClick={()=>{setTl(v);setTr(v);setBl(v);setBr(v);}} className="bg-gray-800 hover:bg-gray-700 px-3 py-1 rounded text-xs font-bold">{v}px</button>)}
          <button onClick={()=>{setTl(50);setTr(50);setBl(50);setBr(50);}} className="bg-gray-800 hover:bg-gray-700 px-3 py-1 rounded text-xs font-bold">Circle</button>
        </div>
        <div className="mt-8 text-center text-gray-500 text-sm">
          <a href="/gradient" className="text-purple-400 hover:underline">Gradients</a>{" | "}
          <a href="/box-shadow" className="text-purple-400 hover:underline">Box Shadow</a>{" | "}
          <a href="/animations" className="text-purple-400 hover:underline">Animations</a>{" | "}
          <a href="/" className="text-purple-400 hover:underline">All Tools</a>
        </div>
      </div>
    </div>
  );
}
