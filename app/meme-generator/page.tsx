"use client";
import { useState, useRef, useEffect } from "react";

const memeTemplates = [
  { id: "drake", name: "Drake Hotline", top: "No:", bottom: "Yes:", color: "#000" },
  { id: "brain", name: "Expanding Brain", top: "Small brain:", bottom: "Galaxy brain:", color: "#000" },
  { id: "button", name: "Two Buttons", top: "Option A", bottom: "Option B", color: "#000" },
  { id: "distracted", name: "Distracted BF", top: "Me:", bottom: "New shiny thing:", color: "#fff" },
  { id: "change", name: "Change My Mind", top: "", bottom: "Statement here", color: "#000" },
];

export default function MemeGenerator() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [topText, setTopText] = useState("When the code works");
  const [bottomText, setBottomText] = useState("On the first try");
  const [fontSize, setFontSize] = useState(36);
  const [textColor, setTextColor] = useState("#ffffff");
  const [bgColor, setBgColor] = useState("#1a1a2e");
  const [image, setImage] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = 600;
    canvas.height = 600;
    const ctx = canvas.getContext("2d")!;

    // Background
    if (image) {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0, 600, 600);
        drawText(ctx);
      };
      img.src = image;
    } else {
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, 600, 600);
      drawText(ctx);
    }
  };

  const drawText = (ctx: CanvasRenderingContext2D) => {
    ctx.font = `bold ${fontSize}px Impact, sans-serif`;
    ctx.textAlign = "center";
    ctx.strokeStyle = "#000";
    ctx.lineWidth = fontSize / 10;
    ctx.fillStyle = textColor;

    // Top text
    if (topText) {
      ctx.strokeText(topText.toUpperCase(), 300, fontSize + 10);
      ctx.fillText(topText.toUpperCase(), 300, fontSize + 10);
    }

    // Bottom text
    if (bottomText) {
      ctx.strokeText(bottomText.toUpperCase(), 300, 590 - 10);
      ctx.fillText(bottomText.toUpperCase(), 300, 590 - 10);
    }
  };

  useEffect(() => { draw(); }, [topText, bottomText, fontSize, textColor, bgColor, image]);

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => setImage(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const download = () => {
    draw();
    setTimeout(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const a = document.createElement("a");
      a.download = "meme.png";
      a.href = canvas.toDataURL("image/png");
      a.click();
    }, 100);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Meme Generator</h1>
        <p className="text-[var(--text-secondary)]">
          Create memes with custom text. Upload your own image or use a solid background. Impact font, outline text. Download as PNG.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-3">
          <input value={topText} onChange={(e) => setTopText(e.target.value)} placeholder="Top text" className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded px-4 py-2.5 text-white" />
          <input value={bottomText} onChange={(e) => setBottomText(e.target.value)} placeholder="Bottom text" className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded px-4 py-2.5 text-white" />

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs text-gray-400 mb-1">Font Size: {fontSize}px</label>
              <input type="range" min={16} max={72} value={fontSize} onChange={(e) => setFontSize(Number(e.target.value))} className="w-full accent-purple-500" />
            </div>
            <div className="flex gap-2 items-end">
              <div><label className="block text-xs text-gray-400 mb-1">Text</label><input type="color" value={textColor} onChange={(e) => setTextColor(e.target.value)} className="w-full h-8 rounded cursor-pointer" /></div>
              <div><label className="block text-xs text-gray-400 mb-1">BG</label><input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="w-full h-8 rounded cursor-pointer" /></div>
            </div>
          </div>

          <div className="flex gap-2">
            <button onClick={() => fileRef.current?.click()} className="flex-1 bg-[var(--bg-secondary)] border border-[var(--border)] rounded px-3 py-2 text-sm text-gray-400 hover:text-white">{image ? "Change Image" : "Upload Image"}</button>
            {image && <button onClick={() => setImage(null)} className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 rounded text-sm">Remove</button>}
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
          </div>

          <button onClick={download} className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-3 rounded font-bold">Download Meme (PNG)</button>
        </div>

        <div>
          <canvas ref={canvasRef} className="w-full rounded-lg border border-[var(--border)]" style={{ aspectRatio: "1" }} />
        </div>
      </div>
    </div>
  );
}
