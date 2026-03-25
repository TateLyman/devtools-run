"use client";
import { useState, useRef, useCallback } from "react";

export default function TextToImage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [text, setText] = useState("Hello World!");
  const [fontSize, setFontSize] = useState(48);
  const [fontFamily, setFontFamily] = useState("Arial");
  const [textColor, setTextColor] = useState("#ffffff");
  const [bgColor, setBgColor] = useState("#6366f1");
  const [width, setWidth] = useState(800);
  const [height, setHeight] = useState(400);
  const [padding, setPadding] = useState(40);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d")!;

    // Background
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, width, height);

    // Text
    ctx.fillStyle = textColor;
    ctx.font = `bold ${fontSize}px ${fontFamily}`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    // Word wrap
    const maxWidth = width - padding * 2;
    const words = text.split(" ");
    const lines: string[] = [];
    let currentLine = "";

    for (const word of words) {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      if (ctx.measureText(testLine).width > maxWidth && currentLine) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    }
    lines.push(currentLine);

    const lineHeight = fontSize * 1.3;
    const startY = height / 2 - ((lines.length - 1) * lineHeight) / 2;

    lines.forEach((line, i) => {
      ctx.fillText(line, width / 2, startY + i * lineHeight);
    });
  }, [text, fontSize, fontFamily, textColor, bgColor, width, height, padding]);

  // Draw on mount and when props change
  useState(() => { setTimeout(draw, 100); });

  const download = () => {
    draw();
    setTimeout(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const a = document.createElement("a");
      a.download = "text-image.png";
      a.href = canvas.toDataURL("image/png");
      a.click();
    }, 50);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Text to Image Generator</h1>
        <p className="text-[var(--text-secondary)]">
          Convert text to PNG images. Customize font, color, size, and background. Perfect for social media, thumbnails, and banners.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <textarea
            value={text}
            onChange={(e) => { setText(e.target.value); setTimeout(draw, 50); }}
            placeholder="Enter your text..."
            className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded px-4 py-3 text-white h-24 resize-none text-sm"
          />

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-400 mb-1">Font Size: {fontSize}px</label>
              <input type="range" min={12} max={120} value={fontSize} onChange={(e) => { setFontSize(Number(e.target.value)); setTimeout(draw, 50); }} className="w-full accent-purple-500" />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Font</label>
              <select value={fontFamily} onChange={(e) => { setFontFamily(e.target.value); setTimeout(draw, 50); }} className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded px-2 py-1.5 text-white text-sm">
                {["Arial", "Georgia", "Courier New", "Times New Roman", "Verdana", "Impact", "Comic Sans MS"].map((f) => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-400 mb-1">Text Color</label>
              <div className="flex gap-2">
                <input type="color" value={textColor} onChange={(e) => { setTextColor(e.target.value); setTimeout(draw, 50); }} className="w-10 h-8 rounded cursor-pointer" />
                <input value={textColor} onChange={(e) => { setTextColor(e.target.value); setTimeout(draw, 50); }} className="flex-1 bg-[var(--bg-primary)] border border-[var(--border)] rounded px-2 py-1 text-white text-sm font-mono" />
              </div>
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Background</label>
              <div className="flex gap-2">
                <input type="color" value={bgColor} onChange={(e) => { setBgColor(e.target.value); setTimeout(draw, 50); }} className="w-10 h-8 rounded cursor-pointer" />
                <input value={bgColor} onChange={(e) => { setBgColor(e.target.value); setTimeout(draw, 50); }} className="flex-1 bg-[var(--bg-primary)] border border-[var(--border)] rounded px-2 py-1 text-white text-sm font-mono" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs text-gray-400 mb-1">Width</label>
              <input type="number" value={width} onChange={(e) => { setWidth(Number(e.target.value)); setTimeout(draw, 50); }} className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded px-2 py-1.5 text-white text-sm text-center" />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Height</label>
              <input type="number" value={height} onChange={(e) => { setHeight(Number(e.target.value)); setTimeout(draw, 50); }} className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded px-2 py-1.5 text-white text-sm text-center" />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Padding</label>
              <input type="number" value={padding} onChange={(e) => { setPadding(Number(e.target.value)); setTimeout(draw, 50); }} className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded px-2 py-1.5 text-white text-sm text-center" />
            </div>
          </div>

          <div className="flex gap-2 flex-wrap">
            {[
              { label: "Twitter Banner", w: 1500, h: 500 },
              { label: "Instagram", w: 1080, h: 1080 },
              { label: "YouTube Thumb", w: 1280, h: 720 },
              { label: "Facebook Cover", w: 820, h: 312 },
              { label: "OG Image", w: 1200, h: 630 },
            ].map((p) => (
              <button key={p.label} onClick={() => { setWidth(p.w); setHeight(p.h); setTimeout(draw, 50); }} className="px-2 py-1 rounded text-xs bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-white">{p.label}</button>
            ))}
          </div>

          <button onClick={download} className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-3 rounded font-bold">
            Download PNG
          </button>
        </div>

        <div>
          <label className="text-sm font-medium mb-1 block">Preview</label>
          <canvas ref={canvasRef} className="w-full rounded border border-[var(--border)]" style={{ maxHeight: "400px", objectFit: "contain" }} />
        </div>
      </div>
    </div>
  );
}
