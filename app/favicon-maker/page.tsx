"use client";
import { useState, useRef, useEffect } from "react";

export default function FaviconMaker() {
  const [mode, setMode] = useState<"emoji" | "text">("emoji");
  const [emoji, setEmoji] = useState("🚀");
  const [text, setText] = useState("AB");
  const [bg, setBg] = useState("#3b82f6");
  const [fg, setFg] = useState("#ffffff");
  const [rounded, setRounded] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const sizes = [16, 32, 48, 64, 128, 256];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const size = 256;
    canvas.width = size; canvas.height = size;
    
    ctx.clearRect(0, 0, size, size);
    
    if (rounded) {
      ctx.beginPath();
      const r = size * 0.15;
      ctx.moveTo(r, 0); ctx.lineTo(size - r, 0); ctx.quadraticCurveTo(size, 0, size, r);
      ctx.lineTo(size, size - r); ctx.quadraticCurveTo(size, size, size - r, size);
      ctx.lineTo(r, size); ctx.quadraticCurveTo(0, size, 0, size - r);
      ctx.lineTo(0, r); ctx.quadraticCurveTo(0, 0, r, 0);
      ctx.closePath(); ctx.clip();
    }

    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, size, size);

    if (mode === "emoji") {
      ctx.font = `${size * 0.65}px serif`;
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText(emoji, size / 2, size / 2 + size * 0.05);
    } else {
      ctx.fillStyle = fg;
      const fontSize = text.length <= 2 ? size * 0.5 : text.length <= 4 ? size * 0.35 : size * 0.25;
      ctx.font = `bold ${fontSize}px -apple-system, sans-serif`;
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText(text.slice(0, 4), size / 2, size / 2 + size * 0.03);
    }
  }, [mode, emoji, text, bg, fg, rounded]);

  const download = (targetSize: number) => {
    const canvas = canvasRef.current!;
    const temp = document.createElement("canvas");
    temp.width = targetSize; temp.height = targetSize;
    temp.getContext("2d")!.drawImage(canvas, 0, 0, targetSize, targetSize);
    const a = document.createElement("a");
    a.download = `favicon-${targetSize}x${targetSize}.png`;
    a.href = temp.toDataURL("image/png");
    a.click();
  };

  const quickEmojis = ["🚀","💡","⚡","🔥","✨","🎯","💎","🎨","📱","🌍","🎮","🛠️","📊","🏠","❤️","🌟"];

  return (
    <div className="space-y-6">
      <section className="text-center">
        <h1 className="text-4xl font-bold mb-2">Favicon Generator</h1>
        <p className="text-[var(--text-secondary)]">Create favicons from emoji or text</p>
      </section>

      <div className="flex justify-center gap-2">
        <button onClick={() => setMode("emoji")} className={`px-4 py-2 rounded-lg text-sm font-bold ${mode === "emoji" ? "bg-blue-600 text-white" : "bg-[var(--bg-secondary)] border border-[var(--border)]"}`}>Emoji</button>
        <button onClick={() => setMode("text")} className={`px-4 py-2 rounded-lg text-sm font-bold ${mode === "text" ? "bg-blue-600 text-white" : "bg-[var(--bg-secondary)] border border-[var(--border)]"}`}>Text</button>
      </div>

      <div className="flex justify-center">
        <canvas ref={canvasRef} className="w-32 h-32 md:w-48 md:h-48 border border-[var(--border)] rounded-xl" />
      </div>

      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-6 space-y-3">
        {mode === "emoji" ? (
          <>
            <div>
              <label className="text-sm text-[var(--text-secondary)] block mb-1">Emoji</label>
              <input value={emoji} onChange={e => setEmoji(e.target.value)} className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded px-3 py-2 text-2xl text-center" maxLength={2} />
            </div>
            <div className="flex flex-wrap gap-2 justify-center">
              {quickEmojis.map(e => (
                <button key={e} onClick={() => setEmoji(e)} className={`text-2xl p-1 rounded hover:bg-[var(--bg-primary)] ${emoji === e ? "bg-blue-600/20" : ""}`}>{e}</button>
              ))}
            </div>
          </>
        ) : (
          <div>
            <label className="text-sm text-[var(--text-secondary)] block mb-1">Text (1-4 chars)</label>
            <input value={text} onChange={e => setText(e.target.value)} maxLength={4} className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded px-3 py-2 font-mono text-xl text-center" />
          </div>
        )}
        <div className="flex gap-4 items-center justify-center">
          <div><label className="text-xs text-[var(--text-secondary)]">Background</label><input type="color" value={bg} onChange={e => setBg(e.target.value)} className="block w-10 h-10 rounded cursor-pointer" /></div>
          {mode === "text" && <div><label className="text-xs text-[var(--text-secondary)]">Text Color</label><input type="color" value={fg} onChange={e => setFg(e.target.value)} className="block w-10 h-10 rounded cursor-pointer" /></div>}
          <label className="text-sm"><input type="checkbox" checked={rounded} onChange={e => setRounded(e.target.checked)} className="mr-1" />Rounded</label>
        </div>
      </div>

      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-6">
        <h2 className="font-bold text-lg mb-3">Download</h2>
        <div className="flex flex-wrap gap-2 justify-center">
          {sizes.map(s => (
            <button key={s} onClick={() => download(s)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-bold">
              {s}x{s}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
