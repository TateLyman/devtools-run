"use client";
import { useState, useRef, useCallback } from "react";

export default function PixelArt() {
  const [gridSize, setGridSize] = useState(16);
  const [color, setColor] = useState("#6366f1");
  const [grid, setGrid] = useState<string[][]>(() =>
    Array.from({ length: 16 }, () => Array(16).fill("transparent"))
  );
  const [tool, setTool] = useState<"draw" | "erase" | "fill" | "pick">("draw");
  const [drawing, setDrawing] = useState(false);
  const [history, setHistory] = useState<string[][][]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const saveHistory = () => setHistory((h) => [...h.slice(-20), grid.map((r) => [...r])]);

  const paint = useCallback(
    (r: number, c: number) => {
      setGrid((prev) => {
        const next = prev.map((row) => [...row]);
        if (tool === "draw") next[r][c] = color;
        else if (tool === "erase") next[r][c] = "transparent";
        else if (tool === "pick") {
          setColor(prev[r][c] === "transparent" ? "#ffffff" : prev[r][c]);
          return prev;
        } else if (tool === "fill") {
          const target = prev[r][c];
          if (target === color) return prev;
          const fill = (r: number, c: number) => {
            if (r < 0 || r >= gridSize || c < 0 || c >= gridSize) return;
            if (next[r][c] !== target) return;
            next[r][c] = color;
            fill(r + 1, c);
            fill(r - 1, c);
            fill(r, c + 1);
            fill(r, c - 1);
          };
          fill(r, c);
        }
        return next;
      });
    },
    [color, tool, gridSize]
  );

  const undo = () => {
    if (history.length === 0) return;
    setGrid(history[history.length - 1]);
    setHistory((h) => h.slice(0, -1));
  };

  const clear = () => {
    saveHistory();
    setGrid(Array.from({ length: gridSize }, () => Array(gridSize).fill("transparent")));
  };

  const resize = (size: number) => {
    setGridSize(size);
    setGrid(Array.from({ length: size }, () => Array(size).fill("transparent")));
    setHistory([]);
  };

  const exportPNG = () => {
    const canvas = document.createElement("canvas");
    const scale = Math.max(1, Math.floor(512 / gridSize));
    canvas.width = gridSize * scale;
    canvas.height = gridSize * scale;
    const ctx = canvas.getContext("2d")!;
    grid.forEach((row, r) =>
      row.forEach((cell, c) => {
        if (cell !== "transparent") {
          ctx.fillStyle = cell;
          ctx.fillRect(c * scale, r * scale, scale, scale);
        }
      })
    );
    const a = document.createElement("a");
    a.download = "pixel-art.png";
    a.href = canvas.toDataURL("image/png");
    a.click();
  };

  const presetColors = ["#ef4444", "#f97316", "#eab308", "#22c55e", "#3b82f6", "#6366f1", "#a855f7", "#ec4899", "#ffffff", "#000000", "#6b7280", "#92400e"];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Pixel Art Editor</h1>
        <p className="text-[var(--text-secondary)]">
          Create pixel art in your browser. Draw, fill, pick colors, undo, and export as PNG. Free, no signup.
        </p>
      </div>

      <div className="flex flex-wrap gap-2 items-center">
        <div className="flex gap-1">
          {(["draw", "erase", "fill", "pick"] as const).map((t) => (
            <button key={t} onClick={() => setTool(t)} className={`px-3 py-1.5 rounded text-sm capitalize ${tool === t ? "bg-purple-600 text-white" : "bg-[var(--bg-secondary)] text-[var(--text-secondary)]"}`}>{t}</button>
          ))}
        </div>

        <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="w-8 h-8 rounded cursor-pointer" />

        <select value={gridSize} onChange={(e) => resize(Number(e.target.value))} className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded px-2 py-1.5 text-white text-sm">
          {[8, 16, 24, 32, 48, 64].map((s) => <option key={s} value={s}>{s}x{s}</option>)}
        </select>

        <button onClick={undo} className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1.5 rounded text-sm">Undo</button>
        <button onClick={clear} className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1.5 rounded text-sm">Clear</button>
        <button onClick={exportPNG} className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1.5 rounded text-sm font-bold">Export PNG</button>
      </div>

      <div className="flex gap-1 flex-wrap">
        {presetColors.map((c) => (
          <button
            key={c}
            onClick={() => setColor(c)}
            className={`w-7 h-7 rounded border-2 ${color === c ? "border-white" : "border-transparent"}`}
            style={{ backgroundColor: c }}
          />
        ))}
      </div>

      <div
        className="inline-grid border border-[var(--border)] rounded overflow-hidden"
        style={{
          gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
          width: `min(100%, ${gridSize * 24}px)`,
          aspectRatio: "1",
        }}
        onMouseLeave={() => setDrawing(false)}
      >
        {grid.flatMap((row, r) =>
          row.map((cell, c) => (
            <div
              key={`${r}-${c}`}
              className="border border-gray-800/20 cursor-crosshair hover:opacity-80"
              style={{ backgroundColor: cell === "transparent" ? undefined : cell }}
              onMouseDown={() => { saveHistory(); setDrawing(true); paint(r, c); }}
              onMouseEnter={() => drawing && paint(r, c)}
              onMouseUp={() => setDrawing(false)}
            />
          ))
        )}
      </div>
    </div>
  );
}
