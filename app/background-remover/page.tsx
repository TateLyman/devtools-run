"use client";
import { useState, useRef, useEffect, useCallback } from "react";

type Tool = "wand" | "eraser";

interface HistoryEntry {
  data: ImageData;
}

export default function BackgroundRemover() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const [imgEl, setImgEl] = useState<HTMLImageElement | null>(null);
  const [tool, setTool] = useState<Tool>("wand");
  const [tolerance, setTolerance] = useState(32);
  const [brushSize, setBrushSize] = useState(20);
  const [zoom, setZoom] = useState(1);
  const [drawing, setDrawing] = useState(false);
  const [canvasReady, setCanvasReady] = useState(false);

  const historyRef = useRef<HistoryEntry[]>([]);
  const historyIndexRef = useRef(-1);
  const lastPosRef = useRef<{ x: number; y: number } | null>(null);
  const originalImageDataRef = useRef<ImageData | null>(null);

  const createCheckerPattern = useCallback(() => {
    const size = 10;
    const patternCanvas = document.createElement("canvas");
    patternCanvas.width = size * 2;
    patternCanvas.height = size * 2;
    const pCtx = patternCanvas.getContext("2d")!;
    pCtx.fillStyle = "#2a2a3e";
    pCtx.fillRect(0, 0, size * 2, size * 2);
    pCtx.fillStyle = "#1e1e30";
    pCtx.fillRect(0, 0, size, size);
    pCtx.fillRect(size, size, size, size);
    return patternCanvas;
  }, []);

  const pushHistory = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
    // Truncate any forward history
    historyRef.current = historyRef.current.slice(0, historyIndexRef.current + 1);
    historyRef.current.push({ data });
    historyIndexRef.current = historyRef.current.length - 1;
    // Keep max 40 states
    if (historyRef.current.length > 40) {
      historyRef.current.shift();
      historyIndexRef.current--;
    }
  }, []);

  const renderOverlay = useCallback(() => {
    const canvas = canvasRef.current;
    const overlay = overlayRef.current;
    if (!canvas || !overlay) return;
    const oCtx = overlay.getContext("2d")!;
    overlay.width = canvas.width;
    overlay.height = canvas.height;
    // Draw checkerboard
    const patternCanvas = createCheckerPattern();
    const pattern = oCtx.createPattern(patternCanvas, "repeat");
    if (pattern) {
      oCtx.fillStyle = pattern;
      oCtx.fillRect(0, 0, overlay.width, overlay.height);
    }
    // Draw actual image on top (transparent pixels show checkerboard)
    oCtx.drawImage(canvas, 0, 0);
  }, [createCheckerPattern]);

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        setImgEl(img);
        // Set up canvas
        const canvas = canvasRef.current!;
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d")!;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        originalImageDataRef.current = ctx.getImageData(0, 0, canvas.width, canvas.height);
        // Reset history
        historyRef.current = [];
        historyIndexRef.current = -1;
        pushHistory();
        // Auto-fit zoom
        const container = containerRef.current;
        if (container) {
          const maxW = container.clientWidth - 32;
          const maxH = 600;
          const scaleW = maxW / img.width;
          const scaleH = maxH / img.height;
          setZoom(Math.min(1, Math.min(scaleW, scaleH)));
        } else {
          setZoom(Math.min(1, 800 / Math.max(img.width, img.height)));
        }
        setCanvasReady(true);
        setTimeout(() => renderOverlay(), 0);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    if (canvasReady) renderOverlay();
  }, [canvasReady, renderOverlay, zoom]);

  // Undo / Redo
  const undo = useCallback(() => {
    if (historyIndexRef.current <= 0) return;
    historyIndexRef.current--;
    const entry = historyRef.current[historyIndexRef.current];
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    ctx.putImageData(entry.data, 0, 0);
    renderOverlay();
  }, [renderOverlay]);

  const redo = useCallback(() => {
    if (historyIndexRef.current >= historyRef.current.length - 1) return;
    historyIndexRef.current++;
    const entry = historyRef.current[historyIndexRef.current];
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    ctx.putImageData(entry.data, 0, 0);
    renderOverlay();
  }, [renderOverlay]);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "z") {
        e.preventDefault();
        if (e.shiftKey) redo();
        else undo();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [undo, redo]);

  // Magic wand — flood fill to transparent
  const magicWand = (startX: number, startY: number) => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    const w = canvas.width;
    const h = canvas.height;

    const idx = (startY * w + startX) * 4;
    // Skip if already transparent
    if (data[idx + 3] === 0) return;

    const targetR = data[idx];
    const targetG = data[idx + 1];
    const targetB = data[idx + 2];

    const tol = tolerance;
    const visited = new Uint8Array(w * h);
    const stack: number[] = [startX, startY];

    const matches = (i: number) => {
      if (data[i + 3] === 0) return false;
      const dr = data[i] - targetR;
      const dg = data[i + 1] - targetG;
      const db = data[i + 2] - targetB;
      return (dr * dr + dg * dg + db * db) <= tol * tol * 3;
    };

    while (stack.length > 0) {
      const y = stack.pop()!;
      const x = stack.pop()!;
      const pi = y * w + x;
      if (x < 0 || x >= w || y < 0 || y >= h) continue;
      if (visited[pi]) continue;
      const i = pi * 4;
      if (!matches(i)) continue;
      visited[pi] = 1;
      data[i + 3] = 0; // Make transparent

      stack.push(x - 1, y);
      stack.push(x + 1, y);
      stack.push(x, y - 1);
      stack.push(x, y + 1);
    }

    ctx.putImageData(imageData, 0, 0);
    pushHistory();
    renderOverlay();
  };

  // Get canvas coordinates from mouse event
  const getCanvasPos = (e: React.MouseEvent) => {
    const overlay = overlayRef.current!;
    const rect = overlay.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / zoom);
    const y = Math.floor((e.clientY - rect.top) / zoom);
    return { x, y };
  };

  const handleCanvasMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    const pos = getCanvasPos(e);
    if (tool === "wand") {
      magicWand(pos.x, pos.y);
    } else {
      setDrawing(true);
      lastPosRef.current = pos;
      eraseAt(pos.x, pos.y);
    }
  };

  const eraseAt = (x: number, y: number) => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    ctx.save();
    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(x, y, brushSize / 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    renderOverlay();
  };

  const eraseLine = (x1: number, y1: number, x2: number, y2: number) => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    ctx.save();
    ctx.globalCompositeOperation = "destination-out";
    ctx.lineWidth = brushSize;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.restore();
    renderOverlay();
  };

  const handleCanvasMouseMove = (e: React.MouseEvent) => {
    if (!drawing || tool !== "eraser") return;
    const pos = getCanvasPos(e);
    if (lastPosRef.current) {
      eraseLine(lastPosRef.current.x, lastPosRef.current.y, pos.x, pos.y);
    }
    lastPosRef.current = pos;
  };

  const handleCanvasMouseUp = () => {
    if (drawing) {
      setDrawing(false);
      lastPosRef.current = null;
      pushHistory();
    }
  };

  // Touch events
  const getTouchCanvasPos = (e: React.TouchEvent) => {
    const overlay = overlayRef.current!;
    const rect = overlay.getBoundingClientRect();
    const touch = e.touches[0];
    const x = Math.floor((touch.clientX - rect.left) / zoom);
    const y = Math.floor((touch.clientY - rect.top) / zoom);
    return { x, y };
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    const pos = getTouchCanvasPos(e);
    if (tool === "wand") {
      magicWand(pos.x, pos.y);
    } else {
      setDrawing(true);
      lastPosRef.current = pos;
      eraseAt(pos.x, pos.y);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    e.preventDefault();
    if (!drawing || tool !== "eraser") return;
    const pos = getTouchCanvasPos(e);
    if (lastPosRef.current) {
      eraseLine(lastPosRef.current.x, lastPosRef.current.y, pos.x, pos.y);
    }
    lastPosRef.current = pos;
  };

  const handleTouchEnd = () => {
    if (drawing) {
      setDrawing(false);
      lastPosRef.current = null;
      pushHistory();
    }
  };

  // Reset to original
  const resetImage = () => {
    if (!originalImageDataRef.current) return;
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    ctx.putImageData(originalImageDataRef.current, 0, 0);
    pushHistory();
    renderOverlay();
  };

  // Download PNG with transparency
  const download = () => {
    const canvas = canvasRef.current!;
    const a = document.createElement("a");
    a.download = "background-removed.png";
    a.href = canvas.toDataURL("image/png");
    a.click();
  };

  const canUndo = historyIndexRef.current > 0;
  const canRedo = historyIndexRef.current < historyRef.current.length - 1;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Background Remover</h1>
        <p className="text-[var(--text-secondary)]">
          Remove backgrounds from images right in your browser. Use the Magic Wand to remove similar colors with one click, or the Eraser to manually brush away areas. Download as transparent PNG. Free, private, no upload to server.
        </p>
      </div>

      {/* Upload area */}
      {!imgEl && (
        <div
          className="bg-[var(--bg-secondary)] border-2 border-dashed border-[var(--border)] rounded-xl p-12 text-center cursor-pointer hover:border-purple-500/50 transition-colors"
          onClick={() => fileRef.current?.click()}
          onDrop={(e) => { e.preventDefault(); e.dataTransfer.files[0] && handleFile(e.dataTransfer.files[0]); }}
          onDragOver={(e) => e.preventDefault()}
        >
          <div className="text-5xl mb-4 opacity-50">&#128444;</div>
          <p className="text-gray-400 text-lg mb-1">Drop an image here or click to upload</p>
          <p className="text-gray-500 text-sm">Supports PNG, JPG, WebP, GIF</p>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
          />
        </div>
      )}

      {imgEl && (
        <>
          {/* Toolbar */}
          <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-4 space-y-3">
            {/* Tool selection row */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Tools */}
              <div className="flex gap-1">
                <button
                  onClick={() => setTool("wand")}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    tool === "wand"
                      ? "bg-purple-600 text-white"
                      : "bg-[var(--bg-primary)] text-gray-400 hover:text-white border border-[var(--border)]"
                  }`}
                >
                  Magic Wand
                </button>
                <button
                  onClick={() => setTool("eraser")}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    tool === "eraser"
                      ? "bg-purple-600 text-white"
                      : "bg-[var(--bg-primary)] text-gray-400 hover:text-white border border-[var(--border)]"
                  }`}
                >
                  Eraser
                </button>
              </div>

              <div className="w-px h-6 bg-[var(--border)]" />

              {/* Tool-specific controls */}
              {tool === "wand" && (
                <div className="flex items-center gap-2">
                  <label className="text-xs text-gray-400 whitespace-nowrap">Tolerance</label>
                  <input
                    type="range"
                    min={1}
                    max={100}
                    value={tolerance}
                    onChange={(e) => setTolerance(Number(e.target.value))}
                    className="w-28 accent-purple-500"
                  />
                  <span className="text-xs text-gray-400 font-mono w-8">{tolerance}</span>
                </div>
              )}
              {tool === "eraser" && (
                <div className="flex items-center gap-2">
                  <label className="text-xs text-gray-400 whitespace-nowrap">Brush Size</label>
                  <input
                    type="range"
                    min={2}
                    max={100}
                    value={brushSize}
                    onChange={(e) => setBrushSize(Number(e.target.value))}
                    className="w-28 accent-purple-500"
                  />
                  <span className="text-xs text-gray-400 font-mono w-8">{brushSize}px</span>
                </div>
              )}

              <div className="w-px h-6 bg-[var(--border)]" />

              {/* Undo / Redo */}
              <div className="flex gap-1">
                <button
                  onClick={undo}
                  disabled={!canUndo}
                  className="px-2 py-1.5 rounded text-sm bg-[var(--bg-primary)] border border-[var(--border)] text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                  title="Undo (Ctrl+Z)"
                >
                  Undo
                </button>
                <button
                  onClick={redo}
                  disabled={!canRedo}
                  className="px-2 py-1.5 rounded text-sm bg-[var(--bg-primary)] border border-[var(--border)] text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                  title="Redo (Ctrl+Shift+Z)"
                >
                  Redo
                </button>
              </div>

              <div className="w-px h-6 bg-[var(--border)]" />

              {/* Zoom */}
              <div className="flex items-center gap-2">
                <label className="text-xs text-gray-400">Zoom</label>
                <button
                  onClick={() => setZoom((z) => Math.max(0.1, z - 0.1))}
                  className="w-7 h-7 rounded bg-[var(--bg-primary)] border border-[var(--border)] text-gray-400 hover:text-white text-sm"
                >
                  -
                </button>
                <span className="text-xs text-gray-400 font-mono w-10 text-center">{Math.round(zoom * 100)}%</span>
                <button
                  onClick={() => setZoom((z) => Math.min(5, z + 0.1))}
                  className="w-7 h-7 rounded bg-[var(--bg-primary)] border border-[var(--border)] text-gray-400 hover:text-white text-sm"
                >
                  +
                </button>
                <button
                  onClick={() => {
                    if (!imgEl || !containerRef.current) return;
                    const maxW = containerRef.current.clientWidth - 32;
                    const scaleW = maxW / imgEl.width;
                    const scaleH = 600 / imgEl.height;
                    setZoom(Math.min(1, Math.min(scaleW, scaleH)));
                  }}
                  className="px-2 py-1 rounded text-xs bg-[var(--bg-primary)] border border-[var(--border)] text-gray-400 hover:text-white"
                >
                  Fit
                </button>
              </div>

              <div className="flex-1" />

              {/* Actions */}
              <div className="flex gap-1">
                <button
                  onClick={resetImage}
                  className="px-3 py-1.5 rounded text-sm bg-gray-700 hover:bg-gray-600 text-white"
                >
                  Reset
                </button>
                <button
                  onClick={() => {
                    setImgEl(null);
                    setCanvasReady(false);
                    historyRef.current = [];
                    historyIndexRef.current = -1;
                    originalImageDataRef.current = null;
                  }}
                  className="px-3 py-1.5 rounded text-sm bg-red-600/20 border border-red-600/30 text-red-400 hover:bg-red-600/30"
                >
                  New Image
                </button>
              </div>
            </div>

            {/* Hints */}
            <div className="text-[11px] text-gray-500">
              {tool === "wand"
                ? "Click on a color to remove all connected pixels of similar color. Increase tolerance to remove more shades."
                : "Click and drag to erase areas. Adjust brush size for precision."}
              {" "}Ctrl+Z to undo, Ctrl+Shift+Z to redo.
            </div>
          </div>

          {/* Canvas area */}
          <div ref={containerRef} className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-4 overflow-auto">
            <div className="flex justify-center">
              <div
                className="relative"
                style={{
                  width: imgEl.width * zoom,
                  height: imgEl.height * zoom,
                  cursor: tool === "wand" ? "crosshair" : "none",
                }}
              >
                {/* Hidden working canvas */}
                <canvas
                  ref={canvasRef}
                  className="hidden"
                />
                {/* Visible overlay canvas with checkerboard */}
                <canvas
                  ref={overlayRef}
                  style={{
                    width: imgEl.width * zoom,
                    height: imgEl.height * zoom,
                    imageRendering: zoom > 2 ? "pixelated" : "auto",
                  }}
                  className="rounded"
                  onMouseDown={handleCanvasMouseDown}
                  onMouseMove={handleCanvasMouseMove}
                  onMouseUp={handleCanvasMouseUp}
                  onMouseLeave={handleCanvasMouseUp}
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                />
                {/* Custom eraser cursor */}
                {tool === "eraser" && (
                  <div
                    className="pointer-events-none absolute rounded-full border-2 border-white/60 mix-blend-difference"
                    style={{
                      width: brushSize * zoom,
                      height: brushSize * zoom,
                      transform: "translate(-50%, -50%)",
                      left: "var(--cursor-x, -999px)",
                      top: "var(--cursor-y, -999px)",
                    }}
                    id="eraser-cursor"
                  />
                )}
              </div>
            </div>
            {/* Image info */}
            <div className="text-center mt-3 text-xs text-gray-500">
              {imgEl.width} x {imgEl.height}px &middot; {Math.round(zoom * 100)}% zoom
            </div>
          </div>

          {/* Eraser cursor tracker */}
          {tool === "eraser" && canvasReady && (
            <EraserCursorTracker />
          )}

          {/* Download */}
          <button
            onClick={download}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-3 rounded-lg font-bold text-lg transition-colors"
          >
            Download PNG with Transparent Background
          </button>
        </>
      )}

      {/* How it works */}
      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-6 space-y-4">
        <h2 className="text-lg font-bold">How It Works</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-purple-400">Magic Wand Tool</h3>
            <p className="text-sm text-gray-400">
              Click any area to remove all connected pixels of similar color. Perfect for solid backgrounds. Adjust the tolerance slider to control how many shades are removed — low values for precise selection, high values for gradients.
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-purple-400">Manual Eraser Tool</h3>
            <p className="text-sm text-gray-400">
              Paint over areas to erase them manually. Great for fine-tuning edges after using the Magic Wand, or for complex backgrounds. Adjust brush size and zoom in for pixel-perfect control.
            </p>
          </div>
        </div>
        <div className="text-xs text-gray-500 border-t border-[var(--border)] pt-3">
          Everything runs 100% in your browser. Your images are never uploaded to any server. Supports PNG, JPG, WebP, and GIF input. Output is always PNG with transparency.
        </div>
      </div>
    </div>
  );
}

/* Tracks mouse position for custom eraser cursor */
function EraserCursorTracker() {
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const cursor = document.getElementById("eraser-cursor");
      if (!cursor) return;
      const parent = cursor.parentElement;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      cursor.style.setProperty("--cursor-x", `${x}px`);
      cursor.style.setProperty("--cursor-y", `${y}px`);
    };
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, []);
  return null;
}
