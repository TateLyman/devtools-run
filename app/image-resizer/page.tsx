"use client";
import { useState, useRef } from "react";

export default function ImageResizer() {
  const [image, setImage] = useState<string | null>(null);
  const [origW, setOrigW] = useState(0);
  const [origH, setOrigH] = useState(0);
  const [width, setWidth] = useState(800);
  const [height, setHeight] = useState(600);
  const [lock, setLock] = useState(true);
  const [quality, setQuality] = useState(90);
  const [format, setFormat] = useState("image/jpeg");
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => { setOrigW(img.width); setOrigH(img.height); setWidth(img.width); setHeight(img.height); };
      img.src = e.target?.result as string;
      setImage(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const updateWidth = (w: number) => {
    setWidth(w);
    if (lock && origW > 0) setHeight(Math.round((w / origW) * origH));
  };

  const updateHeight = (h: number) => {
    setHeight(h);
    if (lock && origH > 0) setWidth(Math.round((h / origH) * origW));
  };

  const presets = [
    { label: "Instagram Post", w: 1080, h: 1080 },
    { label: "Instagram Story", w: 1080, h: 1920 },
    { label: "Twitter Header", w: 1500, h: 500 },
    { label: "Facebook Cover", w: 820, h: 312 },
    { label: "YouTube Thumb", w: 1280, h: 720 },
    { label: "LinkedIn Banner", w: 1584, h: 396 },
    { label: "OG Image", w: 1200, h: 630 },
    { label: "Favicon", w: 32, h: 32 },
  ];

  const download = () => {
    if (!image) return;
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d")!;
    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, 0, 0, width, height);
      const ext = format === "image/png" ? "png" : format === "image/webp" ? "webp" : "jpg";
      const a = document.createElement("a");
      a.download = `resized-${width}x${height}.${ext}`;
      a.href = canvas.toDataURL(format, quality / 100);
      a.click();
    };
    img.src = image;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Image Resizer</h1>
        <p className="text-[var(--text-secondary)]">Resize images online. Social media presets, custom dimensions, quality control. Download as JPG, PNG, or WebP. Free, no upload to server.</p>
      </div>

      <div className="max-w-2xl mx-auto space-y-4">
        <div className="bg-[var(--bg-secondary)] border-2 border-dashed border-[var(--border)] rounded-xl p-8 text-center cursor-pointer hover:border-purple-500/50" onClick={() => fileRef.current?.click()} onDrop={(e) => { e.preventDefault(); e.dataTransfer.files[0] && handleFile(e.dataTransfer.files[0]); }} onDragOver={(e) => e.preventDefault()}>
          {image ? <img src={image} alt="Preview" className="max-h-48 mx-auto rounded" /> : <p className="text-gray-400">Drop image here or click to upload</p>}
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
        </div>

        {image && (
          <>
            <div className="text-xs text-gray-400 text-center">Original: {origW} × {origH}px</div>

            <div className="flex gap-2 flex-wrap justify-center">
              {presets.map((p) => (
                <button key={p.label} onClick={() => { setWidth(p.w); setHeight(p.h); setLock(false); }} className="px-2 py-1 rounded text-[10px] bg-[var(--bg-secondary)] text-gray-400 hover:text-white">{p.label} ({p.w}×{p.h})</button>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-3 items-end">
              <div>
                <label className="block text-xs text-gray-400 mb-1">Width</label>
                <input type="number" value={width} onChange={(e) => updateWidth(Number(e.target.value))} className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded px-3 py-2 text-white text-sm font-mono" />
              </div>
              <div className="text-center">
                <button onClick={() => setLock(!lock)} className={`text-sm ${lock ? "text-purple-400" : "text-gray-500"}`}>{lock ? "🔗 Linked" : "🔓 Free"}</button>
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Height</label>
                <input type="number" value={height} onChange={(e) => updateHeight(Number(e.target.value))} className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded px-3 py-2 text-white text-sm font-mono" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-400 mb-1">Quality: {quality}%</label>
                <input type="range" min={10} max={100} value={quality} onChange={(e) => setQuality(Number(e.target.value))} className="w-full accent-purple-500" />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Format</label>
                <select value={format} onChange={(e) => setFormat(e.target.value)} className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded px-2 py-1.5 text-white text-sm">
                  <option value="image/jpeg">JPEG</option>
                  <option value="image/png">PNG</option>
                  <option value="image/webp">WebP</option>
                </select>
              </div>
            </div>

            <button onClick={download} className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-3 rounded-lg font-bold">Download Resized Image ({width}×{height})</button>
          </>
        )}
      </div>
    </div>
  );
}
