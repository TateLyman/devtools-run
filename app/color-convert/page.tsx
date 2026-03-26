"use client";
import { useState } from "react";

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
}

function rgbToHex(r: number, g: number, b: number): string {
  return "#" + [r, g, b].map(v => Math.max(0, Math.min(255, v)).toString(16).padStart(2, "0")).join("");
}

function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return [0, 0, Math.round(l * 100)];
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h = 0;
  if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
  else if (max === g) h = ((b - r) / d + 2) / 6;
  else h = ((r - g) / d + 4) / 6;
  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}

function rgbToCmyk(r: number, g: number, b: number): [number, number, number, number] {
  if (r === 0 && g === 0 && b === 0) return [0, 0, 0, 100];
  const c = 1 - r / 255, m = 1 - g / 255, y = 1 - b / 255;
  const k = Math.min(c, m, y);
  return [Math.round((c - k) / (1 - k) * 100), Math.round((m - k) / (1 - k) * 100), Math.round((y - k) / (1 - k) * 100), Math.round(k * 100)];
}

export default function ColorConvert() {
  const [hex, setHex] = useState("#3b82f6");
  const [r, g, b] = hexToRgb(hex);
  const [h, s, l] = rgbToHsl(r, g, b);
  const [c, m, y, k] = rgbToCmyk(r, g, b);

  const copy = (t: string) => navigator.clipboard.writeText(t);

  const formats = [
    { label: "HEX", value: hex.toUpperCase() },
    { label: "RGB", value: `rgb(${r}, ${g}, ${b})` },
    { label: "HSL", value: `hsl(${h}, ${s}%, ${l}%)` },
    { label: "CMYK", value: `cmyk(${c}%, ${m}%, ${y}%, ${k}%)` },
    { label: "CSS var", value: `--color: ${hex};` },
    { label: "Tailwind", value: `[${hex}]` },
  ];

  return (
    <div className="space-y-6">
      <section className="text-center">
        <h1 className="text-4xl font-bold mb-2">Color Converter</h1>
        <p className="text-[var(--text-secondary)]">Convert between HEX, RGB, HSL, CMYK</p>
      </section>

      <div className="flex justify-center gap-4 items-center">
        <input type="color" value={hex} onChange={e => setHex(e.target.value)} className="w-24 h-24 rounded-xl cursor-pointer" />
        <input value={hex} onChange={e => setHex(e.target.value)} className="w-28 bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg px-3 py-2 font-mono text-lg" />
      </div>

      <div className="w-full h-16 rounded-xl" style={{ backgroundColor: hex }} />

      <div className="grid gap-2">
        {formats.map(f => (
          <div key={f.label} onClick={() => copy(f.value)}
            className="flex justify-between items-center bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl px-4 py-3 cursor-pointer hover:border-blue-500/50">
            <span className="text-sm font-bold w-20">{f.label}</span>
            <code className="font-mono text-sm flex-1 text-right">{f.value}</code>
            <span className="text-xs text-blue-400 ml-3">Copy</span>
          </div>
        ))}
      </div>
    </div>
  );
}
