"use client";
import { useState, useRef } from "react";

export default function ImageCompressPage() {
  const [original, setOriginal] = useState<{ size: number; url: string } | null>(null);
  const [compressed, setCompressed] = useState<{ size: number; url: string } | null>(null);
  const [quality, setQuality] = useState(70);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setOriginal({ size: file.size, url: URL.createObjectURL(file) });
    const img = new Image();
    img.onload = () => compress(img);
    img.src = URL.createObjectURL(file);
  }

  function compress(img: HTMLImageElement) {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext("2d");
    ctx?.drawImage(img, 0, 0);
    canvas.toBlob(blob => {
      if (blob) setCompressed({ size: blob.size, url: URL.createObjectURL(blob) });
    }, "image/jpeg", quality / 100);
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-3xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-extrabold mb-2 text-center">Image Compressor</h1>
        <p className="text-gray-400 text-center mb-8">Compress images in your browser. Nothing uploaded to any server.</p>
        <div className="bg-gray-900 rounded-xl p-6 mb-6 text-center">
          <input type="file" accept="image/*" onChange={handleFile} className="mb-4" />
          <div className="mb-4">
            <label className="text-xs text-gray-400">Quality: {quality}%</label>
            <input type="range" min="10" max="100" value={quality} onChange={e=>setQuality(parseInt(e.target.value))} className="w-full" />
          </div>
          {original && compressed && (
            <div className="grid grid-cols-2 gap-4 text-center">
              <div><div className="text-sm text-gray-400">Original</div><div className="font-bold">{(original.size/1024).toFixed(0)} KB</div></div>
              <div><div className="text-sm text-gray-400">Compressed</div><div className="font-bold text-green-400">{(compressed.size/1024).toFixed(0)} KB</div><div className="text-xs text-green-400">-{Math.round((1-compressed.size/original.size)*100)}%</div></div>
            </div>
          )}
          {compressed && (
            <a href={compressed.url} download="compressed.jpg" className="inline-block mt-4 bg-purple-600 hover:bg-purple-700 px-6 py-2 rounded-lg font-bold text-sm">Download Compressed</a>
          )}
        </div>
        <canvas ref={canvasRef} className="hidden" />
        <div className="text-center text-gray-500 text-sm">
          <a href="/favicon" className="text-purple-400 hover:underline">Favicon</a>{" | "}
          <a href="/placeholder" className="text-purple-400 hover:underline">Placeholder</a>{" | "}
          <a href="/qr" className="text-purple-400 hover:underline">QR Code</a>{" | "}
          <a href="/" className="text-purple-400 hover:underline">All Tools</a>
        </div>
      </div>
    </div>
  );
}
