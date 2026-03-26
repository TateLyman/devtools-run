"use client";
import { useState, useRef } from "react";

function extractColors(canvas: HTMLCanvasElement, count: number): string[] {
  const ctx = canvas.getContext("2d")!;
  const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
  const colors: Record<string, number> = {};
  
  for (let i = 0; i < data.length; i += 16) {
    const r = Math.round(data[i] / 32) * 32;
    const g = Math.round(data[i + 1] / 32) * 32;
    const b = Math.round(data[i + 2] / 32) * 32;
    const key = `${r},${g},${b}`;
    colors[key] = (colors[key] || 0) + 1;
  }

  return Object.entries(colors)
    .sort(([, a], [, b]) => b - a)
    .slice(0, count)
    .map(([c]) => {
      const [r, g, b] = c.split(",").map(Number);
      return "#" + [r, g, b].map(v => Math.min(v, 255).toString(16).padStart(2, "0")).join("");
    });
}

export default function ImageColors() {
  const [colors, setColors] = useState<string[]>([]);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const canvas = canvasRef.current!;
        const scale = Math.min(200 / img.width, 200 / img.height, 1);
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        canvas.getContext("2d")!.drawImage(img, 0, 0, canvas.width, canvas.height);
        setColors(extractColors(canvas, 8));
        setImageUrl(reader.result as string);
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  };

  const copy = (c: string) => { navigator.clipboard.writeText(c); setCopied(c); setTimeout(() => setCopied(""), 1000); };

  return (
    <div className="space-y-6">
      <section className="text-center">
        <h1 className="text-4xl font-bold mb-2">Extract Colors from Image</h1>
        <p className="text-[var(--text-secondary)]">Upload an image to extract its color palette</p>
      </section>

      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-8 text-center">
        <input type="file" accept="image/*" onChange={handleFile} className="hidden" id="fileInput" />
        <label htmlFor="fileInput" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-bold cursor-pointer inline-block">
          Upload Image
        </label>
        <p className="text-xs text-[var(--text-secondary)] mt-2">Your image is processed locally. Nothing is uploaded.</p>
      </div>

      <canvas ref={canvasRef} className="hidden" />

      {imageUrl && (
        <div className="flex justify-center">
          <img src={imageUrl} alt="Uploaded" className="max-h-64 rounded-xl border border-[var(--border)]" />
        </div>
      )}

      {colors.length > 0 && (
        <>
          <div className="flex gap-1 rounded-xl overflow-hidden h-20">
            {colors.map((c, i) => (
              <button key={i} onClick={() => copy(c)} className="flex-1 hover:scale-y-110 transition-transform cursor-pointer" style={{ backgroundColor: c }} title={c} />
            ))}
          </div>

          <div className="grid gap-2 md:grid-cols-4">
            {colors.map((c, i) => (
              <div key={i} onClick={() => copy(c)} className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-3 flex items-center gap-3 cursor-pointer hover:border-blue-500/50">
                <div className="w-10 h-10 rounded-lg border border-[var(--border)]" style={{ backgroundColor: c }} />
                <div>
                  <div className="font-mono text-sm font-bold">{c.toUpperCase()}</div>
                  <div className="text-xs text-[var(--text-secondary)]">
                    {(() => { const r = parseInt(c.slice(1, 3), 16); const g = parseInt(c.slice(3, 5), 16); const b = parseInt(c.slice(5, 7), 16); return `rgb(${r}, ${g}, ${b})`; })()}
                  </div>
                </div>
                {copied === c && <span className="text-xs text-emerald-400 ml-auto">Copied!</span>}
              </div>
            ))}
          </div>

          <div className="flex justify-center">
            <button onClick={() => copy(colors.join(", "))} className="bg-[var(--bg-secondary)] border border-[var(--border)] hover:bg-[var(--bg-primary)] px-4 py-2 rounded-lg text-sm font-bold">
              Copy All Colors
            </button>
          </div>
        </>
      )}
    </div>
  );
}
