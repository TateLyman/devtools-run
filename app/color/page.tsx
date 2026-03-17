"use client";

import { useState } from "react";

import AdSlot from "../components/AdSlot";

interface RGB {
  r: number;
  g: number;
  b: number;
}

interface HSL {
  h: number;
  s: number;
  l: number;
}

function hexToRgb(hex: string): RGB | null {
  const clean = hex.replace(/^#/, "");
  let fullHex = clean;
  if (clean.length === 3) {
    fullHex = clean
      .split("")
      .map((c) => c + c)
      .join("");
  }
  if (fullHex.length !== 6) return null;
  const num = parseInt(fullHex, 16);
  if (isNaN(num)) return null;
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

function rgbToHex(rgb: RGB): string {
  return (
    "#" +
    [rgb.r, rgb.g, rgb.b]
      .map((c) => Math.max(0, Math.min(255, Math.round(c))).toString(16).padStart(2, "0"))
      .join("")
  );
}

function rgbToHsl(rgb: RGB): HSL {
  const r = rgb.r / 255;
  const g = rgb.g / 255;
  const b = rgb.b / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  let h = 0;
  let s = 0;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

function hslToRgb(hsl: HSL): RGB {
  const h = hsl.h / 360;
  const s = hsl.s / 100;
  const l = hsl.l / 100;

  if (s === 0) {
    const val = Math.round(l * 255);
    return { r: val, g: val, b: val };
  }

  function hue2rgb(p: number, q: number, t: number) {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  }

  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;

  return {
    r: Math.round(hue2rgb(p, q, h + 1 / 3) * 255),
    g: Math.round(hue2rgb(p, q, h) * 255),
    b: Math.round(hue2rgb(p, q, h - 1 / 3) * 255),
  };
}

export default function ColorConverterPage() {
  const [hex, setHex] = useState("#3b82f6");
  const [rgb, setRgb] = useState<RGB>({ r: 59, g: 130, b: 246 });
  const [hsl, setHsl] = useState<HSL>({ h: 217, s: 91, l: 60 });

  function updateFromHex(value: string) {
    setHex(value);
    const parsed = hexToRgb(value);
    if (parsed) {
      setRgb(parsed);
      setHsl(rgbToHsl(parsed));
    }
  }

  function updateFromRgb(newRgb: RGB) {
    setRgb(newRgb);
    setHex(rgbToHex(newRgb));
    setHsl(rgbToHsl(newRgb));
  }

  function updateFromHsl(newHsl: HSL) {
    setHsl(newHsl);
    const newRgb = hslToRgb(newHsl);
    setRgb(newRgb);
    setHex(rgbToHex(newRgb));
  }

  function copyText(text: string) {
    navigator.clipboard.writeText(text);
  }

  const hexString = hex.startsWith("#") ? hex : "#" + hex;
  const rgbString = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
  const hslString = `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">Color Converter</h1>
        <p className="text-[var(--text-secondary)] text-sm">
          Convert colors between HEX, RGB, and HSL formats with a live preview.
        </p>
      </div>

      {/* Color preview */}
      <div
        className="w-full h-32 rounded-xl border border-[var(--border)] mb-6"
        style={{ backgroundColor: hexString }}
      />

      <div className="grid gap-6 sm:grid-cols-3">
        {/* HEX */}
        <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] p-4">
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-medium text-[var(--accent)]">
              HEX
            </label>
            <button
              onClick={() => copyText(hexString)}
              className="text-xs text-[var(--text-secondary)] hover:text-white transition-colors"
            >
              Copy
            </button>
          </div>
          <input
            type="text"
            value={hex}
            onChange={(e) => updateFromHex(e.target.value)}
            placeholder="#3b82f6"
            className="font-mono"
          />
          <div className="mt-2">
            <input
              type="color"
              value={hexToRgb(hex) ? rgbToHex(hexToRgb(hex)!) : "#3b82f6"}
              onChange={(e) => updateFromHex(e.target.value)}
              className="w-full h-10 rounded cursor-pointer border-0 p-0"
            />
          </div>
        </div>

        {/* RGB */}
        <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] p-4">
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-medium text-[var(--accent)]">
              RGB
            </label>
            <button
              onClick={() => copyText(rgbString)}
              className="text-xs text-[var(--text-secondary)] hover:text-white transition-colors"
            >
              Copy
            </button>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <label className="text-xs w-4 text-[var(--text-secondary)]">R</label>
              <input
                type="number"
                min={0}
                max={255}
                value={rgb.r}
                onChange={(e) =>
                  updateFromRgb({ ...rgb, r: parseInt(e.target.value) || 0 })
                }
                className="font-mono text-sm"
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs w-4 text-[var(--text-secondary)]">G</label>
              <input
                type="number"
                min={0}
                max={255}
                value={rgb.g}
                onChange={(e) =>
                  updateFromRgb({ ...rgb, g: parseInt(e.target.value) || 0 })
                }
                className="font-mono text-sm"
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs w-4 text-[var(--text-secondary)]">B</label>
              <input
                type="number"
                min={0}
                max={255}
                value={rgb.b}
                onChange={(e) =>
                  updateFromRgb({ ...rgb, b: parseInt(e.target.value) || 0 })
                }
                className="font-mono text-sm"
              />
            </div>
          </div>
          <div className="mt-2 text-xs text-[var(--text-secondary)] font-mono">
            {rgbString}
          </div>
        </div>

        {/* HSL */}
        <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] p-4">
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-medium text-[var(--accent)]">
              HSL
            </label>
            <button
              onClick={() => copyText(hslString)}
              className="text-xs text-[var(--text-secondary)] hover:text-white transition-colors"
            >
              Copy
            </button>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <label className="text-xs w-4 text-[var(--text-secondary)]">H</label>
              <input
                type="number"
                min={0}
                max={360}
                value={hsl.h}
                onChange={(e) =>
                  updateFromHsl({ ...hsl, h: parseInt(e.target.value) || 0 })
                }
                className="font-mono text-sm"
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs w-4 text-[var(--text-secondary)]">S</label>
              <input
                type="number"
                min={0}
                max={100}
                value={hsl.s}
                onChange={(e) =>
                  updateFromHsl({ ...hsl, s: parseInt(e.target.value) || 0 })
                }
                className="font-mono text-sm"
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs w-4 text-[var(--text-secondary)]">L</label>
              <input
                type="number"
                min={0}
                max={100}
                value={hsl.l}
                onChange={(e) =>
                  updateFromHsl({ ...hsl, l: parseInt(e.target.value) || 0 })
                }
                className="font-mono text-sm"
              />
            </div>
          </div>
          <div className="mt-2 text-xs text-[var(--text-secondary)] font-mono">
            {hslString}
          </div>
        </div>
      </div>

      <AdSlot className="mt-8" />

      <section className="mt-10 text-sm text-[var(--text-secondary)] space-y-2">
        <h2 className="text-lg font-semibold text-white">
          About Color Formats
        </h2>
        <p>
          HEX uses hexadecimal values (#RRGGBB), RGB uses red/green/blue
          channels (0-255), and HSL uses hue (0-360), saturation (0-100%),
          and lightness (0-100%). Each format has advantages for different
          use cases in web development and design.
        </p>
      </section>
    </>
  );
}
