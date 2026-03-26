"use client";
import { useState, useRef, useEffect } from "react";

const CODE128_START_B = 104;
const CODE128_STOP = 106;
const PATTERNS: number[][] = [
  [2,1,2,2,2,2],[2,2,2,1,2,2],[2,2,2,2,2,1],[1,2,1,2,2,3],[1,2,1,3,2,2],
  [1,3,1,2,2,2],[1,2,2,2,1,3],[1,2,2,3,1,2],[1,3,2,2,1,2],[2,2,1,2,1,3],
  [2,2,1,3,1,2],[2,3,1,2,1,2],[1,1,2,2,3,2],[1,2,2,1,3,2],[1,2,2,2,3,1],
  [1,1,3,2,2,2],[1,2,3,1,2,2],[1,2,3,2,2,1],[2,2,3,2,1,1],[2,2,1,1,3,2],
  [2,2,1,2,3,1],[2,1,3,2,1,2],[2,2,3,1,1,2],[3,1,2,1,3,1],[3,1,1,2,2,2],
  [3,2,1,1,2,2],[3,2,1,2,2,1],[3,1,2,2,1,2],[3,2,2,1,1,2],[3,2,2,2,1,1],
  [2,1,2,1,2,3],[2,1,2,3,2,1],[2,3,2,1,2,1],[1,1,1,3,2,3],[1,3,1,1,2,3],
  [1,3,1,3,2,1],[1,1,2,3,1,3],[1,3,2,1,1,3],[1,3,2,3,1,1],[2,1,1,3,1,3],
  [2,3,1,1,1,3],[2,3,1,3,1,1],[1,1,2,1,3,3],[1,1,2,3,3,1],[1,3,2,1,3,1],
  [1,1,3,1,2,3],[1,1,3,3,2,1],[1,3,3,1,2,1],[3,1,3,1,2,1],[2,1,1,3,3,1],
  [2,3,1,1,3,1],[2,1,3,1,1,3],[2,1,3,3,1,1],[2,1,3,1,3,1],[3,1,1,1,2,3],
  [3,1,1,3,2,1],[3,3,1,1,2,1],[3,1,2,1,1,3],[3,1,2,3,1,1],[3,3,2,1,1,1],
  [3,1,4,1,1,1],[2,2,1,4,1,1],[4,3,1,1,1,1],[1,1,1,2,2,4],[1,1,1,4,2,2],
  [1,2,1,1,2,4],[1,2,1,4,2,1],[1,4,1,1,2,2],[1,4,1,2,2,1],[1,1,2,2,1,4],
  [1,1,2,4,1,2],[1,2,2,1,1,4],[1,2,2,4,1,1],[1,4,2,1,1,2],[1,4,2,2,1,1],
  [2,4,1,2,1,1],[2,2,1,1,1,4],[4,1,3,1,1,1],[2,4,1,1,1,2],[1,3,4,1,1,1],
  [1,1,1,2,4,2],[1,2,1,1,4,2],[1,2,1,2,4,1],[1,1,4,2,1,2],[1,2,4,1,1,2],
  [1,2,4,2,1,1],[4,1,1,2,1,2],[4,2,1,1,1,2],[4,2,1,2,1,1],[2,1,2,1,4,1],
  [2,1,4,1,2,1],[4,1,2,1,2,1],[1,1,1,1,4,3],[1,1,1,3,4,1],[1,3,1,1,4,1],
  [1,1,4,1,1,3],[1,1,4,3,1,1],[4,1,1,1,1,3],[4,1,1,3,1,1],[1,1,3,1,4,1],
  [1,1,4,1,3,1],[3,1,1,1,4,1],[4,1,1,1,3,1],[2,1,1,4,1,2],[2,1,1,2,1,4],
  [2,1,1,2,3,2],[2,3,3,1,1,1,2],
];
const STOP_PAT = [2,3,3,1,1,1,2];

export default function BarcodeGen() {
  const [text, setText] = useState("Hello World");
  const [barWidth, setBarWidth] = useState(2);
  const [height, setHeight] = useState(100);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !text) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const values: number[] = [CODE128_START_B];
    for (let i = 0; i < text.length; i++) {
      const code = text.charCodeAt(i) - 32;
      if (code < 0 || code > 94) continue;
      values.push(code);
    }
    let checksum = values[0];
    for (let i = 1; i < values.length; i++) checksum += values[i] * i;
    checksum %= 103;
    values.push(checksum);

    const patterns = values.map(v => PATTERNS[v]);
    patterns.push(STOP_PAT);

    let totalWidth = 20;
    patterns.forEach(p => p.forEach(w => totalWidth += w * barWidth));
    totalWidth += 20;

    canvas.width = totalWidth;
    canvas.height = height + 30;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    let x = 10;
    patterns.forEach(pattern => {
      pattern.forEach((w, i) => {
        if (i % 2 === 0) { ctx.fillStyle = "#000000"; ctx.fillRect(x, 5, w * barWidth, height); }
        x += w * barWidth;
      });
    });

    ctx.fillStyle = "#000000";
    ctx.font = "14px monospace";
    ctx.textAlign = "center";
    ctx.fillText(text, canvas.width / 2, height + 22);
  }, [text, barWidth, height]);

  const download = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const a = document.createElement("a");
    a.download = `barcode-${text}.png`;
    a.href = canvas.toDataURL("image/png");
    a.click();
  };

  const copy = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const blob = await new Promise<Blob | null>(r => canvas.toBlob(r));
    if (blob) navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
  };

  return (
    <div className="space-y-6">
      <section className="text-center">
        <h1 className="text-4xl font-bold mb-2">Barcode Generator</h1>
        <p className="text-[var(--text-secondary)]">Generate Code 128 barcodes. Download as PNG.</p>
      </section>

      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-6 space-y-4">
        <div>
          <label className="text-sm text-[var(--text-secondary)] block mb-1">Barcode Data</label>
          <input value={text} onChange={e => setText(e.target.value)} className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg px-3 py-2 font-mono" placeholder="Enter text or numbers" />
        </div>
        <div className="flex gap-4">
          <div>
            <label className="text-sm text-[var(--text-secondary)] block mb-1">Bar Width: {barWidth}px</label>
            <input type="range" min={1} max={5} value={barWidth} onChange={e => setBarWidth(Number(e.target.value))} />
          </div>
          <div>
            <label className="text-sm text-[var(--text-secondary)] block mb-1">Height: {height}px</label>
            <input type="range" min={40} max={200} value={height} onChange={e => setHeight(Number(e.target.value))} />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 flex justify-center">
        <canvas ref={canvasRef} />
      </div>

      <div className="flex gap-2 justify-center">
        <button onClick={download} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-bold text-sm">Download PNG</button>
        <button onClick={copy} className="bg-[var(--bg-secondary)] border border-[var(--border)] hover:bg-[var(--bg-primary)] px-6 py-2 rounded-lg text-sm font-bold">Copy to Clipboard</button>
      </div>
    </div>
  );
}
