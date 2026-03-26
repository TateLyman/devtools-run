"use client";
import { useState } from "react";

export default function PlaceholderImage() {
  const [width, setWidth] = useState(600);
  const [height, setHeight] = useState(400);
  const [grayscale, setGrayscale] = useState(false);
  const [blur, setBlur] = useState(0);
  const [seed, setSeed] = useState("");

  let url = `https://picsum.photos${seed ? `/seed/${seed}` : ""}/${width}/${height}`;
  const params: string[] = [];
  if (grayscale) params.push("grayscale");
  if (blur > 0) params.push(`blur=${blur}`);
  if (params.length) url += `?${params.join("&")}`;

  const htmlTag = `<img src="${url}" alt="placeholder" width="${width}" height="${height}" />`;
  const mdTag = `![placeholder](${url})`;
  const cssTag = `background-image: url('${url}');`;

  const copy = (t: string) => navigator.clipboard.writeText(t);

  const presets = [
    { name: "Card", w: 400, h: 300 }, { name: "Banner", w: 1200, h: 400 },
    { name: "Square", w: 500, h: 500 }, { name: "Avatar", w: 150, h: 150 },
    { name: "Thumbnail", w: 200, h: 200 }, { name: "Hero", w: 1920, h: 1080 },
  ];

  return (
    <div className="space-y-6">
      <section className="text-center">
        <h1 className="text-4xl font-bold mb-2">Placeholder Image Generator</h1>
        <p className="text-[var(--text-secondary)]">Generate placeholder images for development</p>
      </section>

      <div className="flex justify-center">
        <img src={url} alt="Placeholder" className="max-w-full rounded-xl border border-[var(--border)]" style={{ maxHeight: 400 }} key={url} />
      </div>

      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-6">
        <div className="grid gap-4 md:grid-cols-4">
          <div><label className="text-xs text-[var(--text-secondary)]">Width</label><input type="number" value={width} onChange={e => setWidth(Number(e.target.value))} min={10} max={4000} className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded px-2 py-1.5 font-mono text-sm" /></div>
          <div><label className="text-xs text-[var(--text-secondary)]">Height</label><input type="number" value={height} onChange={e => setHeight(Number(e.target.value))} min={10} max={4000} className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded px-2 py-1.5 font-mono text-sm" /></div>
          <div><label className="text-xs text-[var(--text-secondary)]">Seed (optional)</label><input value={seed} onChange={e => setSeed(e.target.value)} placeholder="any-text" className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded px-2 py-1.5 text-sm" /></div>
          <div className="flex flex-col gap-1">
            <label className="text-xs"><input type="checkbox" checked={grayscale} onChange={e => setGrayscale(e.target.checked)} className="mr-1" />Grayscale</label>
            <div><label className="text-xs text-[var(--text-secondary)]">Blur: {blur}</label><input type="range" min={0} max={10} value={blur} onChange={e => setBlur(Number(e.target.value))} className="w-full" /></div>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mt-3">
          {presets.map(p => <button key={p.name} onClick={() => { setWidth(p.w); setHeight(p.h); }} className="bg-[var(--bg-primary)] border border-[var(--border)] px-2 py-1 rounded text-xs hover:border-blue-500/50">{p.name} ({p.w}x{p.h})</button>)}
        </div>
      </div>

      <div className="space-y-2">
        {[["URL", url], ["HTML", htmlTag], ["Markdown", mdTag], ["CSS", cssTag]].map(([label, code]) => (
          <div key={label} className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-3 flex justify-between items-center cursor-pointer hover:border-blue-500/50" onClick={() => copy(code)}>
            <div><span className="text-xs text-[var(--text-secondary)] mr-2">{label}</span><code className="text-xs font-mono text-emerald-400 break-all">{code}</code></div>
            <span className="text-xs text-blue-400 shrink-0 ml-2">Copy</span>
          </div>
        ))}
      </div>
    </div>
  );
}
