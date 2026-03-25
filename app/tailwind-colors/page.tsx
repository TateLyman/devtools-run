"use client";
import { useState } from "react";

const COLORS: Record<string, Record<string, string>> = {
  slate: {50:"#f8fafc",100:"#f1f5f9",200:"#e2e8f0",300:"#cbd5e1",400:"#94a3b8",500:"#64748b",600:"#475569",700:"#334155",800:"#1e293b",900:"#0f172a",950:"#020617"},
  red: {50:"#fef2f2",100:"#fee2e2",200:"#fecaca",300:"#fca5a5",400:"#f87171",500:"#ef4444",600:"#dc2626",700:"#b91c1c",800:"#991b1b",900:"#7f1d1d",950:"#450a0a"},
  orange: {50:"#fff7ed",100:"#ffedd5",200:"#fed7aa",300:"#fdba74",400:"#fb923c",500:"#f97316",600:"#ea580c",700:"#c2410c",800:"#9a3412",900:"#7c2d12",950:"#431407"},
  yellow: {50:"#fefce8",100:"#fef9c3",200:"#fef08a",300:"#fde047",400:"#facc15",500:"#eab308",600:"#ca8a04",700:"#a16207",800:"#854d0e",900:"#713f12",950:"#422006"},
  green: {50:"#f0fdf4",100:"#dcfce7",200:"#bbf7d0",300:"#86efac",400:"#4ade80",500:"#22c55e",600:"#16a34a",700:"#15803d",800:"#166534",900:"#14532d",950:"#052e16"},
  blue: {50:"#eff6ff",100:"#dbeafe",200:"#bfdbfe",300:"#93c5fd",400:"#60a5fa",500:"#3b82f6",600:"#2563eb",700:"#1d4ed8",800:"#1e40af",900:"#1e3a8a",950:"#172554"},
  purple: {50:"#faf5ff",100:"#f3e8ff",200:"#e9d5ff",300:"#d8b4fe",400:"#c084fc",500:"#a855f7",600:"#9333ea",700:"#7e22ce",800:"#6b21a8",900:"#581c87",950:"#3b0764"},
  pink: {50:"#fdf2f8",100:"#fce7f3",200:"#fbcfe8",300:"#f9a8d4",400:"#f472b6",500:"#ec4899",600:"#db2777",700:"#be185d",800:"#9d174d",900:"#831843",950:"#500724"},
};

export default function TailwindColorsPage() {
  const [copied, setCopied] = useState("");

  function copy(val: string) {
    navigator.clipboard.writeText(val);
    setCopied(val);
    setTimeout(() => setCopied(""), 1500);
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-5xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-extrabold mb-2 text-center">Tailwind CSS Colors</h1>
        <p className="text-gray-400 text-center mb-8">Click any color to copy the hex value. Full Tailwind CSS v3 color palette.</p>
        <div className="space-y-4">
          {Object.entries(COLORS).map(([name, shades]) => (
            <div key={name}>
              <div className="text-sm text-gray-400 mb-1 capitalize">{name}</div>
              <div className="flex gap-1">
                {Object.entries(shades).map(([shade, hex]) => (
                  <button key={shade} onClick={() => copy(hex)} title={`${name}-${shade}: ${hex}`}
                    className="flex-1 h-10 rounded-md relative group cursor-pointer transition-transform hover:scale-110 hover:z-10"
                    style={{ backgroundColor: hex }}>
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/60 rounded-md text-[10px] font-mono">
                      {copied === hex ? "Copied!" : shade}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-12 text-center text-gray-500 text-sm">
          <a href="/color" className="text-purple-400 hover:underline">Color Picker</a>{" | "}
          <a href="/gradient" className="text-purple-400 hover:underline">Gradients</a>{" | "}
          <a href="/css-minify" className="text-purple-400 hover:underline">CSS Minify</a>{" | "}
          <a href="/box-shadow" className="text-purple-400 hover:underline">Box Shadow</a>{" | "}
          <a href="/favicon" className="text-purple-400 hover:underline">Favicon</a>
        </div>
      </div>
    </div>
  );
}
