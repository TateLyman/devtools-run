"use client";
import { useState } from "react";

const COLORS: [string, string][] = [
  ["#FF0000","Red"],["#00FF00","Lime"],["#0000FF","Blue"],["#FFFF00","Yellow"],["#FF00FF","Magenta"],["#00FFFF","Cyan"],
  ["#800000","Maroon"],["#008000","Green"],["#000080","Navy"],["#808000","Olive"],["#800080","Purple"],["#008080","Teal"],
  ["#FFA500","Orange"],["#FFC0CB","Pink"],["#A52A2A","Brown"],["#808080","Gray"],["#C0C0C0","Silver"],["#FFD700","Gold"],
  ["#FF6347","Tomato"],["#4B0082","Indigo"],["#EE82EE","Violet"],["#F5DEB3","Wheat"],["#DDA0DD","Plum"],["#FA8072","Salmon"],
  ["#6B5B95","Ultra Violet"],["#88B04B","Greenery"],["#FF6F61","Living Coral"],["#0F4C81","Classic Blue"],
  ["#6c5ce7","Purple Heart"],["#00d68f","Emerald"],["#ff4757","Watermelon"],["#1e90ff","Dodger Blue"],
];

function hexDist(a: string, b: string): number {
  const ar = parseInt(a.slice(1,3),16), ag = parseInt(a.slice(3,5),16), ab = parseInt(a.slice(5,7),16);
  const br = parseInt(b.slice(1,3),16), bg = parseInt(b.slice(3,5),16), bb = parseInt(b.slice(5,7),16);
  return Math.sqrt((ar-br)**2 + (ag-bg)**2 + (ab-bb)**2);
}

export default function ColorNamePage() {
  const [hex, setHex] = useState("#6c5ce7");
  const sorted = [...COLORS].sort((a,b) => hexDist(hex,a[0]) - hexDist(hex,b[0]));
  const closest = sorted[0];

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-3xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-extrabold mb-2 text-center">Color Name Finder</h1>
        <p className="text-gray-400 text-center mb-8">Enter a hex color to find the closest named color.</p>
        <div className="flex items-center gap-4 justify-center mb-8">
          <input type="color" value={hex} onChange={e=>setHex(e.target.value)} className="w-16 h-16 rounded-xl cursor-pointer" />
          <input type="text" value={hex} onChange={e=>setHex(e.target.value)} className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white font-mono text-xl w-40" />
        </div>
        <div className="bg-gray-900 rounded-xl p-6 text-center mb-6">
          <div className="w-24 h-24 rounded-xl mx-auto mb-3" style={{backgroundColor:hex}} />
          <div className="text-2xl font-bold">{closest[1]}</div>
          <div className="text-sm text-gray-400">Closest match: {closest[0]}</div>
        </div>
        <div className="bg-gray-900 rounded-xl p-4">
          <div className="text-xs text-gray-400 mb-2">Similar colors</div>
          <div className="flex flex-wrap gap-2">
            {sorted.slice(0,10).map(([h,n],i)=>(
              <button key={i} onClick={()=>setHex(h)} className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 rounded-lg px-3 py-2">
                <div className="w-4 h-4 rounded" style={{backgroundColor:h}} />
                <span className="text-xs">{n}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="mt-8 text-center text-gray-500 text-sm">
          <a href="/color" className="text-purple-400 hover:underline">Color Picker</a>{" | "}
          <a href="/hex-rgb" className="text-purple-400 hover:underline">Hex/RGB</a>{" | "}
          <a href="/palette" className="text-purple-400 hover:underline">Palette</a>{" | "}
          <a href="/tailwind-colors" className="text-purple-400 hover:underline">Tailwind</a>
        </div>
      </div>
    </div>
  );
}
