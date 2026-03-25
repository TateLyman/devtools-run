"use client";
import { useState, useRef, useEffect } from "react";

export default function ImageCropper() {
  const [image, setImage] = useState<string | null>(null);
  const [cropX, setCropX] = useState(0);
  const [cropY, setCropY] = useState(0);
  const [cropW, setCropW] = useState(300);
  const [cropH, setCropH] = useState(300);
  const [aspect, setAspect] = useState<string>("free");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [imgEl, setImgEl] = useState<HTMLImageElement | null>(null);

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => { setImgEl(img); setCropW(Math.min(300, img.width)); setCropH(Math.min(300, img.height)); };
      img.src = e.target?.result as string;
      setImage(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const aspects: Record<string, number | null> = { free: null, "1:1": 1, "16:9": 16/9, "9:16": 9/16, "4:3": 4/3, "3:2": 3/2 };

  const setAspectRatio = (name: string) => {
    setAspect(name);
    const ratio = aspects[name];
    if (ratio && imgEl) { const w = Math.min(cropW, imgEl.width); setCropW(w); setCropH(Math.round(w / ratio)); }
  };

  const download = () => {
    if (!imgEl) return;
    const canvas = document.createElement("canvas");
    canvas.width = cropW;
    canvas.height = cropH;
    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(imgEl, cropX, cropY, cropW, cropH, 0, 0, cropW, cropH);
    const a = document.createElement("a");
    a.download = `cropped-${cropW}x${cropH}.png`;
    a.href = canvas.toDataURL("image/png");
    a.click();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Image Cropper</h1>
        <p className="text-[var(--text-secondary)]">Crop images online. Set position and size, choose aspect ratio. Download cropped image as PNG. Free, no upload to server.</p>
      </div>
      <div className="max-w-2xl mx-auto space-y-4">
        <div className="bg-[var(--bg-secondary)] border-2 border-dashed border-[var(--border)] rounded-xl p-8 text-center cursor-pointer hover:border-purple-500/50" onClick={() => fileRef.current?.click()} onDrop={(e) => { e.preventDefault(); e.dataTransfer.files[0] && handleFile(e.dataTransfer.files[0]); }} onDragOver={(e) => e.preventDefault()}>
          {image ? <img src={image} alt="Preview" className="max-h-64 mx-auto rounded" /> : <p className="text-gray-400">Drop image here or click to upload</p>}
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
        </div>
        {imgEl && (
          <>
            <div className="text-xs text-gray-400 text-center">Image: {imgEl.width} × {imgEl.height}px</div>
            <div className="flex gap-2 flex-wrap justify-center">
              {Object.keys(aspects).map((a) => (
                <button key={a} onClick={() => setAspectRatio(a)} className={`px-3 py-1 rounded text-xs ${aspect === a ? "bg-purple-600 text-white" : "bg-[var(--bg-secondary)] text-gray-400"}`}>{a}</button>
              ))}
            </div>
            <div className="grid grid-cols-4 gap-2">
              <div><label className="block text-[10px] text-gray-400">X</label><input type="number" value={cropX} onChange={(e) => setCropX(Math.max(0, Number(e.target.value)))} className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded px-2 py-1 text-white text-xs font-mono" /></div>
              <div><label className="block text-[10px] text-gray-400">Y</label><input type="number" value={cropY} onChange={(e) => setCropY(Math.max(0, Number(e.target.value)))} className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded px-2 py-1 text-white text-xs font-mono" /></div>
              <div><label className="block text-[10px] text-gray-400">Width</label><input type="number" value={cropW} onChange={(e) => setCropW(Math.max(1, Number(e.target.value)))} className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded px-2 py-1 text-white text-xs font-mono" /></div>
              <div><label className="block text-[10px] text-gray-400">Height</label><input type="number" value={cropH} onChange={(e) => setCropH(Math.max(1, Number(e.target.value)))} className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded px-2 py-1 text-white text-xs font-mono" /></div>
            </div>
            <button onClick={download} className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-3 rounded-lg font-bold">Download Cropped ({cropW}×{cropH})</button>
          </>
        )}
      </div>
    </div>
  );
}
