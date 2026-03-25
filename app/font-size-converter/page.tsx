"use client";
import { useState } from "react";

export default function FontSizeConverter() {
  const [value, setValue] = useState(16);
  const [basePx, setBasePx] = useState(16);

  const conversions = {
    px: value,
    rem: value / basePx,
    em: value / basePx,
    pt: value * 0.75,
    vw: (value / 1920) * 100,
    vh: (value / 1080) * 100,
    percent: (value / basePx) * 100,
  };

  const [copied, setCopied] = useState<string | null>(null);
  const copy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 1500);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Font Size Converter</h1>
        <p className="text-[var(--text-secondary)]">
          Convert between px, rem, em, pt, vw, vh, and percent. Adjustable base font size. Live preview.
        </p>
      </div>

      <div className="max-w-lg mx-auto space-y-4">
        <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-4 space-y-3">
          <div>
            <label className="block text-sm mb-1">Size in pixels: {value}px</label>
            <input type="range" min={1} max={200} value={value} onChange={(e) => setValue(Number(e.target.value))} className="w-full accent-purple-500" />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Base font size: {basePx}px</label>
            <input type="range" min={10} max={24} value={basePx} onChange={(e) => setBasePx(Number(e.target.value))} className="w-full accent-purple-500" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {Object.entries(conversions).map(([unit, val]) => (
            <div
              key={unit}
              className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-4 cursor-pointer hover:border-purple-500/50"
              onClick={() => copy(`${val.toFixed(unit === "px" || unit === "pt" ? 0 : 4)}${unit === "percent" ? "%" : unit}`, unit)}
            >
              <p className="text-xs text-gray-400 uppercase">{unit}</p>
              <p className="text-xl font-bold font-mono text-white">
                {val.toFixed(unit === "px" || unit === "pt" ? 0 : 4)}{unit === "percent" ? "%" : unit}
              </p>
              <p className="text-[10px] text-purple-400">{copied === unit ? "Copied!" : "Click to copy"}</p>
            </div>
          ))}
        </div>

        <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-6">
          <h3 className="text-sm font-bold mb-3">Live Preview</h3>
          <p style={{ fontSize: `${value}px`, lineHeight: 1.4 }} className="text-white">
            The quick brown fox jumps over the lazy dog
          </p>
          <p className="text-xs text-gray-400 mt-2">{value}px = {conversions.rem.toFixed(3)}rem = {conversions.pt.toFixed(0)}pt</p>
        </div>

        <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-4 text-xs text-[var(--text-secondary)]">
          <h3 className="font-bold text-white mb-1">Common Sizes</h3>
          <div className="grid grid-cols-4 gap-2">
            {[12, 14, 16, 18, 20, 24, 32, 48].map((s) => (
              <button key={s} onClick={() => setValue(s)} className="bg-[var(--bg-primary)] rounded py-1 text-center hover:text-white">
                {s}px / {(s / basePx).toFixed(2)}rem
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
