"use client";
import { useState } from "react";

export default function CSSFilter() {
  const [blur, setBlur] = useState(0);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [grayscale, setGrayscale] = useState(0);
  const [hueRotate, setHueRotate] = useState(0);
  const [invert, setInvert] = useState(0);
  const [saturate, setSaturate] = useState(100);
  const [sepia, setSepia] = useState(0);

  const parts: string[] = [];
  if (blur > 0) parts.push(`blur(${blur}px)`);
  if (brightness !== 100) parts.push(`brightness(${brightness}%)`);
  if (contrast !== 100) parts.push(`contrast(${contrast}%)`);
  if (grayscale > 0) parts.push(`grayscale(${grayscale}%)`);
  if (hueRotate > 0) parts.push(`hue-rotate(${hueRotate}deg)`);
  if (invert > 0) parts.push(`invert(${invert}%)`);
  if (saturate !== 100) parts.push(`saturate(${saturate}%)`);
  if (sepia > 0) parts.push(`sepia(${sepia}%)`);

  const filterCSS = parts.length > 0 ? parts.join(" ") : "none";
  const css = `filter: ${filterCSS};`;

  const copy = () => navigator.clipboard.writeText(css);
  const reset = () => { setBlur(0); setBrightness(100); setContrast(100); setGrayscale(0); setHueRotate(0); setInvert(0); setSaturate(100); setSepia(0); };

  const presets = [
    { name: "Normal", fn: reset },
    { name: "Grayscale", fn: () => { reset(); setGrayscale(100); } },
    { name: "Sepia", fn: () => { reset(); setSepia(80); } },
    { name: "Vintage", fn: () => { reset(); setSepia(50); setContrast(120); setBrightness(90); } },
    { name: "Cool", fn: () => { reset(); setHueRotate(180); setSaturate(80); } },
    { name: "Warm", fn: () => { reset(); setHueRotate(30); setSaturate(120); setBrightness(105); } },
    { name: "Dramatic", fn: () => { reset(); setContrast(150); setBrightness(80); setSaturate(130); } },
    { name: "Dreamy", fn: () => { reset(); setBlur(1); setBrightness(110); setSaturate(80); } },
  ];

  return (
    <div className="space-y-6">
      <section className="text-center">
        <h1 className="text-4xl font-bold mb-2">CSS Filter Generator</h1>
        <p className="text-[var(--text-secondary)]">Create image filter effects visually</p>
      </section>

      <div className="flex justify-center">
        <div className="w-64 h-64 rounded-xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center text-white text-4xl font-bold"
          style={{ filter: filterCSS }}>
          Preview
        </div>
      </div>

      <div className="flex flex-wrap gap-2 justify-center">
        {presets.map(p => <button key={p.name} onClick={p.fn} className="bg-[var(--bg-secondary)] border border-[var(--border)] px-3 py-1 rounded text-sm hover:border-blue-500/50">{p.name}</button>)}
      </div>

      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-6">
        <div className="grid gap-3 md:grid-cols-2">
          {[
            ["Blur", blur, setBlur, 0, 20, "px"],
            ["Brightness", brightness, setBrightness, 0, 200, "%"],
            ["Contrast", contrast, setContrast, 0, 200, "%"],
            ["Grayscale", grayscale, setGrayscale, 0, 100, "%"],
            ["Hue Rotate", hueRotate, setHueRotate, 0, 360, "deg"],
            ["Invert", invert, setInvert, 0, 100, "%"],
            ["Saturate", saturate, setSaturate, 0, 200, "%"],
            ["Sepia", sepia, setSepia, 0, 100, "%"],
          ].map(([label, value, setter, min, max, unit]) => (
            <div key={label as string}>
              <label className="text-xs text-[var(--text-secondary)]">{label as string}: {value as number}{unit as string}</label>
              <input type="range" min={min as number} max={max as number} value={value as number} onChange={e => (setter as (v: number) => void)(Number(e.target.value))} className="w-full" />
            </div>
          ))}
        </div>
      </div>

      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-4">
        <div className="flex justify-between mb-2">
          <label className="text-sm font-bold">CSS</label>
          <button onClick={copy} className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs font-bold">Copy</button>
        </div>
        <code className="font-mono text-sm text-emerald-400">{css}</code>
      </div>
    </div>
  );
}
