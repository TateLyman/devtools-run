"use client";
import { useState, useRef, useEffect } from "react";

export default function OGImageGenerator() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [title, setTitle] = useState("My Awesome Blog Post");
  const [subtitle, setSubtitle] = useState("A guide to building something amazing");
  const [author, setAuthor] = useState("DevTools.run");
  const [bgColor1, setBgColor1] = useState("#1a1a2e");
  const [bgColor2, setBgColor2] = useState("#6366f1");
  const [textColor, setTextColor] = useState("#ffffff");
  const [template, setTemplate] = useState<"gradient" | "minimal" | "bold" | "dark">("gradient");

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = 1200;
    canvas.height = 630;
    const ctx = canvas.getContext("2d")!;

    // Background
    if (template === "gradient") {
      const gradient = ctx.createLinearGradient(0, 0, 1200, 630);
      gradient.addColorStop(0, bgColor1);
      gradient.addColorStop(1, bgColor2);
      ctx.fillStyle = gradient;
    } else if (template === "minimal") {
      ctx.fillStyle = "#ffffff";
    } else if (template === "bold") {
      ctx.fillStyle = bgColor2;
    } else {
      ctx.fillStyle = "#0f0f1a";
    }
    ctx.fillRect(0, 0, 1200, 630);

    // Pattern overlay for gradient
    if (template === "gradient" || template === "dark") {
      ctx.fillStyle = "rgba(255,255,255,0.03)";
      for (let i = 0; i < 20; i++) {
        ctx.fillRect(0, i * 32, 1200, 1);
      }
    }

    // Text
    const tc = template === "minimal" ? "#1a1a2e" : textColor;

    // Title
    ctx.fillStyle = tc;
    ctx.font = "bold 56px Arial, sans-serif";
    ctx.textBaseline = "middle";

    // Word wrap title
    const maxWidth = 1000;
    const words = title.split(" ");
    const lines: string[] = [];
    let currentLine = "";
    for (const word of words) {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      if (ctx.measureText(testLine).width > maxWidth) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    }
    lines.push(currentLine);

    const lineHeight = 68;
    const startY = 200 - ((lines.length - 1) * lineHeight) / 2;
    lines.forEach((line, i) => {
      ctx.fillText(line, 100, startY + i * lineHeight);
    });

    // Subtitle
    if (subtitle) {
      ctx.fillStyle = template === "minimal" ? "#666666" : "rgba(255,255,255,0.7)";
      ctx.font = "28px Arial, sans-serif";
      ctx.fillText(subtitle, 100, startY + lines.length * lineHeight + 20);
    }

    // Author
    if (author) {
      ctx.fillStyle = template === "minimal" ? "#999999" : "rgba(255,255,255,0.5)";
      ctx.font = "22px Arial, sans-serif";
      ctx.fillText(author, 100, 560);
    }

    // Accent line
    if (template === "gradient" || template === "dark") {
      ctx.fillStyle = bgColor2;
      ctx.fillRect(100, startY - 50, 80, 4);
    } else if (template === "bold") {
      ctx.fillStyle = "rgba(255,255,255,0.3)";
      ctx.fillRect(100, startY - 50, 80, 4);
    }
  };

  useEffect(() => { draw(); }, [title, subtitle, author, bgColor1, bgColor2, textColor, template]);

  const download = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const a = document.createElement("a");
    a.download = "og-image.png";
    a.href = canvas.toDataURL("image/png");
    a.click();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">OG Image Generator</h1>
        <p className="text-[var(--text-secondary)]">
          Create Open Graph images for your blog posts and social media. 4 templates, customizable colors. Download as PNG (1200x630).
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-3">
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded px-3 py-2 text-white text-sm" />
          <input value={subtitle} onChange={(e) => setSubtitle(e.target.value)} placeholder="Subtitle" className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded px-3 py-2 text-white text-sm" />
          <input value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="Author / Site Name" className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded px-3 py-2 text-white text-sm" />

          <div className="flex gap-2">
            {(["gradient", "minimal", "bold", "dark"] as const).map((t) => (
              <button key={t} onClick={() => setTemplate(t)} className={`flex-1 py-1.5 rounded text-xs capitalize ${template === t ? "bg-purple-600 text-white" : "bg-[var(--bg-secondary)] text-gray-400"}`}>{t}</button>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="text-xs text-gray-400">Color 1</label>
              <input type="color" value={bgColor1} onChange={(e) => setBgColor1(e.target.value)} className="w-full h-8 rounded cursor-pointer" />
            </div>
            <div>
              <label className="text-xs text-gray-400">Color 2</label>
              <input type="color" value={bgColor2} onChange={(e) => setBgColor2(e.target.value)} className="w-full h-8 rounded cursor-pointer" />
            </div>
            <div>
              <label className="text-xs text-gray-400">Text</label>
              <input type="color" value={textColor} onChange={(e) => setTextColor(e.target.value)} className="w-full h-8 rounded cursor-pointer" />
            </div>
          </div>

          <button onClick={download} className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-3 rounded font-bold">Download PNG (1200×630)</button>
        </div>

        <div className="lg:col-span-2">
          <canvas ref={canvasRef} className="w-full rounded border border-[var(--border)]" style={{ aspectRatio: "1200/630" }} />
          <p className="text-xs text-gray-500 mt-1 text-center">1200 × 630px — optimal size for Facebook, Twitter, LinkedIn</p>
        </div>
      </div>
    </div>
  );
}
