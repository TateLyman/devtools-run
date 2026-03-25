"use client";
import { useRef, useState, useEffect } from "react";

export default function WhiteboardPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [drawing, setDrawing] = useState(false);
  const [color, setColor] = useState("#6c5ce7");
  const [size, setSize] = useState(3);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    ctx.fillStyle = "#1a1a2e";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  const getPos = (e: React.MouseEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    return rect ? { x: e.clientX - rect.left, y: e.clientY - rect.top } : { x: 0, y: 0 };
  };

  const start = (e: React.MouseEvent) => {
    setDrawing(true);
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    const { x, y } = getPos(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent) => {
    if (!drawing) return;
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    const { x, y } = getPos(e);
    ctx.strokeStyle = color;
    ctx.lineWidth = size;
    ctx.lineCap = "round";
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stop = () => setDrawing(false);
  const clear = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (canvas && ctx) { ctx.fillStyle = "#1a1a2e"; ctx.fillRect(0, 0, canvas.width, canvas.height); }
  };
  const download = () => {
    const link = document.createElement("a");
    link.download = "whiteboard.png";
    link.href = canvasRef.current?.toDataURL("image/png") || "";
    link.click();
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-extrabold mb-4 text-center">Whiteboard</h1>
        <div className="flex items-center gap-3 mb-3">
          <input type="color" value={color} onChange={e=>setColor(e.target.value)} className="w-8 h-8 rounded cursor-pointer" />
          {[1,3,6,10].map(s=><button key={s} onClick={()=>setSize(s)} className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${size===s?"border-purple-400":"border-gray-600"}`}><div className="rounded-full bg-white" style={{width:s*2,height:s*2}} /></button>)}
          <button onClick={()=>setColor("#1a1a2e")} className="px-3 py-1 bg-gray-800 hover:bg-gray-700 rounded text-xs font-bold">Eraser</button>
          <button onClick={clear} className="px-3 py-1 bg-red-600/20 hover:bg-red-600/40 text-red-400 rounded text-xs font-bold">Clear</button>
          <button onClick={download} className="px-3 py-1 bg-purple-600 hover:bg-purple-700 rounded text-xs font-bold">Save PNG</button>
        </div>
        <canvas ref={canvasRef} onMouseDown={start} onMouseMove={draw} onMouseUp={stop} onMouseLeave={stop}
          className="w-full rounded-xl border border-gray-700 cursor-crosshair" style={{height:"60vh"}} />
        <div className="mt-4 text-center text-gray-500 text-sm">
          <a href="/meme" className="text-purple-400 hover:underline">Meme Gen</a>{" | "}
          <a href="/favicon" className="text-purple-400 hover:underline">Favicon</a>{" | "}
          <a href="/notes" className="text-purple-400 hover:underline">Notes</a>{" | "}
          <a href="/" className="text-purple-400 hover:underline">All Tools</a>
        </div>
      </div>
    </div>
  );
}
