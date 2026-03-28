"use client";
import { useState, useRef, useEffect, useCallback } from "react";

interface TextBlock {
  id: string;
  text: string;
  x: number;
  y: number;
  fontSize: number;
  color: string;
  strokeColor: string;
  strokeWidth: number;
  font: string;
  bold: boolean;
  italic: boolean;
  uppercase: boolean;
  align: CanvasTextAlign;
  shadowBlur: number;
}

const defaultTop: TextBlock = {
  id: "top",
  text: "WHEN THE CODE WORKS",
  x: 300,
  y: 50,
  fontSize: 42,
  color: "#ffffff",
  strokeColor: "#000000",
  strokeWidth: 4,
  font: "Impact",
  bold: false,
  italic: false,
  uppercase: true,
  align: "center",
  shadowBlur: 0,
};

const defaultBottom: TextBlock = {
  id: "bottom",
  text: "ON THE FIRST TRY",
  x: 300,
  y: 550,
  fontSize: 42,
  color: "#ffffff",
  strokeColor: "#000000",
  strokeWidth: 4,
  font: "Impact",
  bold: false,
  italic: false,
  uppercase: true,
  align: "center",
  shadowBlur: 0,
};

export default function MemeGenerator() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [image, setImage] = useState<string | null>(null);
  const [bgColor, setBgColor] = useState("#1a1a2e");
  const [canvasW, setCanvasW] = useState(600);
  const [canvasH, setCanvasH] = useState(600);
  const [textBlocks, setTextBlocks] = useState<TextBlock[]>([defaultTop, defaultBottom]);
  const [selectedId, setSelectedId] = useState<string>("top");
  const [dragging, setDragging] = useState(false);

  const fonts = ["Impact", "Arial Black", "Comic Sans MS", "Georgia", "Courier New", "Times New Roman", "Verdana", "Trebuchet MS"];

  const drawText = useCallback((ctx: CanvasRenderingContext2D, block: TextBlock) => {
    const text = block.uppercase ? block.text.toUpperCase() : block.text;
    const style = `${block.italic ? "italic " : ""}${block.bold ? "bold " : ""}${block.fontSize}px ${block.font}`;
    ctx.font = style;
    ctx.textAlign = block.align;
    ctx.textBaseline = "top";

    // Word wrap
    const maxWidth = canvasW - 40;
    const words = text.split(" ");
    const lines: string[] = [];
    let currentLine = "";
    for (const word of words) {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      if (ctx.measureText(testLine).width > maxWidth && currentLine) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    }
    if (currentLine) lines.push(currentLine);

    const lineHeight = block.fontSize * 1.2;
    let alignX = block.x;
    if (block.align === "center") alignX = canvasW / 2;
    else if (block.align === "right") alignX = canvasW - 20;
    else alignX = 20;

    lines.forEach((line, i) => {
      const y = block.y + i * lineHeight;
      if (block.shadowBlur > 0) {
        ctx.shadowColor = "rgba(0,0,0,0.8)";
        ctx.shadowBlur = block.shadowBlur;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;
      }
      if (block.strokeWidth > 0) {
        ctx.strokeStyle = block.strokeColor;
        ctx.lineWidth = block.strokeWidth;
        ctx.lineJoin = "round";
        ctx.strokeText(line, alignX, y);
      }
      ctx.shadowBlur = 0;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
      ctx.fillStyle = block.color;
      ctx.fillText(line, alignX, y);
    });
  }, [canvasW]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = canvasW;
    canvas.height = canvasH;
    const ctx = canvas.getContext("2d")!;

    if (image) {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0, canvasW, canvasH);
        textBlocks.forEach((block) => drawText(ctx, block));
        // Draw selection indicator
        const sel = textBlocks.find((b) => b.id === selectedId);
        if (sel) {
          ctx.setLineDash([4, 4]);
          ctx.strokeStyle = "rgba(99, 102, 241, 0.5)";
          ctx.lineWidth = 1;
          const metrics = ctx.measureText(sel.uppercase ? sel.text.toUpperCase() : sel.text);
          const bx = sel.align === "center" ? canvasW / 2 - metrics.width / 2 - 5 : sel.align === "right" ? canvasW - 20 - metrics.width - 5 : 15;
          ctx.strokeRect(bx, sel.y - 5, metrics.width + 10, sel.fontSize * 1.2 + 10);
          ctx.setLineDash([]);
        }
      };
      img.src = image;
    } else {
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, canvasW, canvasH);
      textBlocks.forEach((block) => drawText(ctx, block));
    }
  }, [image, bgColor, canvasW, canvasH, textBlocks, selectedId, drawText]);

  useEffect(() => { draw(); }, [draw]);

  const handleUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const src = e.target?.result as string;
      const img = new Image();
      img.onload = () => {
        const maxW = 800;
        const scale = img.width > maxW ? maxW / img.width : 1;
        setCanvasW(Math.round(img.width * scale));
        setCanvasH(Math.round(img.height * scale));
        setImage(src);
        // Reposition bottom text
        setTextBlocks((prev) => prev.map((b) => b.id === "bottom" ? { ...b, y: Math.round(img.height * scale) - 60 } : b));
      };
      img.src = src;
    };
    reader.readAsDataURL(file);
  };

  const updateBlock = (id: string, updates: Partial<TextBlock>) => {
    setTextBlocks((prev) => prev.map((b) => (b.id === id ? { ...b, ...updates } : b)));
  };

  const addTextBlock = () => {
    const newBlock: TextBlock = {
      id: `text-${Date.now()}`,
      text: "New Text",
      x: canvasW / 2,
      y: canvasH / 2,
      fontSize: 36,
      color: "#ffffff",
      strokeColor: "#000000",
      strokeWidth: 3,
      font: "Impact",
      bold: false,
      italic: false,
      uppercase: true,
      align: "center",
      shadowBlur: 0,
    };
    setTextBlocks((prev) => [...prev, newBlock]);
    setSelectedId(newBlock.id);
  };

  const removeBlock = (id: string) => {
    setTextBlocks((prev) => prev.filter((b) => b.id !== id));
    if (selectedId === id) setSelectedId(textBlocks[0]?.id || "");
  };

  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * canvasW;
    const y = ((e.clientY - rect.top) / rect.height) * canvasH;

    // Find clicked text block (reverse order for top-most)
    const clicked = [...textBlocks].reverse().find((b) => {
      const by = b.y;
      const bh = b.fontSize * 1.5;
      return y >= by - 10 && y <= by + bh + 10;
    });

    if (clicked) {
      setSelectedId(clicked.id);
      setDragging(true);
    }
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!dragging || !selectedId) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const y = ((e.clientY - rect.top) / rect.height) * canvasH;
    updateBlock(selectedId, { y: Math.max(0, Math.min(canvasH - 50, y)) });
  };

  const handleCanvasMouseUp = () => setDragging(false);

  const download = () => {
    // Redraw without selection indicator
    const canvas = document.createElement("canvas");
    canvas.width = canvasW;
    canvas.height = canvasH;
    const ctx = canvas.getContext("2d")!;

    const finalize = () => {
      textBlocks.forEach((block) => drawText(ctx, block));
      const a = document.createElement("a");
      a.download = "meme.png";
      a.href = canvas.toDataURL("image/png");
      a.click();
    };

    if (image) {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0, canvasW, canvasH);
        finalize();
      };
      img.src = image;
    } else {
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, canvasW, canvasH);
      finalize();
    }
  };

  const selected = textBlocks.find((b) => b.id === selectedId);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Meme Generator</h1>
        <p className="text-[var(--text-secondary)]">
          Create memes with multiple text blocks. Upload images, customize fonts, colors, stroke, shadow. Drag text to reposition. Download as PNG.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_340px]">
        {/* Canvas */}
        <div className="space-y-3">
          <div className="rounded-lg border border-[var(--border)] overflow-hidden bg-[var(--bg-secondary)]">
            <canvas
              ref={canvasRef}
              className="w-full"
              style={{ cursor: dragging ? "grabbing" : "grab" }}
              onMouseDown={handleCanvasMouseDown}
              onMouseMove={handleCanvasMouseMove}
              onMouseUp={handleCanvasMouseUp}
              onMouseLeave={handleCanvasMouseUp}
            />
          </div>

          <div className="flex gap-2 flex-wrap">
            <button onClick={() => fileRef.current?.click()} className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded px-3 py-2 text-sm text-gray-400 hover:text-white">
              {image ? "Change Image" : "Upload Image"}
            </button>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])} />
            {image && (
              <button onClick={() => setImage(null)} className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded px-3 py-2 text-sm text-gray-400 hover:text-white">
                Remove Image
              </button>
            )}
            <button onClick={addTextBlock} className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded px-3 py-2 text-sm text-gray-400 hover:text-white">
              + Add Text
            </button>
            <button onClick={download} className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded text-sm font-bold ml-auto">
              Download PNG
            </button>
          </div>

          {/* Size and BG controls */}
          {!image && (
            <div className="flex gap-3 items-end">
              <div>
                <label className="block text-xs text-gray-400 mb-1">Width</label>
                <input type="number" value={canvasW} onChange={(e) => setCanvasW(Number(e.target.value))} className="w-20 bg-[var(--bg-secondary)] border border-[var(--border)] rounded px-2 py-1.5 text-white text-sm text-center" />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Height</label>
                <input type="number" value={canvasH} onChange={(e) => setCanvasH(Number(e.target.value))} className="w-20 bg-[var(--bg-secondary)] border border-[var(--border)] rounded px-2 py-1.5 text-white text-sm text-center" />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">BG Color</label>
                <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="w-10 h-8 rounded cursor-pointer" />
              </div>
            </div>
          )}
        </div>

        {/* Controls panel */}
        <div className="space-y-4">
          {/* Text block list */}
          <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-3">
            <h3 className="text-sm font-bold mb-2">Text Blocks ({textBlocks.length})</h3>
            <div className="space-y-1">
              {textBlocks.map((block) => (
                <div
                  key={block.id}
                  onClick={() => setSelectedId(block.id)}
                  className={`flex items-center gap-2 px-2 py-1.5 rounded text-sm cursor-pointer ${
                    selectedId === block.id ? "bg-purple-600/20 text-white" : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <span className="w-3 h-3 rounded-sm flex-shrink-0" style={{ backgroundColor: block.color, border: `1px solid ${block.strokeColor}` }} />
                  <span className="flex-1 truncate">{block.text || "(empty)"}</span>
                  {textBlocks.length > 1 && (
                    <button onClick={(e) => { e.stopPropagation(); removeBlock(block.id); }} className="text-xs text-red-400 hover:text-red-300">X</button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Selected block controls */}
          {selected && (
            <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-4 space-y-3">
              <h3 className="text-sm font-bold">Edit: {selected.text.slice(0, 20) || "Text"}</h3>

              <textarea
                value={selected.text}
                onChange={(e) => updateBlock(selected.id, { text: e.target.value })}
                placeholder="Enter text..."
                className="w-full bg-[var(--bg-primary,#0d0d1a)] border border-[var(--border)] rounded px-3 py-2 text-white text-sm h-16 resize-none"
              />

              <div>
                <label className="block text-xs text-gray-400 mb-1">Font</label>
                <select
                  value={selected.font}
                  onChange={(e) => updateBlock(selected.id, { font: e.target.value })}
                  className="w-full bg-[var(--bg-primary,#0d0d1a)] border border-[var(--border)] rounded px-2 py-1.5 text-white text-sm"
                >
                  {fonts.map((f) => <option key={f} value={f}>{f}</option>)}
                </select>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-400">Font Size</span>
                  <span className="text-gray-500">{selected.fontSize}px</span>
                </div>
                <input type="range" min={12} max={100} value={selected.fontSize} onChange={(e) => updateBlock(selected.id, { fontSize: Number(e.target.value) })} className="w-full accent-purple-500" />
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-400">Y Position</span>
                  <span className="text-gray-500">{Math.round(selected.y)}px</span>
                </div>
                <input type="range" min={0} max={canvasH - 50} value={selected.y} onChange={(e) => updateBlock(selected.id, { y: Number(e.target.value) })} className="w-full accent-purple-500" />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Text Color</label>
                  <input type="color" value={selected.color} onChange={(e) => updateBlock(selected.id, { color: e.target.value })} className="w-full h-8 rounded cursor-pointer" />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Stroke Color</label>
                  <input type="color" value={selected.strokeColor} onChange={(e) => updateBlock(selected.id, { strokeColor: e.target.value })} className="w-full h-8 rounded cursor-pointer" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-400">Stroke Width</span>
                  <span className="text-gray-500">{selected.strokeWidth}px</span>
                </div>
                <input type="range" min={0} max={10} step={0.5} value={selected.strokeWidth} onChange={(e) => updateBlock(selected.id, { strokeWidth: Number(e.target.value) })} className="w-full accent-purple-500" />
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-400">Shadow</span>
                  <span className="text-gray-500">{selected.shadowBlur}px</span>
                </div>
                <input type="range" min={0} max={20} value={selected.shadowBlur} onChange={(e) => updateBlock(selected.id, { shadowBlur: Number(e.target.value) })} className="w-full accent-purple-500" />
              </div>

              {/* Toggles */}
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => updateBlock(selected.id, { bold: !selected.bold })}
                  className={`px-3 py-1.5 rounded text-xs font-bold ${selected.bold ? "bg-purple-600 text-white" : "bg-[var(--bg-primary,#0d0d1a)] text-gray-400"}`}
                >
                  B
                </button>
                <button
                  onClick={() => updateBlock(selected.id, { italic: !selected.italic })}
                  className={`px-3 py-1.5 rounded text-xs italic ${selected.italic ? "bg-purple-600 text-white" : "bg-[var(--bg-primary,#0d0d1a)] text-gray-400"}`}
                >
                  I
                </button>
                <button
                  onClick={() => updateBlock(selected.id, { uppercase: !selected.uppercase })}
                  className={`px-3 py-1.5 rounded text-xs ${selected.uppercase ? "bg-purple-600 text-white" : "bg-[var(--bg-primary,#0d0d1a)] text-gray-400"}`}
                >
                  AA
                </button>
                <div className="flex rounded overflow-hidden border border-[var(--border)] ml-auto">
                  {(["left", "center", "right"] as const).map((a) => (
                    <button
                      key={a}
                      onClick={() => updateBlock(selected.id, { align: a })}
                      className={`px-2 py-1.5 text-xs ${selected.align === a ? "bg-purple-600 text-white" : "bg-[var(--bg-primary,#0d0d1a)] text-gray-400"}`}
                    >
                      {a === "left" ? "L" : a === "center" ? "C" : "R"}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
