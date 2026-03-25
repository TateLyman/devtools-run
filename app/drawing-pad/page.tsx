"use client";
import { useState, useRef, useEffect } from "react";

export default function DrawingPad() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [drawing, setDrawing] = useState(false);
  const [color, setColor] = useState("#ffffff");
  const [size, setSize] = useState(3);
  const [tool, setTool] = useState<"pen" | "eraser">("pen");
  const lastPos = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = canvas.offsetWidth;
    canvas.height = 500;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "#1a1a2e";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  const getPos = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
    return { x: clientX - rect.left, y: clientY - rect.top };
  };

  const startDraw = (e: React.MouseEvent | React.TouchEvent) => {
    setDrawing(true);
    lastPos.current = getPos(e);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!drawing || !lastPos.current) return;
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const pos = getPos(e);
    ctx.beginPath();
    ctx.moveTo(lastPos.current.x, lastPos.current.y);
    ctx.lineTo(pos.x, pos.y);
    ctx.strokeStyle = tool === "eraser" ? "#1a1a2e" : color;
    ctx.lineWidth = tool === "eraser" ? size * 5 : size;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.stroke();
    lastPos.current = pos;
  };

  const stopDraw = () => { setDrawing(false); lastPos.current = null; };

  const clear = () => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "#1a1a2e";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  const download = () => {
    const canvas = canvasRef.current!;
    const a = document.createElement("a");
    a.download = "drawing.png";
    a.href = canvas.toDataURL("image/png");
    a.click();
  };

  const colors = ["#ffffff", "#ef4444", "#f97316", "#eab308", "#22c55e", "#3b82f6", "#8b5cf6", "#ec4899", "#000000"];

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold mb-2">Drawing Pad</h1>
        <p className="text-[var(--text-secondary)]">Draw anything. Free online drawing tool. Choose colors, brush size. Download as PNG. Works on mobile too.</p>
      </div>
      <div className="flex gap-2 flex-wrap items-center">
        <div className="flex gap-1">
          {colors.map((c) => (
            <button key={c} onClick={() => { setColor(c); setTool("pen"); }} className={`w-7 h-7 rounded-full border-2 ${color === c && tool === "pen" ? "border-white scale-110" : "border-transparent"}`} style={{ backgroundColor: c }} />
          ))}
          <input type="color" value={color} onChange={(e) => { setColor(e.target.value); setTool("pen"); }} className="w-7 h-7 rounded cursor-pointer" />
        </div>
        <div className="flex gap-1">
          <button onClick={() => setTool("pen")} className={`px-2 py-1 rounded text-xs ${tool === "pen" ? "bg-purple-600 text-white" : "bg-[var(--bg-secondary)] text-gray-400"}`}>Pen</button>
          <button onClick={() => setTool("eraser")} className={`px-2 py-1 rounded text-xs ${tool === "eraser" ? "bg-purple-600 text-white" : "bg-[var(--bg-secondary)] text-gray-400"}`}>Eraser</button>
        </div>
        <input type="range" min={1} max={20} value={size} onChange={(e) => setSize(Number(e.target.value))} className="w-20 accent-purple-500" />
        <button onClick={clear} className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white rounded text-xs">Clear</button>
        <button onClick={download} className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded text-xs font-bold">Download PNG</button>
      </div>
      <canvas ref={canvasRef} className="w-full rounded-lg border border-[var(--border)] cursor-crosshair touch-none" style={{ height: "500px" }}
        onMouseDown={startDraw} onMouseMove={draw} onMouseUp={stopDraw} onMouseLeave={stopDraw}
        onTouchStart={startDraw} onTouchMove={draw} onTouchEnd={stopDraw} />
    </div>
  );
}
