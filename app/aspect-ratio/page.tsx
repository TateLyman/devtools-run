"use client";

import { useState, useCallback } from "react";

const PRESETS = [
  { label: "16:9", w: 16, h: 9 },
  { label: "4:3", w: 4, h: 3 },
  { label: "1:1", w: 1, h: 1 },
  { label: "21:9", w: 21, h: 9 },
  { label: "9:16", w: 9, h: 16 },
  { label: "3:2", w: 3, h: 2 },
  { label: "2:1", w: 2, h: 1 },
];

function gcd(a: number, b: number): number {
  a = Math.abs(Math.round(a));
  b = Math.abs(Math.round(b));
  while (b) {
    const t = b;
    b = a % b;
    a = t;
  }
  return a;
}

function simplifyRatio(w: number, h: number): string {
  if (!w || !h) return "--";
  const d = gcd(w, h);
  return `${Math.round(w / d)}:${Math.round(h / d)}`;
}

export default function AspectRatioPage() {
  // Mode 1: Calculate dimension from ratio
  const [width, setWidth] = useState("1920");
  const [selectedRatio, setSelectedRatio] = useState(0); // index into PRESETS
  const [calcMode, setCalcMode] = useState<"height" | "width">("height");

  const preset = PRESETS[selectedRatio];
  const calculatedHeight =
    calcMode === "height" && width
      ? Math.round((Number(width) * preset.h) / preset.w)
      : 0;
  const calculatedWidth =
    calcMode === "width" && width
      ? Math.round((Number(width) * preset.w) / preset.h)
      : 0;

  // Mode 2: Find ratio from dimensions
  const [dimW, setDimW] = useState("");
  const [dimH, setDimH] = useState("");
  const detectedRatio =
    dimW && dimH ? simplifyRatio(Number(dimW), Number(dimH)) : "--";

  // Common resolutions for quick reference
  const commonResolutions = [
    { label: "1080p", w: 1920, h: 1080 },
    { label: "720p", w: 1280, h: 720 },
    { label: "4K", w: 3840, h: 2160 },
    { label: "1440p", w: 2560, h: 1440 },
    { label: "Instagram", w: 1080, h: 1080 },
    { label: "Story", w: 1080, h: 1920 },
    { label: "iPad", w: 2048, h: 1536 },
    { label: "Ultrawide", w: 3440, h: 1440 },
  ];

  const applyResolution = useCallback((w: number, h: number) => {
    setDimW(String(w));
    setDimH(String(h));
  }, []);

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">Aspect Ratio Calculator</h1>
        <p className="text-[var(--text-secondary)] text-sm">
          Calculate dimensions from an aspect ratio, or find the ratio of any
          two dimensions. Runs entirely in your browser.
        </p>
      </div>

      <div className="ad-slot mb-6">
        <span>Ad Space</span>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Calculator Mode */}
        <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] p-5">
          <h2 className="font-semibold text-white mb-4">
            Calculate from Ratio
          </h2>

          <label className="block text-sm font-medium mb-2">Aspect Ratio</label>
          <div className="flex flex-wrap gap-2 mb-4">
            {PRESETS.map((p, i) => (
              <button
                key={p.label}
                onClick={() => setSelectedRatio(i)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  selectedRatio === i
                    ? "bg-[var(--accent)] text-white"
                    : "bg-[var(--bg-tertiary)] border border-[var(--border)] hover:border-[var(--accent)]"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setCalcMode("height")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                calcMode === "height"
                  ? "bg-[var(--accent)] text-white"
                  : "bg-[var(--bg-tertiary)] border border-[var(--border)]"
              }`}
            >
              Width &rarr; Height
            </button>
            <button
              onClick={() => setCalcMode("width")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                calcMode === "width"
                  ? "bg-[var(--accent)] text-white"
                  : "bg-[var(--bg-tertiary)] border border-[var(--border)]"
              }`}
            >
              Height &rarr; Width
            </button>
          </div>

          <label className="block text-sm font-medium mb-2">
            {calcMode === "height" ? "Width (px)" : "Height (px)"}
          </label>
          <input
            type="number"
            value={width}
            onChange={(e) => setWidth(e.target.value)}
            placeholder="1920"
          />

          <div className="mt-4 p-4 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border)]">
            <div className="text-sm text-[var(--text-secondary)] mb-1">
              {calcMode === "height" ? "Calculated Height" : "Calculated Width"}
            </div>
            <div className="text-3xl font-bold font-mono text-[var(--accent)]">
              {calcMode === "height"
                ? calculatedHeight > 0
                  ? `${calculatedHeight}px`
                  : "--"
                : calculatedWidth > 0
                  ? `${calculatedWidth}px`
                  : "--"}
            </div>
            {width && Number(width) > 0 && (
              <div className="text-sm text-[var(--text-secondary)] mt-2">
                {calcMode === "height"
                  ? `${width} x ${calculatedHeight}`
                  : `${calculatedWidth} x ${width}`}{" "}
                ({preset.label})
              </div>
            )}
          </div>

          {/* Visual preview */}
          {width && Number(width) > 0 && (
            <div className="mt-4 flex justify-center">
              <div
                className="border-2 border-[var(--accent)] rounded bg-[var(--accent)]/10"
                style={{
                  width: `${Math.min(200, 200)}px`,
                  aspectRatio: `${preset.w} / ${preset.h}`,
                  maxHeight: "150px",
                }}
              />
            </div>
          )}
        </div>

        {/* Detect Mode */}
        <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] p-5">
          <h2 className="font-semibold text-white mb-4">Detect Ratio</h2>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Width (px)
              </label>
              <input
                type="number"
                value={dimW}
                onChange={(e) => setDimW(e.target.value)}
                placeholder="1920"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Height (px)
              </label>
              <input
                type="number"
                value={dimH}
                onChange={(e) => setDimH(e.target.value)}
                placeholder="1080"
              />
            </div>
          </div>

          <div className="p-4 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border)]">
            <div className="text-sm text-[var(--text-secondary)] mb-1">
              Aspect Ratio
            </div>
            <div className="text-3xl font-bold font-mono text-[var(--accent)]">
              {detectedRatio}
            </div>
            {dimW && dimH && Number(dimW) > 0 && Number(dimH) > 0 && (
              <div className="text-sm text-[var(--text-secondary)] mt-2">
                {dimW} x {dimH} pixels
              </div>
            )}
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium mb-2">
              Common Resolutions
            </label>
            <div className="grid grid-cols-2 gap-2">
              {commonResolutions.map((r) => (
                <button
                  key={r.label}
                  onClick={() => applyResolution(r.w, r.h)}
                  className="px-3 py-2 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border)] hover:border-[var(--accent)] text-xs font-medium transition-colors text-left"
                >
                  <span className="text-white">{r.label}</span>
                  <span className="text-[var(--text-secondary)] ml-1">
                    {r.w}x{r.h}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="ad-slot mt-8">
        <span>Ad Space</span>
      </div>

      <section className="mt-10 text-sm text-[var(--text-secondary)] space-y-2">
        <h2 className="text-lg font-semibold text-white">
          About Aspect Ratio Calculator
        </h2>
        <p>
          Calculate dimensions from common aspect ratios like 16:9, 4:3, 1:1,
          21:9, and 9:16. Enter any two dimensions to detect the aspect ratio.
          Useful for designers, video editors, and web developers working with
          responsive layouts.
        </p>
      </section>
    </>
  );
}
