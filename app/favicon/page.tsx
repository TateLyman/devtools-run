"use client";
import { useState, useRef } from "react";

export default function FaviconPage() {
  const [text, setText] = useState("A");
  const [bg, setBg] = useState("#6c5ce7");
  const [fg, setFg] = useState("#ffffff");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  function generate() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    canvas.width = 64;
    canvas.height = 64;
    ctx.fillStyle = bg;
    ctx.beginPath();
    ctx.roundRect(0, 0, 64, 64, 12);
    ctx.fill();
    ctx.fillStyle = fg;
    ctx.font = "bold 36px -apple-system, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text.slice(0, 2), 32, 34);
  }

  function download() {
    generate();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = "favicon.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-3xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-extrabold mb-2 text-center">Favicon Generator</h1>
        <p className="text-gray-400 text-center mb-8">Create a simple letter-based favicon for your website.</p>
        <div className="bg-gray-900 rounded-xl p-6 mb-6">
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div>
              <label className="text-xs text-gray-400 block mb-1">Letter(s)</label>
              <input type="text" value={text} onChange={e => setText(e.target.value)} maxLength={2}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white text-xl font-bold text-center" />
            </div>
            <div>
              <label className="text-xs text-gray-400 block mb-1">Background</label>
              <div className="flex gap-2 items-center">
                <input type="color" value={bg} onChange={e => setBg(e.target.value)} className="w-10 h-10 rounded cursor-pointer" />
                <input type="text" value={bg} onChange={e => setBg(e.target.value)}
                  className="bg-gray-800 border border-gray-700 rounded px-2 py-1 text-sm font-mono flex-1" />
              </div>
            </div>
            <div>
              <label className="text-xs text-gray-400 block mb-1">Text Color</label>
              <div className="flex gap-2 items-center">
                <input type="color" value={fg} onChange={e => setFg(e.target.value)} className="w-10 h-10 rounded cursor-pointer" />
                <input type="text" value={fg} onChange={e => setFg(e.target.value)}
                  className="bg-gray-800 border border-gray-700 rounded px-2 py-1 text-sm font-mono flex-1" />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex-shrink-0">
              <canvas ref={canvasRef} width={64} height={64} className="rounded-xl border border-gray-700" />
            </div>
            <div className="flex gap-2">
              <button onClick={generate} className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg font-bold text-sm">Preview</button>
              <button onClick={download} className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg font-bold text-sm">Download PNG</button>
            </div>
          </div>
        </div>
        <div className="text-center text-gray-500 text-sm">
          <a href="/gradient" className="text-purple-400 hover:underline">Gradients</a>{" | "}
          <a href="/color" className="text-purple-400 hover:underline">Colors</a>{" | "}
          <a href="/meta-tags" className="text-purple-400 hover:underline">Meta Tags</a>{" | "}
          <a href="/qr" className="text-purple-400 hover:underline">QR Code</a>{" | "}
          <a href="/json" className="text-purple-400 hover:underline">JSON</a>
        </div>
      </div>
    </div>
  );
}
