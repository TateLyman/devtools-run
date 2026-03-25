"use client";
import { useState } from "react";

function hexToRgb(hex: string): [number,number,number] {
  const r = parseInt(hex.slice(1,3), 16) || 0;
  const g = parseInt(hex.slice(3,5), 16) || 0;
  const b = parseInt(hex.slice(5,7), 16) || 0;
  return [r, g, b];
}

function luminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map(c => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

function contrastRatio(hex1: string, hex2: string): number {
  const l1 = luminance(...hexToRgb(hex1));
  const l2 = luminance(...hexToRgb(hex2));
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

export default function ContrastPage() {
  const [fg, setFg] = useState("#ffffff");
  const [bg, setBg] = useState("#6c5ce7");
  const ratio = contrastRatio(fg, bg);
  const aaLarge = ratio >= 3;
  const aaNormal = ratio >= 4.5;
  const aaaLarge = ratio >= 4.5;
  const aaaNormal = ratio >= 7;

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-3xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-extrabold mb-2 text-center">Color Contrast Checker</h1>
        <p className="text-gray-400 text-center mb-8">Check WCAG accessibility compliance between two colors.</p>
        <div className="rounded-2xl p-12 mb-6 text-center" style={{ backgroundColor: bg, color: fg }}>
          <div className="text-4xl font-bold mb-2">Sample Text</div>
          <div className="text-lg">The quick brown fox jumps over the lazy dog</div>
          <div className="text-sm mt-2 opacity-75">Small text sample for AA/AAA testing</div>
        </div>
        <div className="bg-gray-900 rounded-xl p-6 mb-6">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-xs text-gray-400">Foreground</label>
              <div className="flex gap-2 items-center">
                <input type="color" value={fg} onChange={e => setFg(e.target.value)} className="w-10 h-10 rounded cursor-pointer" />
                <input type="text" value={fg} onChange={e => setFg(e.target.value)} className="bg-gray-800 border border-gray-700 rounded px-3 py-1 text-sm font-mono flex-1" />
              </div>
            </div>
            <div>
              <label className="text-xs text-gray-400">Background</label>
              <div className="flex gap-2 items-center">
                <input type="color" value={bg} onChange={e => setBg(e.target.value)} className="w-10 h-10 rounded cursor-pointer" />
                <input type="text" value={bg} onChange={e => setBg(e.target.value)} className="bg-gray-800 border border-gray-700 rounded px-3 py-1 text-sm font-mono flex-1" />
              </div>
            </div>
          </div>
          <div className="text-center mb-4">
            <div className="text-4xl font-extrabold">{ratio.toFixed(2)}:1</div>
            <div className="text-sm text-gray-400">Contrast Ratio</div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[["AA Normal", aaNormal, "4.5:1"],["AA Large", aaLarge, "3:1"],["AAA Normal", aaaNormal, "7:1"],["AAA Large", aaaLarge, "4.5:1"]].map(([label, pass, req]: any, i) => (
              <div key={i} className={`rounded-lg p-3 text-center ${pass ? "bg-green-900/30 border border-green-700" : "bg-red-900/30 border border-red-700"}`}>
                <div className="font-bold text-sm">{pass ? "PASS" : "FAIL"}</div>
                <div className="text-xs text-gray-400">{label} ({req})</div>
              </div>
            ))}
          </div>
        </div>
        <div className="text-center text-gray-500 text-sm">
          <a href="/color" className="text-purple-400 hover:underline">Color Picker</a>{" | "}
          <a href="/hex-rgb" className="text-purple-400 hover:underline">Hex/RGB</a>{" | "}
          <a href="/tailwind-colors" className="text-purple-400 hover:underline">Tailwind</a>{" | "}
          <a href="/gradient" className="text-purple-400 hover:underline">Gradients</a>{" | "}
          <a href="/css-minify" className="text-purple-400 hover:underline">CSS Minify</a>
        </div>
      </div>
    </div>
  );
}
