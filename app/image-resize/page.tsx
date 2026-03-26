"use client";
import { useState, useRef } from "react";
export default function ImageResize() {
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [width, setWidth] = useState(800);
  const [height, setHeight] = useState(600);
  const [lock, setLock] = useState(true);
  const [ratio, setRatio] = useState(800/600);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    const i = new Image();
    i.onload = () => { setImg(i); setWidth(i.width); setHeight(i.height); setRatio(i.width / i.height); };
    i.src = URL.createObjectURL(file);
  };

  const updateW = (w: number) => { setWidth(w); if (lock) setHeight(Math.round(w / ratio)); };
  const updateH = (h: number) => { setHeight(h); if (lock) setWidth(Math.round(h * ratio)); };

  const download = () => {
    if (!img) return;
    const c = canvasRef.current!; c.width = width; c.height = height;
    c.getContext("2d")!.drawImage(img, 0, 0, width, height);
    const a = document.createElement("a"); a.download = `resized-${width}x${height}.png`; a.href = c.toDataURL("image/png"); a.click();
  };

  return (
    <div className="space-y-6">
      <canvas ref={canvasRef} className="hidden" />
      <section className="text-center"><h1 className="text-4xl font-bold mb-2">Image Resizer</h1><p className="text-[var(--text-secondary)]">Resize images locally in your browser</p></section>
      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-6 text-center">
        <input type="file" accept="image/*" onChange={handleFile} className="hidden" id="img-input" />
        <label htmlFor="img-input" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-bold cursor-pointer">Upload Image</label>
      </div>
      {img && (<>
        <div className="flex justify-center"><img src={img.src} alt="Preview" className="max-h-48 rounded-xl border border-[var(--border)]" /></div>
        <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-4">
          <div className="flex gap-4 items-center justify-center">
            <div><label className="text-xs text-[var(--text-secondary)]">Width</label><input type="number" value={width} onChange={e => updateW(Number(e.target.value))} className="w-24 bg-[var(--bg-primary)] border border-[var(--border)] rounded px-2 py-1 font-mono text-sm" /></div>
            <label className="text-xs"><input type="checkbox" checked={lock} onChange={e => setLock(e.target.checked)} className="mr-1" />Lock</label>
            <div><label className="text-xs text-[var(--text-secondary)]">Height</label><input type="number" value={height} onChange={e => updateH(Number(e.target.value))} className="w-24 bg-[var(--bg-primary)] border border-[var(--border)] rounded px-2 py-1 font-mono text-sm" /></div>
          </div>
          <div className="flex gap-2 justify-center mt-3">{[[1920,1080,"Full HD"],[1280,720,"HD"],[800,600,"800x600"],[512,512,"Square"],[256,256,"Thumb"]].map(([w,h,n]) => (<button key={n as string} onClick={() => { setWidth(w as number); setHeight(h as number); setRatio((w as number)/(h as number)); }} className="bg-[var(--bg-primary)] border border-[var(--border)] px-2 py-1 rounded text-xs">{n as string}</button>))}</div>
        </div>
        <div className="flex justify-center"><button onClick={download} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-bold">Download {width}x{height}</button></div>
      </>)}
    </div>
  );
}
