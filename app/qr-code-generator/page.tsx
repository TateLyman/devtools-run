"use client";
import { useState, useEffect, useRef } from "react";

// Simple QR code generation using canvas
function drawQR(canvas: HTMLCanvasElement, text: string, size: number) {
  const ctx = canvas.getContext("2d")!;
  canvas.width = size;
  canvas.height = size;
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, size, size);

  // Use a simple encoding with QR API (fallback to pattern if no text)
  if (!text.trim()) {
    ctx.fillStyle = "#e5e7eb";
    ctx.fillRect(0, 0, size, size);
    ctx.fillStyle = "#9ca3af";
    ctx.font = "14px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("Enter text to generate QR", size / 2, size / 2);
    return;
  }

  // Create QR using external API as image
  const img = new Image();
  img.crossOrigin = "anonymous";
  img.onload = () => {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, size, size);
    ctx.drawImage(img, 0, 0, size, size);
  };
  img.src = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(text)}`;
}

export default function QRCodeGenerator() {
  const [text, setText] = useState("");
  const [size, setSize] = useState(256);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [imgSrc, setImgSrc] = useState("");

  useEffect(() => {
    if (text.trim()) {
      setImgSrc(`https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(text)}`);
    } else {
      setImgSrc("");
    }
  }, [text, size]);

  const download = () => {
    if (!imgSrc) return;
    const a = document.createElement("a");
    a.href = imgSrc;
    a.download = "qr-code.png";
    a.click();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">QR Code Generator</h1>
        <p className="text-[var(--text-secondary)]">
          Generate QR codes from text or URLs. Adjustable size, instant preview, download as PNG. Free online QR code maker.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter text or URL to encode..."
            className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded px-4 py-3 text-white h-32 resize-none text-sm"
          />

          <div>
            <label className="block text-sm mb-1">Size: {size}x{size}px</label>
            <input type="range" min={128} max={512} step={32} value={size} onChange={(e) => setSize(Number(e.target.value))} className="w-full accent-purple-500" />
          </div>

          <div className="flex gap-2 flex-wrap">
            {["https://devtools.run", "Hello World!", "https://t.me/solscanitbot"].map((t) => (
              <button key={t} onClick={() => setText(t)} className="px-2 py-1 rounded text-xs bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-white">{t.length > 25 ? t.slice(0, 25) + "..." : t}</button>
            ))}
          </div>

          <button onClick={download} disabled={!imgSrc} className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white px-4 py-3 rounded font-bold">
            Download PNG
          </button>
        </div>

        <div className="flex items-center justify-center">
          <div className="bg-white p-4 rounded-lg">
            {imgSrc ? (
              <img src={imgSrc} alt="QR Code" width={size} height={size} className="max-w-full" />
            ) : (
              <div className="flex items-center justify-center text-gray-400" style={{ width: size, height: size }}>
                Enter text to generate QR code
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
