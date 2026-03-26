"use client";
import { useState } from "react";

function hexToHsl(hex: string): [number, number, number] {
  let r = parseInt(hex.slice(1, 3), 16) / 255;
  let g = parseInt(hex.slice(3, 5), 16) / 255;
  let b = parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return [0, 0, l * 100];
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h = 0;
  if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
  else if (max === g) h = ((b - r) / d + 2) / 6;
  else h = ((r - g) / d + 4) / 6;
  return [h * 360, s * 100, l * 100];
}

function hslToHex(h: number, s: number, l: number): string {
  h = ((h % 360) + 360) % 360;
  s /= 100; l /= 100;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => { const k = (n + h / 30) % 12; return l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1); };
  return "#" + [f(0), f(8), f(4)].map(v => Math.round(v * 255).toString(16).padStart(2, "0")).join("");
}

export default function ColorHarmonies() {
  const [color, setColor] = useState("#3b82f6");
  const [h, s, l] = hexToHsl(color);

  const harmonies = [
    { name: "Complementary", colors: [color, hslToHex(h + 180, s, l)] },
    { name: "Analogous", colors: [hslToHex(h - 30, s, l), color, hslToHex(h + 30, s, l)] },
    { name: "Triadic", colors: [color, hslToHex(h + 120, s, l), hslToHex(h + 240, s, l)] },
    { name: "Split Complementary", colors: [color, hslToHex(h + 150, s, l), hslToHex(h + 210, s, l)] },
    { name: "Tetradic", colors: [color, hslToHex(h + 90, s, l), hslToHex(h + 180, s, l), hslToHex(h + 270, s, l)] },
    { name: "Monochromatic", colors: [hslToHex(h, s, 20), hslToHex(h, s, 35), hslToHex(h, s, 50), hslToHex(h, s, 65), hslToHex(h, s, 80)] },
  ];

  const copy = (hex: string) => navigator.clipboard.writeText(hex);

  return (
    <div className="space-y-6">
      <section className="text-center">
        <h1 className="text-4xl font-bold mb-2">Color Harmony Generator</h1>
        <p className="text-[var(--text-secondary)]">Generate harmonious color palettes from any color</p>
      </section>

      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-6 flex items-center justify-center gap-4">
        <input type="color" value={color} onChange={e => setColor(e.target.value)} className="w-16 h-16 rounded-lg cursor-pointer" />
        <input value={color} onChange={e => setColor(e.target.value)} className="w-28 bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg px-3 py-2 font-mono text-lg" />
        <div className="text-sm text-[var(--text-secondary)]">HSL({Math.round(h)}, {Math.round(s)}%, {Math.round(l)}%)</div>
      </div>

      <div className="space-y-4">
        {harmonies.map(harm => (
          <div key={harm.name} className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-4">
            <h2 className="text-sm font-bold mb-2">{harm.name}</h2>
            <div className="flex gap-2">
              {harm.colors.map((c, i) => (
                <button key={i} onClick={() => copy(c)} className="flex-1 group relative">
                  <div className="h-16 rounded-lg" style={{ backgroundColor: c }} />
                  <div className="text-xs font-mono text-center mt-1 text-[var(--text-secondary)]">{c.toUpperCase()}</div>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
