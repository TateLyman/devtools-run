"use client";
import { useState } from "react";

function hexToRgb(hex: string): [number, number, number] | null {
  const match = hex.replace("#", "").match(/^([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
  if (!match) return null;
  return [parseInt(match[1], 16), parseInt(match[2], 16), parseInt(match[3], 16)];
}

function rgbToHex(r: number, g: number, b: number): string {
  return "#" + [r, g, b].map((v) => Math.max(0, Math.min(255, v)).toString(16).padStart(2, "0")).join("");
}

function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  h /= 360; s /= 100; l /= 100;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h * 12) % 12;
    return Math.round(255 * (l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)));
  };
  return [f(0), f(8), f(4)];
}

export default function ColorConverter() {
  const [hex, setHex] = useState("#6366f1");
  const [r, setR] = useState(99);
  const [g, setG] = useState(102);
  const [b, setB] = useState(241);
  const [h, setH] = useState(239);
  const [s, setS] = useState(84);
  const [l, setL] = useState(67);
  const [copied, setCopied] = useState<string | null>(null);

  const updateFromHex = (newHex: string) => {
    setHex(newHex);
    const rgb = hexToRgb(newHex);
    if (rgb) {
      setR(rgb[0]); setG(rgb[1]); setB(rgb[2]);
      const hsl = rgbToHsl(...rgb);
      setH(hsl[0]); setS(hsl[1]); setL(hsl[2]);
    }
  };

  const updateFromRgb = (nr: number, ng: number, nb: number) => {
    setR(nr); setG(ng); setB(nb);
    setHex(rgbToHex(nr, ng, nb));
    const hsl = rgbToHsl(nr, ng, nb);
    setH(hsl[0]); setS(hsl[1]); setL(hsl[2]);
  };

  const updateFromHsl = (nh: number, ns: number, nl: number) => {
    setH(nh); setS(ns); setL(nl);
    const rgb = hslToRgb(nh, ns, nl);
    setR(rgb[0]); setG(rgb[1]); setB(rgb[2]);
    setHex(rgbToHex(...rgb));
  };

  const copy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 1500);
  };

  const hexStr = hex.toUpperCase();
  const rgbStr = `rgb(${r}, ${g}, ${b})`;
  const hslStr = `hsl(${h}, ${s}%, ${l}%)`;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Color Converter</h1>
        <p className="text-[var(--text-secondary)]">
          Convert colors between HEX, RGB, and HSL formats. Live preview swatch. Free online color conversion tool.
        </p>
      </div>

      <div className="flex gap-6 items-center">
        <div className="w-32 h-32 rounded-xl border border-[var(--border)] shadow-lg" style={{ backgroundColor: hex }} />
        <div className="space-y-2">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => copy(hexStr, "hex")}>
            <span className="text-xs text-gray-400 w-10">HEX</span>
            <code className="text-lg font-mono text-white font-bold">{hexStr}</code>
            <span className="text-xs text-purple-400">{copied === "hex" ? "Copied!" : ""}</span>
          </div>
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => copy(rgbStr, "rgb")}>
            <span className="text-xs text-gray-400 w-10">RGB</span>
            <code className="text-lg font-mono text-white">{rgbStr}</code>
            <span className="text-xs text-purple-400">{copied === "rgb" ? "Copied!" : ""}</span>
          </div>
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => copy(hslStr, "hsl")}>
            <span className="text-xs text-gray-400 w-10">HSL</span>
            <code className="text-lg font-mono text-white">{hslStr}</code>
            <span className="text-xs text-purple-400">{copied === "hsl" ? "Copied!" : ""}</span>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-4 space-y-3">
          <h2 className="font-bold text-sm">HEX</h2>
          <div className="flex gap-2">
            <input type="color" value={hex} onChange={(e) => updateFromHex(e.target.value)} className="w-10 h-10 rounded cursor-pointer" />
            <input value={hex} onChange={(e) => { setHex(e.target.value); if (/^#[0-9a-f]{6}$/i.test(e.target.value)) updateFromHex(e.target.value); }} className="flex-1 bg-[var(--bg-primary)] border border-[var(--border)] rounded px-3 py-2 text-white font-mono text-sm" />
          </div>
        </div>

        <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-4 space-y-2">
          <h2 className="font-bold text-sm">RGB</h2>
          {[
            { label: "R", val: r, set: (v: number) => updateFromRgb(v, g, b), max: 255, color: "accent-red-500" },
            { label: "G", val: g, set: (v: number) => updateFromRgb(r, v, b), max: 255, color: "accent-green-500" },
            { label: "B", val: b, set: (v: number) => updateFromRgb(r, g, v), max: 255, color: "accent-blue-500" },
          ].map(({ label, val, set, max, color }) => (
            <div key={label} className="flex items-center gap-2">
              <span className="text-xs text-gray-400 w-4">{label}</span>
              <input type="range" min={0} max={max} value={val} onChange={(e) => set(Number(e.target.value))} className={`flex-1 ${color}`} />
              <input type="number" min={0} max={max} value={val} onChange={(e) => set(Number(e.target.value))} className="w-14 bg-[var(--bg-primary)] border border-[var(--border)] rounded px-1 py-0.5 text-white text-xs text-center" />
            </div>
          ))}
        </div>

        <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-4 space-y-2">
          <h2 className="font-bold text-sm">HSL</h2>
          {[
            { label: "H", val: h, set: (v: number) => updateFromHsl(v, s, l), max: 360 },
            { label: "S", val: s, set: (v: number) => updateFromHsl(h, v, l), max: 100 },
            { label: "L", val: l, set: (v: number) => updateFromHsl(h, s, v), max: 100 },
          ].map(({ label, val, set, max }) => (
            <div key={label} className="flex items-center gap-2">
              <span className="text-xs text-gray-400 w-4">{label}</span>
              <input type="range" min={0} max={max} value={val} onChange={(e) => set(Number(e.target.value))} className="flex-1 accent-purple-500" />
              <input type="number" min={0} max={max} value={val} onChange={(e) => set(Number(e.target.value))} className="w-14 bg-[var(--bg-primary)] border border-[var(--border)] rounded px-1 py-0.5 text-white text-xs text-center" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
