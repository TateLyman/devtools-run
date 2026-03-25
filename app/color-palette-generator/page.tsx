"use client";
import { useState, useCallback } from "react";

function hslToHex(h: number, s: number, l: number): string {
  s /= 100; l /= 100;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

function hexToHSL(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
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

type SchemeType = "analogous" | "complementary" | "triadic" | "split-complementary" | "tetradic" | "monochromatic";

function generatePalette(baseHex: string, scheme: SchemeType, count: number): string[] {
  const [h, s, l] = hexToHSL(baseHex);
  const colors: string[] = [];

  switch (scheme) {
    case "analogous":
      for (let i = 0; i < count; i++) {
        const offset = (i - Math.floor(count / 2)) * 30;
        colors.push(hslToHex((h + offset + 360) % 360, s, l));
      }
      break;
    case "complementary":
      colors.push(baseHex);
      colors.push(hslToHex((h + 180) % 360, s, l));
      for (let i = 2; i < count; i++) {
        colors.push(hslToHex((h + 180) % 360, s, Math.max(10, Math.min(90, l + (i % 2 === 0 ? 15 : -15) * Math.floor(i / 2)))));
      }
      break;
    case "triadic":
      for (let i = 0; i < count; i++) {
        colors.push(hslToHex((h + (120 * i)) % 360, s, l));
      }
      break;
    case "split-complementary":
      colors.push(baseHex);
      colors.push(hslToHex((h + 150) % 360, s, l));
      colors.push(hslToHex((h + 210) % 360, s, l));
      for (let i = 3; i < count; i++) {
        colors.push(hslToHex((h + 150 + (i * 15)) % 360, s, l));
      }
      break;
    case "tetradic":
      colors.push(baseHex);
      colors.push(hslToHex((h + 90) % 360, s, l));
      colors.push(hslToHex((h + 180) % 360, s, l));
      colors.push(hslToHex((h + 270) % 360, s, l));
      for (let i = 4; i < count; i++) {
        colors.push(hslToHex((h + 45 * i) % 360, s, l));
      }
      break;
    case "monochromatic":
      for (let i = 0; i < count; i++) {
        const lightness = 15 + (70 / (count - 1)) * i;
        colors.push(hslToHex(h, s, Math.round(lightness)));
      }
      break;
  }
  return colors.slice(0, count);
}

function randomHex(): string {
  return "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0");
}

export default function ColorPaletteGenerator() {
  const [baseColor, setBaseColor] = useState("#6366f1");
  const [scheme, setScheme] = useState<SchemeType>("analogous");
  const [count, setCount] = useState(5);
  const [palette, setPalette] = useState<string[]>(() => generatePalette("#6366f1", "analogous", 5));
  const [copied, setCopied] = useState<number | null>(null);
  const [locked, setLocked] = useState<Set<number>>(new Set());

  const regenerate = useCallback(() => {
    const newPalette = generatePalette(baseColor, scheme, count);
    setPalette(newPalette.map((c, i) => locked.has(i) ? palette[i] : c));
  }, [baseColor, scheme, count, locked, palette]);

  const randomize = () => {
    const newBase = randomHex();
    setBaseColor(newBase);
    setPalette(generatePalette(newBase, scheme, count));
  };

  const copyColor = (i: number) => {
    navigator.clipboard.writeText(palette[i]);
    setCopied(i);
    setTimeout(() => setCopied(null), 1500);
  };

  const toggleLock = (i: number) => {
    const next = new Set(locked);
    next.has(i) ? next.delete(i) : next.add(i);
    setLocked(next);
  };

  const exportCSS = () => {
    const css = `:root {\n${palette.map((c, i) => `  --color-${i + 1}: ${c};`).join("\n")}\n}`;
    navigator.clipboard.writeText(css);
  };

  const exportTailwind = () => {
    const tw = `colors: {\n  brand: {\n${palette.map((c, i) => `    ${(i + 1) * 100}: '${c}',`).join("\n")}\n  }\n}`;
    navigator.clipboard.writeText(tw);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Color Palette Generator</h1>
        <p className="text-[var(--text-secondary)]">
          Generate harmonious color palettes using color theory. Export as CSS variables or Tailwind config. Press Space to randomize.
        </p>
      </div>

      <div className="flex flex-wrap gap-3 items-center">
        <div className="flex items-center gap-2">
          <input type="color" value={baseColor} onChange={(e) => { setBaseColor(e.target.value); setPalette(generatePalette(e.target.value, scheme, count)); }} className="w-10 h-10 rounded cursor-pointer" />
          <input value={baseColor} onChange={(e) => { setBaseColor(e.target.value); if (/^#[0-9a-f]{6}$/i.test(e.target.value)) setPalette(generatePalette(e.target.value, scheme, count)); }} className="w-24 bg-[var(--bg-secondary)] border border-[var(--border)] rounded px-2 py-1 text-white text-sm font-mono" />
        </div>

        <select value={scheme} onChange={(e) => { const s = e.target.value as SchemeType; setScheme(s); setPalette(generatePalette(baseColor, s, count)); }} className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded px-3 py-2 text-white text-sm">
          <option value="analogous">Analogous</option>
          <option value="complementary">Complementary</option>
          <option value="triadic">Triadic</option>
          <option value="split-complementary">Split Complementary</option>
          <option value="tetradic">Tetradic</option>
          <option value="monochromatic">Monochromatic</option>
        </select>

        <select value={count} onChange={(e) => { const c = Number(e.target.value); setCount(c); setPalette(generatePalette(baseColor, scheme, c)); }} className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded px-3 py-2 text-white text-sm">
          {[3, 4, 5, 6, 7, 8].map((n) => <option key={n} value={n}>{n} colors</option>)}
        </select>

        <button onClick={randomize} className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded font-bold text-sm">Randomize</button>
        <button onClick={regenerate} className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded text-sm">Regenerate</button>
      </div>

      <div className="flex gap-2 h-64 rounded-lg overflow-hidden">
        {palette.map((color, i) => (
          <div
            key={i}
            className="flex-1 relative group cursor-pointer transition-all hover:flex-[1.2]"
            style={{ backgroundColor: color }}
            onClick={() => copyColor(i)}
          >
            <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
              <span className="text-white font-mono font-bold text-sm drop-shadow">{color.toUpperCase()}</span>
              <span className="text-white/70 text-xs mt-1">{copied === i ? "Copied!" : "Click to copy"}</span>
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); toggleLock(i); }}
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-white text-xs bg-black/30 rounded px-1.5 py-0.5"
            >
              {locked.has(i) ? "Locked" : "Lock"}
            </button>
          </div>
        ))}
      </div>

      <div className="flex gap-3">
        <button onClick={exportCSS} className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded text-sm">Copy CSS Variables</button>
        <button onClick={exportTailwind} className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded text-sm">Copy Tailwind Config</button>
      </div>

      <div className="grid gap-2">
        {palette.map((color, i) => {
          const [h, s, l] = hexToHSL(color);
          const r = parseInt(color.slice(1, 3), 16);
          const g = parseInt(color.slice(3, 5), 16);
          const b = parseInt(color.slice(5, 7), 16);
          return (
            <div key={i} className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded p-3 flex items-center gap-4 text-sm">
              <div className="w-8 h-8 rounded" style={{ backgroundColor: color }} />
              <span className="font-mono text-white w-20">{color.toUpperCase()}</span>
              <span className="text-[var(--text-secondary)]">rgb({r}, {g}, {b})</span>
              <span className="text-[var(--text-secondary)]">hsl({h}, {s}%, {l}%)</span>
              {locked.has(i) && <span className="text-yellow-400 text-xs ml-auto">Locked</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
