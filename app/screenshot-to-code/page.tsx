"use client";
import { useState, useRef, useCallback, useEffect } from "react";

interface Box {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
  tag: string;
  bgColor: string;
}

export default function ScreenshotToCode() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [boxes, setBoxes] = useState<Box[]>([]);
  const [drawing, setDrawing] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [currentBox, setCurrentBox] = useState<{ x: number; y: number; w: number; h: number } | null>(null);
  const [selectedBox, setSelectedBox] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [codeType, setCodeType] = useState<"html" | "jsx">("html");
  const [copied, setCopied] = useState(false);
  const [canvasScale, setCanvasScale] = useState(1);
  const [tool, setTool] = useState<"draw" | "select">("draw");

  const tagOptions = ["div", "header", "nav", "main", "section", "aside", "footer", "article", "button", "img"];
  const colorOptions = ["#6366f1", "#ec4899", "#10b981", "#f59e0b", "#ef4444", "#3b82f6", "#8b5cf6", "#14b8a6", "#f97316", "#64748b"];

  const getCanvasCoords = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  }, []);

  const redraw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (image) {
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    } else {
      ctx.fillStyle = "#1e1e2e";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#64748b";
      ctx.font = "18px system-ui";
      ctx.textAlign = "center";
      ctx.fillText("Upload a screenshot to get started", canvas.width / 2, canvas.height / 2 - 10);
      ctx.font = "14px system-ui";
      ctx.fillText("Then draw boxes around sections", canvas.width / 2, canvas.height / 2 + 20);
    }

    // Draw existing boxes
    boxes.forEach((box) => {
      const isSelected = box.id === selectedBox;
      ctx.strokeStyle = box.bgColor;
      ctx.lineWidth = isSelected ? 3 : 2;
      ctx.setLineDash(isSelected ? [] : [6, 3]);
      ctx.strokeRect(box.x, box.y, box.w, box.h);
      ctx.setLineDash([]);

      // Label background
      const labelText = `<${box.tag}> ${box.label}`;
      ctx.font = "bold 12px system-ui";
      const metrics = ctx.measureText(labelText);
      const lw = metrics.width + 12;
      const lh = 20;
      ctx.fillStyle = box.bgColor;
      ctx.fillRect(box.x, box.y - lh, lw, lh);
      ctx.fillStyle = "#fff";
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";
      ctx.fillText(labelText, box.x + 6, box.y - lh / 2);

      // Resize handle
      if (isSelected) {
        ctx.fillStyle = box.bgColor;
        ctx.fillRect(box.x + box.w - 8, box.y + box.h - 8, 8, 8);
      }
    });

    // Draw current box being drawn
    if (currentBox) {
      ctx.strokeStyle = "#6366f1";
      ctx.lineWidth = 2;
      ctx.setLineDash([4, 4]);
      ctx.strokeRect(currentBox.x, currentBox.y, currentBox.w, currentBox.h);
      ctx.setLineDash([]);
    }
  }, [image, boxes, selectedBox, currentBox]);

  useEffect(() => { redraw(); }, [redraw]);

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const pos = getCanvasCoords(e);

    if (tool === "select") {
      // Check if clicked on a box
      const clicked = [...boxes].reverse().find(
        (b) => pos.x >= b.x && pos.x <= b.x + b.w && pos.y >= b.y && pos.y <= b.y + b.h
      );
      setSelectedBox(clicked?.id || null);
      return;
    }

    setDrawing(true);
    setStartPos(pos);
    setCurrentBox({ x: pos.x, y: pos.y, w: 0, h: 0 });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!drawing || tool !== "draw") return;
    const pos = getCanvasCoords(e);
    setCurrentBox({
      x: Math.min(startPos.x, pos.x),
      y: Math.min(startPos.y, pos.y),
      w: Math.abs(pos.x - startPos.x),
      h: Math.abs(pos.y - startPos.y),
    });
  };

  const handleMouseUp = () => {
    if (!drawing || !currentBox || tool !== "draw") {
      setDrawing(false);
      return;
    }
    setDrawing(false);

    if (currentBox.w > 10 && currentBox.h > 10) {
      const newBox: Box = {
        id: crypto.randomUUID(),
        x: currentBox.x,
        y: currentBox.y,
        w: currentBox.w,
        h: currentBox.h,
        label: `Section ${boxes.length + 1}`,
        tag: boxes.length === 0 ? "header" : boxes.length === 1 ? "nav" : "div",
        bgColor: colorOptions[boxes.length % colorOptions.length],
      };
      setBoxes((prev) => [...prev, newBox]);
      setSelectedBox(newBox.id);
    }
    setCurrentBox(null);
  };

  const handleUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const src = e.target?.result as string;
      setImageSrc(src);
      const img = new Image();
      img.onload = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const maxW = 900;
        const scale = img.width > maxW ? maxW / img.width : 1;
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        setCanvasScale(scale);
        setImage(img);
        setBoxes([]);
        setSelectedBox(null);
      };
      img.src = src;
    };
    reader.readAsDataURL(file);
  };

  const updateBox = (id: string, updates: Partial<Box>) => {
    setBoxes((prev) => prev.map((b) => (b.id === id ? { ...b, ...updates } : b)));
  };

  const deleteBox = (id: string) => {
    setBoxes((prev) => prev.filter((b) => b.id !== id));
    if (selectedBox === id) setSelectedBox(null);
  };

  const generateCode = useCallback(() => {
    if (boxes.length === 0) {
      setCode("<!-- Draw boxes on the screenshot first -->");
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const cW = canvas.width;
    const cH = canvas.height;

    if (codeType === "html") {
      let html = `<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n  <title>Generated Layout</title>\n  <style>\n    * { margin: 0; padding: 0; box-sizing: border-box; }\n    body { font-family: system-ui, sans-serif; }\n    .container {\n      position: relative;\n      width: 100%;\n      max-width: ${cW}px;\n      min-height: ${cH}px;\n      margin: 0 auto;\n    }\n`;

      boxes.forEach((box) => {
        const left = ((box.x / cW) * 100).toFixed(1);
        const top = ((box.y / cH) * 100).toFixed(1);
        const width = ((box.w / cW) * 100).toFixed(1);
        const height = ((box.h / cH) * 100).toFixed(1);
        const cls = box.label.toLowerCase().replace(/\s+/g, "-");
        html += `    .${cls} {\n      position: absolute;\n      left: ${left}%;\n      top: ${top}%;\n      width: ${width}%;\n      height: ${height}%;\n      /* background: ${box.bgColor}20; */\n      border: 1px solid #e5e7eb;\n      border-radius: 8px;\n      padding: 16px;\n    }\n`;
      });

      html += `  </style>\n</head>\n<body>\n  <div class="container">\n`;

      boxes.forEach((box) => {
        const cls = box.label.toLowerCase().replace(/\s+/g, "-");
        html += `    <${box.tag} class="${cls}">\n      <!-- ${box.label} -->\n      <p>${box.label}</p>\n    </${box.tag}>\n`;
      });

      html += `  </div>\n</body>\n</html>`;
      setCode(html);
    } else {
      let jsx = `export default function GeneratedLayout() {\n  return (\n    <div style={{ position: "relative", width: "100%", maxWidth: ${cW}, minHeight: ${cH}, margin: "0 auto" }}>\n`;

      boxes.forEach((box) => {
        const left = ((box.x / cW) * 100).toFixed(1);
        const top = ((box.y / cH) * 100).toFixed(1);
        const width = ((box.w / cW) * 100).toFixed(1);
        const height = ((box.h / cH) * 100).toFixed(1);
        const Tag = box.tag;
        jsx += `      <${Tag}\n        style={{\n          position: "absolute",\n          left: "${left}%",\n          top: "${top}%",\n          width: "${width}%",\n          height: "${height}%",\n          border: "1px solid #e5e7eb",\n          borderRadius: 8,\n          padding: 16,\n        }}\n      >\n        {/* ${box.label} */}\n        <p>${box.label}</p>\n      </${Tag}>\n`;
      });

      jsx += `    </div>\n  );\n}`;
      setCode(jsx);
    }
  }, [boxes, codeType]);

  useEffect(() => { generateCode(); }, [generateCode]);

  const copyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) handleUpload(file);
  };

  const selectedBoxData = boxes.find((b) => b.id === selectedBox);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Screenshot to Code</h1>
        <p className="text-[var(--text-secondary)]">
          Upload a screenshot, draw boxes around sections, then generate clean HTML/CSS or JSX layout code. Trace your UI to create a starting layout.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
        <div className="space-y-4">
          {/* Toolbar */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => fileRef.current?.click()}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded text-sm font-medium"
            >
              {image ? "Change Image" : "Upload Screenshot"}
            </button>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])} />

            <div className="flex rounded overflow-hidden border border-[var(--border)]">
              <button
                onClick={() => setTool("draw")}
                className={`px-3 py-1.5 text-sm ${tool === "draw" ? "bg-purple-600 text-white" : "bg-[var(--bg-secondary)] text-gray-400 hover:text-white"}`}
              >
                Draw
              </button>
              <button
                onClick={() => setTool("select")}
                className={`px-3 py-1.5 text-sm ${tool === "select" ? "bg-purple-600 text-white" : "bg-[var(--bg-secondary)] text-gray-400 hover:text-white"}`}
              >
                Select
              </button>
            </div>

            {boxes.length > 0 && (
              <button onClick={() => { setBoxes([]); setSelectedBox(null); }} className="text-xs text-red-400 hover:text-red-300 ml-auto">
                Clear All Boxes
              </button>
            )}
          </div>

          {/* Canvas */}
          <div
            className="rounded-lg border border-[var(--border)] overflow-hidden bg-[var(--bg-secondary)]"
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
          >
            <canvas
              ref={canvasRef}
              width={900}
              height={600}
              className="w-full cursor-crosshair"
              style={{ cursor: tool === "draw" ? "crosshair" : "pointer" }}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            />
          </div>

          <p className="text-xs text-[var(--text-secondary)]">
            {boxes.length} box{boxes.length !== 1 ? "es" : ""} traced. {tool === "draw" ? "Click and drag to draw a new box." : "Click a box to select and edit it."}
          </p>
        </div>

        {/* Right panel */}
        <div className="space-y-4">
          {/* Box properties */}
          {selectedBoxData ? (
            <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold">Box Properties</h3>
                <button onClick={() => deleteBox(selectedBoxData.id)} className="text-xs text-red-400 hover:text-red-300">Delete</button>
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Label</label>
                <input
                  value={selectedBoxData.label}
                  onChange={(e) => updateBox(selectedBoxData.id, { label: e.target.value })}
                  className="w-full bg-[var(--bg-primary,#0d0d1a)] border border-[var(--border)] rounded px-3 py-1.5 text-white text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">HTML Tag</label>
                <select
                  value={selectedBoxData.tag}
                  onChange={(e) => updateBox(selectedBoxData.id, { tag: e.target.value })}
                  className="w-full bg-[var(--bg-primary,#0d0d1a)] border border-[var(--border)] rounded px-3 py-1.5 text-white text-sm"
                >
                  {tagOptions.map((t) => (
                    <option key={t} value={t}>&lt;{t}&gt;</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Color</label>
                <div className="flex gap-1 flex-wrap">
                  {colorOptions.map((c) => (
                    <button
                      key={c}
                      onClick={() => updateBox(selectedBoxData.id, { bgColor: c })}
                      className={`w-6 h-6 rounded ${selectedBoxData.bgColor === c ? "ring-2 ring-white" : ""}`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs text-gray-400">
                <div>X: {Math.round(selectedBoxData.x)}, Y: {Math.round(selectedBoxData.y)}</div>
                <div>W: {Math.round(selectedBoxData.w)}, H: {Math.round(selectedBoxData.h)}</div>
              </div>
            </div>
          ) : (
            <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-4">
              <p className="text-sm text-gray-400">
                {boxes.length === 0 ? "Draw boxes on the screenshot to define layout sections." : "Select a box to edit its properties."}
              </p>
            </div>
          )}

          {/* Box list */}
          {boxes.length > 0 && (
            <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-4 space-y-2">
              <h3 className="text-sm font-bold mb-2">Sections ({boxes.length})</h3>
              {boxes.map((box, i) => (
                <div
                  key={box.id}
                  onClick={() => { setSelectedBox(box.id); setTool("select"); }}
                  className={`flex items-center gap-2 px-2 py-1.5 rounded text-sm cursor-pointer ${
                    selectedBox === box.id ? "bg-purple-600/20 text-white" : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <span className="w-3 h-3 rounded-sm flex-shrink-0" style={{ backgroundColor: box.bgColor }} />
                  <span className="flex-1 truncate">{box.label}</span>
                  <span className="text-xs opacity-60">&lt;{box.tag}&gt;</span>
                </div>
              ))}
            </div>
          )}

          {/* Code output */}
          <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2 border-b border-[var(--border)]">
              <div className="flex rounded overflow-hidden border border-[var(--border)]">
                <button
                  onClick={() => setCodeType("html")}
                  className={`px-3 py-1 text-xs ${codeType === "html" ? "bg-purple-600 text-white" : "bg-[var(--bg-primary,#0d0d1a)] text-gray-400"}`}
                >
                  HTML/CSS
                </button>
                <button
                  onClick={() => setCodeType("jsx")}
                  className={`px-3 py-1 text-xs ${codeType === "jsx" ? "bg-purple-600 text-white" : "bg-[var(--bg-primary,#0d0d1a)] text-gray-400"}`}
                >
                  JSX
                </button>
              </div>
              <button onClick={copyCode} className="text-xs text-purple-400 hover:text-purple-300">
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
            <pre className="p-4 text-xs text-gray-300 overflow-auto max-h-64 font-mono leading-relaxed whitespace-pre-wrap">
              {code}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
