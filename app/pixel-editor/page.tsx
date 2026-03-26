"use client";
import { useState, useRef } from "react";

export default function PixelEditor() {
  const [size, setSize] = useState(16);
  const [color, setColor] = useState("#3b82f6");
  const [grid, setGrid] = useState<string[][]>(() => Array.from({ length: 16 }, () => Array(16).fill("")));
  const [drawing, setDrawing] = useState(false);
  const [tool, setTool] = useState<"draw"|"erase">("draw");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const paint = (r: number, c: number) => {
    const g = grid.map(row => [...row]);
    g[r][c] = tool === "draw" ? color : "";
    setGrid(g);
  };

  const clear = () => setGrid(Array.from({ length: size }, () => Array(size).fill("")));

  const resize = (s: number) => {
    setSize(s);
    setGrid(Array.from({ length: s }, () => Array(s).fill("")));
  };

  const download = () => {
    const canvas = canvasRef.current!;
    const scale = 16;
    canvas.width = size * scale;
    canvas.height = size * scale;
    const ctx = canvas.getContext("2d")!;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    grid.forEach((row, r) => row.forEach((c, col) => {
      if (c) { ctx.fillStyle = c; ctx.fillRect(col * scale, r * scale, scale, scale); }
    }));
    const a = document.createElement("a");
    a.download = "pixel-art.png";
    a.href = canvas.toDataURL("image/png");
    a.click();
  };

  const cellSize = Math.min(Math.floor(400 / size), 32);
  const quickColors = ["#ef4444","#f97316","#eab308","#22c55e","#3b82f6","#8b5cf6","#ec4899","#000000","#ffffff","#6b7280"];

  return (
    <div className="space-y-4">
      <canvas ref={canvasRef} className="hidden" />
      <section className="text-center"><h1 className="text-4xl font-bold mb-1">Pixel Art Editor</h1><p className="text-sm text-[var(--text-secondary)]">Click to draw, right-click to erase</p></section>

      <div className="flex justify-center gap-2 items-center flex-wrap">
        <input type="color" value={color} onChange={e => setColor(e.target.value)} className="w-10 h-10 rounded cursor-pointer" />
        {quickColors.map(c => <button key={c} onClick={() => setColor(c)} className={`w-6 h-6 rounded border ${color === c ? "border-white scale-125" : "border-[var(--border)]"}`} style={{ backgroundColor: c }} />)}
        <button onClick={() => setTool(tool === "draw" ? "erase" : "draw")} className={`px-3 py-1 rounded text-xs font-bold ${tool === "erase" ? "bg-red-600 text-white" : "bg-blue-600 text-white"}`}>{tool === "draw" ? "Draw" : "Erase"}</button>
      </div>

      <div className="flex justify-center" onMouseLeave={() => setDrawing(false)}>
        <div className="inline-grid border border-[var(--border)]" style={{ gridTemplateColumns: `repeat(${size}, ${cellSize}px)` }}>
          {grid.map((row, r) => row.map((cell, c) => (
            <div key={`${r}-${c}`}
              onMouseDown={() => { setDrawing(true); paint(r, c); }}
              onMouseEnter={() => drawing && paint(r, c)}
              onMouseUp={() => setDrawing(false)}
              onContextMenu={e => { e.preventDefault(); const g = grid.map(row => [...row]); g[r][c] = ""; setGrid(g); }}
              className="border border-[var(--border)]/20 cursor-crosshair"
              style={{ width: cellSize, height: cellSize, backgroundColor: cell || "transparent" }} />
          )))}
        </div>
      </div>

      <div className="flex justify-center gap-2 flex-wrap">
        <select value={size} onChange={e => resize(Number(e.target.value))} className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded px-2 py-1 text-sm">
          {[8, 12, 16, 24, 32].map(s => <option key={s} value={s}>{s}x{s}</option>)}
        </select>
        <button onClick={download} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded text-sm font-bold">Download PNG</button>
        <button onClick={clear} className="bg-red-600/20 border border-red-600/30 text-red-400 px-4 py-1 rounded text-sm">Clear</button>
      </div>
    </div>
  );
}
