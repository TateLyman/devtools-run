"use client";
import { useState } from "react";

export default function ColorPicker() {
  const [color, setColor] = useState("#6366f1");
  const [copied, setCopied] = useState<string | null>(null);

  const r = parseInt(color.slice(1, 3), 16);
  const g = parseInt(color.slice(3, 5), 16);
  const b = parseInt(color.slice(5, 7), 16);

  // RGB to HSL
  const rn = r / 255, gn = g / 255, bn = b / 255;
  const max = Math.max(rn, gn, bn), min = Math.min(rn, gn, bn);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === rn) h = ((gn - bn) / d + (gn < bn ? 6 : 0)) / 6;
    else if (max === gn) h = ((bn - rn) / d + 2) / 6;
    else h = ((rn - gn) / d + 4) / 6;
  }
  const hsl = { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };

  const formats = [
    { label: "HEX", value: color.toUpperCase() },
    { label: "RGB", value: `rgb(${r}, ${g}, ${b})` },
    { label: "HSL", value: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)` },
    { label: "RGBA", value: `rgba(${r}, ${g}, ${b}, 1)` },
    { label: "CSS", value: `color: ${color};` },
    { label: "Tailwind", value: `bg-[${color}]` },
  ];

  const copy = (val: string, label: string) => {
    navigator.clipboard.writeText(val);
    setCopied(label);
    setTimeout(() => setCopied(null), 1500);
  };

  // Generate shades
  const shades = Array.from({ length: 9 }, (_, i) => {
    const lightness = 95 - i * 10;
    const sh = Math.round(hsl.h);
    const ss = Math.round(hsl.s);
    return { l: lightness, hex: hslToHex(sh, ss, lightness) };
  });

  function hslToHex(h: number, s: number, l: number): string {
    s /= 100; l /= 100;
    const a = s * Math.min(l, 1 - l);
    const f = (n: number) => {
      const k = (n + h / 30) % 12;
      const c = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * c).toString(16).padStart(2, "0");
    };
    return `#${f(0)}${f(8)}${f(4)}`;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Color Picker</h1>
        <p className="text-[var(--text-secondary)]">
          Pick any color and get HEX, RGB, HSL, RGBA, CSS, and Tailwind values. Generate shades. Click to copy any format.
        </p>
      </div>

      <div className="max-w-lg mx-auto space-y-4">
        <div className="flex gap-4 items-center justify-center">
          <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="w-24 h-24 rounded-xl cursor-pointer border-0" />
          <div className="w-24 h-24 rounded-xl border border-[var(--border)]" style={{ backgroundColor: color }} />
        </div>

        <input value={color} onChange={(e) => { if (/^#[0-9a-f]{6}$/i.test(e.target.value)) setColor(e.target.value); }} className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded px-4 py-2 text-white font-mono text-center text-lg" />

        <div className="grid grid-cols-2 gap-2">
          {formats.map((f) => (
            <div key={f.label} className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-3 cursor-pointer hover:border-purple-500/30" onClick={() => copy(f.value, f.label)}>
              <p className="text-xs text-gray-400">{f.label}</p>
              <p className="text-sm font-mono text-white">{f.value}</p>
              {copied === f.label && <p className="text-xs text-purple-400">Copied!</p>}
            </div>
          ))}
        </div>

        <div>
          <h3 className="text-sm font-bold mb-2">Shades</h3>
          <div className="flex rounded-lg overflow-hidden h-12">
            {shades.map((shade) => (
              <div key={shade.l} className="flex-1 cursor-pointer hover:scale-y-110 transition-transform" style={{ backgroundColor: shade.hex }} onClick={() => { setColor(shade.hex); copy(shade.hex, "shade"); }} title={shade.hex} />
            ))}
          </div>
          <div className="flex justify-between text-[10px] text-gray-500 mt-1">
            <span>Light</span><span>Dark</span>
          </div>
        </div>
      </div>
    </div>
  );
}
