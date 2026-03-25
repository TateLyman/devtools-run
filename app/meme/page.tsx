"use client";
import { useState, useRef } from "react";

export default function MemePage() {
  const [topText, setTopText] = useState("WHEN THE");
  const [bottomText, setBottomText] = useState("CODE WORKS FIRST TRY");
  const [imgUrl, setImgUrl] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  function generate() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    canvas.width = 500;
    canvas.height = 500;
    ctx.fillStyle = "#1a1a2e";
    ctx.fillRect(0, 0, 500, 500);
    
    // Draw text
    ctx.fillStyle = "white";
    ctx.strokeStyle = "black";
    ctx.lineWidth = 3;
    ctx.font = "bold 36px Impact, sans-serif";
    ctx.textAlign = "center";
    
    // Top text
    ctx.strokeText(topText.toUpperCase(), 250, 50);
    ctx.fillText(topText.toUpperCase(), 250, 50);
    
    // Bottom text
    ctx.strokeText(bottomText.toUpperCase(), 250, 480);
    ctx.fillText(bottomText.toUpperCase(), 250, 480);
    
    // Center placeholder
    ctx.fillStyle = "#333";
    ctx.fillRect(50, 80, 400, 370);
    ctx.fillStyle = "#666";
    ctx.font = "16px sans-serif";
    ctx.fillText("Upload an image or use as-is", 250, 265);
  }

  function download() {
    generate();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = "meme.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-3xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-extrabold mb-2 text-center">Meme Generator</h1>
        <p className="text-gray-400 text-center mb-8">Create memes with top/bottom text. Download as PNG.</p>
        <div className="bg-gray-900 rounded-xl p-6 mb-6 space-y-3">
          <input type="text" value={topText} onChange={e => setTopText(e.target.value)} placeholder="Top text"
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white font-bold text-center text-lg" />
          <input type="text" value={bottomText} onChange={e => setBottomText(e.target.value)} placeholder="Bottom text"
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white font-bold text-center text-lg" />
          <div className="flex gap-2">
            <button onClick={generate} className="flex-1 bg-gray-700 hover:bg-gray-600 py-2 rounded-lg font-bold text-sm">Preview</button>
            <button onClick={download} className="flex-1 bg-purple-600 hover:bg-purple-700 py-2 rounded-lg font-bold text-sm">Download</button>
          </div>
        </div>
        <div className="flex justify-center mb-8">
          <canvas ref={canvasRef} width={500} height={500} className="rounded-xl border border-gray-700 max-w-full" />
        </div>
        <div className="text-center text-gray-500 text-sm">
          <a href="/qr" className="text-purple-400 hover:underline">QR Code</a>{" | "}
          <a href="/emoji" className="text-purple-400 hover:underline">Emoji</a>{" | "}
          <a href="/favicon" className="text-purple-400 hover:underline">Favicon</a>{" | "}
          <a href="/gradient" className="text-purple-400 hover:underline">Gradients</a>{" | "}
          <a href="/placeholder" className="text-purple-400 hover:underline">Placeholders</a>
        </div>
      </div>
    </div>
  );
}
