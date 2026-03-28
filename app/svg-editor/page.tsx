"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import AdSlot from "../components/AdSlot";

type Tool = "select" | "rect" | "circle" | "line" | "text";

interface SvgElement {
  id: string;
  type: "rect" | "circle" | "line" | "text";
  x: number;
  y: number;
  width: number;
  height: number;
  fill: string;
  stroke: string;
  strokeWidth: number;
  text?: string;
  x2?: number;
  y2?: number;
}

export default function SVGEditorPage() {
  const [elements, setElements] = useState<SvgElement[]>([]);
  const [tool, setTool] = useState<Tool>("rect");
  const [fillColor, setFillColor] = useState("#7c3aed");
  const [strokeColor, setStrokeColor] = useState("#ffffff");
  const [strokeWidth, setStrokeWidth] = useState(2);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [drawing, setDrawing] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [currentPos, setCurrentPos] = useState({ x: 0, y: 0 });
  const [textInput, setTextInput] = useState("Text");
  const [canvasWidth] = useState(800);
  const [canvasHeight] = useState(600);
  const [showCode, setShowCode] = useState(false);
  const [importSvg, setImportSvg] = useState("");
  const [showImport, setShowImport] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);

  const getMousePos = useCallback(
    (e: React.MouseEvent<SVGSVGElement>) => {
      const svg = svgRef.current;
      if (!svg) return { x: 0, y: 0 };
      const rect = svg.getBoundingClientRect();
      const scaleX = canvasWidth / rect.width;
      const scaleY = canvasHeight / rect.height;
      return {
        x: Math.round((e.clientX - rect.left) * scaleX),
        y: Math.round((e.clientY - rect.top) * scaleY),
      };
    },
    [canvasWidth, canvasHeight]
  );

  const handleMouseDown = useCallback(
    (e: React.MouseEvent<SVGSVGElement>) => {
      if (tool === "select") return;
      const pos = getMousePos(e);
      setStartPos(pos);
      setCurrentPos(pos);
      setDrawing(true);
      setSelectedId(null);
    },
    [tool, getMousePos]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<SVGSVGElement>) => {
      if (!drawing) return;
      setCurrentPos(getMousePos(e));
    },
    [drawing, getMousePos]
  );

  const handleMouseUp = useCallback(() => {
    if (!drawing) return;
    setDrawing(false);

    const id = crypto.randomUUID();
    const x = Math.min(startPos.x, currentPos.x);
    const y = Math.min(startPos.y, currentPos.y);
    const w = Math.abs(currentPos.x - startPos.x);
    const h = Math.abs(currentPos.y - startPos.y);

    if (tool === "text") {
      const el: SvgElement = {
        id,
        type: "text",
        x: startPos.x,
        y: startPos.y,
        width: 0,
        height: 0,
        fill: fillColor,
        stroke: "none",
        strokeWidth: 0,
        text: textInput,
      };
      setElements((prev) => [...prev, el]);
      return;
    }

    // Require minimum size for shapes
    if (w < 5 && h < 5 && tool !== "line") return;

    if (tool === "rect") {
      setElements((prev) => [
        ...prev,
        {
          id,
          type: "rect",
          x,
          y,
          width: w,
          height: h,
          fill: fillColor,
          stroke: strokeColor,
          strokeWidth,
        },
      ]);
    } else if (tool === "circle") {
      const cx = x + w / 2;
      const cy = y + h / 2;
      setElements((prev) => [
        ...prev,
        {
          id,
          type: "circle",
          x: cx,
          y: cy,
          width: w / 2,
          height: h / 2,
          fill: fillColor,
          stroke: strokeColor,
          strokeWidth,
        },
      ]);
    } else if (tool === "line") {
      if (Math.abs(currentPos.x - startPos.x) < 3 && Math.abs(currentPos.y - startPos.y) < 3) return;
      setElements((prev) => [
        ...prev,
        {
          id,
          type: "line",
          x: startPos.x,
          y: startPos.y,
          x2: currentPos.x,
          y2: currentPos.y,
          width: 0,
          height: 0,
          fill: "none",
          stroke: strokeColor,
          strokeWidth,
        },
      ]);
    }
  }, [drawing, startPos, currentPos, tool, fillColor, strokeColor, strokeWidth, textInput]);

  const selectElement = (id: string) => {
    if (tool === "select") {
      setSelectedId(id === selectedId ? null : id);
    }
  };

  const deleteSelected = () => {
    if (!selectedId) return;
    setElements((prev) => prev.filter((el) => el.id !== selectedId));
    setSelectedId(null);
  };

  const moveSelected = (dx: number, dy: number) => {
    if (!selectedId) return;
    setElements((prev) =>
      prev.map((el) => {
        if (el.id !== selectedId) return el;
        if (el.type === "line") {
          return { ...el, x: el.x + dx, y: el.y + dy, x2: (el.x2 || 0) + dx, y2: (el.y2 || 0) + dy };
        }
        return { ...el, x: el.x + dx, y: el.y + dy };
      })
    );
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Delete" || e.key === "Backspace") {
        if (document.activeElement?.tagName === "INPUT" || document.activeElement?.tagName === "TEXTAREA") return;
        deleteSelected();
      }
      if (e.key === "ArrowUp") { e.preventDefault(); moveSelected(0, -5); }
      if (e.key === "ArrowDown") { e.preventDefault(); moveSelected(0, 5); }
      if (e.key === "ArrowLeft") { e.preventDefault(); moveSelected(-5, 0); }
      if (e.key === "ArrowRight") { e.preventDefault(); moveSelected(5, 0); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  });

  const generateSvgCode = useCallback(() => {
    let code = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${canvasWidth} ${canvasHeight}">\n`;
    for (const el of elements) {
      switch (el.type) {
        case "rect":
          code += `  <rect x="${el.x}" y="${el.y}" width="${el.width}" height="${el.height}" fill="${el.fill}" stroke="${el.stroke}" stroke-width="${el.strokeWidth}" />\n`;
          break;
        case "circle":
          code += `  <ellipse cx="${el.x}" cy="${el.y}" rx="${el.width}" ry="${el.height}" fill="${el.fill}" stroke="${el.stroke}" stroke-width="${el.strokeWidth}" />\n`;
          break;
        case "line":
          code += `  <line x1="${el.x}" y1="${el.y}" x2="${el.x2}" y2="${el.y2}" stroke="${el.stroke}" stroke-width="${el.strokeWidth}" />\n`;
          break;
        case "text":
          code += `  <text x="${el.x}" y="${el.y}" fill="${el.fill}" font-size="24" font-family="Arial, sans-serif">${el.text}</text>\n`;
          break;
      }
    }
    code += `</svg>`;
    return code;
  }, [elements, canvasWidth, canvasHeight]);

  const exportSvg = () => {
    const code = generateSvgCode();
    const blob = new Blob([code], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "drawing.svg";
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportPng = () => {
    const code = generateSvgCode();
    const blob = new Blob([code], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0, canvasWidth, canvasHeight);
      const a = document.createElement("a");
      a.href = canvas.toDataURL("image/png");
      a.download = "drawing.png";
      a.click();
      URL.revokeObjectURL(url);
    };
    img.src = url;
  };

  const handleImport = () => {
    if (!importSvg.trim()) return;

    // Parse the imported SVG to extract elements
    const parser = new DOMParser();
    const doc = parser.parseFromString(importSvg, "image/svg+xml");
    const svgEl = doc.querySelector("svg");
    if (!svgEl) {
      alert("Invalid SVG. Please paste valid SVG markup.");
      return;
    }

    const newElements: SvgElement[] = [];

    svgEl.querySelectorAll("rect").forEach((r) => {
      newElements.push({
        id: crypto.randomUUID(),
        type: "rect",
        x: parseFloat(r.getAttribute("x") || "0"),
        y: parseFloat(r.getAttribute("y") || "0"),
        width: parseFloat(r.getAttribute("width") || "100"),
        height: parseFloat(r.getAttribute("height") || "100"),
        fill: r.getAttribute("fill") || "#7c3aed",
        stroke: r.getAttribute("stroke") || "none",
        strokeWidth: parseFloat(r.getAttribute("stroke-width") || "0"),
      });
    });

    svgEl.querySelectorAll("circle").forEach((c) => {
      const r = parseFloat(c.getAttribute("r") || "50");
      newElements.push({
        id: crypto.randomUUID(),
        type: "circle",
        x: parseFloat(c.getAttribute("cx") || "50"),
        y: parseFloat(c.getAttribute("cy") || "50"),
        width: r,
        height: r,
        fill: c.getAttribute("fill") || "#7c3aed",
        stroke: c.getAttribute("stroke") || "none",
        strokeWidth: parseFloat(c.getAttribute("stroke-width") || "0"),
      });
    });

    svgEl.querySelectorAll("ellipse").forEach((e) => {
      newElements.push({
        id: crypto.randomUUID(),
        type: "circle",
        x: parseFloat(e.getAttribute("cx") || "50"),
        y: parseFloat(e.getAttribute("cy") || "50"),
        width: parseFloat(e.getAttribute("rx") || "50"),
        height: parseFloat(e.getAttribute("ry") || "50"),
        fill: e.getAttribute("fill") || "#7c3aed",
        stroke: e.getAttribute("stroke") || "none",
        strokeWidth: parseFloat(e.getAttribute("stroke-width") || "0"),
      });
    });

    svgEl.querySelectorAll("line").forEach((l) => {
      newElements.push({
        id: crypto.randomUUID(),
        type: "line",
        x: parseFloat(l.getAttribute("x1") || "0"),
        y: parseFloat(l.getAttribute("y1") || "0"),
        x2: parseFloat(l.getAttribute("x2") || "100"),
        y2: parseFloat(l.getAttribute("y2") || "100"),
        width: 0,
        height: 0,
        fill: "none",
        stroke: l.getAttribute("stroke") || "#ffffff",
        strokeWidth: parseFloat(l.getAttribute("stroke-width") || "2"),
      });
    });

    svgEl.querySelectorAll("text").forEach((t) => {
      newElements.push({
        id: crypto.randomUUID(),
        type: "text",
        x: parseFloat(t.getAttribute("x") || "0"),
        y: parseFloat(t.getAttribute("y") || "0"),
        width: 0,
        height: 0,
        fill: t.getAttribute("fill") || "#ffffff",
        stroke: "none",
        strokeWidth: 0,
        text: t.textContent || "Text",
      });
    });

    setElements((prev) => [...prev, ...newElements]);
    setShowImport(false);
    setImportSvg("");
  };

  const renderPreview = () => {
    const x = Math.min(startPos.x, currentPos.x);
    const y = Math.min(startPos.y, currentPos.y);
    const w = Math.abs(currentPos.x - startPos.x);
    const h = Math.abs(currentPos.y - startPos.y);

    if (tool === "rect") {
      return (
        <rect
          x={x}
          y={y}
          width={w}
          height={h}
          fill={fillColor}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          opacity={0.6}
        />
      );
    }
    if (tool === "circle") {
      return (
        <ellipse
          cx={x + w / 2}
          cy={y + h / 2}
          rx={w / 2}
          ry={h / 2}
          fill={fillColor}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          opacity={0.6}
        />
      );
    }
    if (tool === "line") {
      return (
        <line
          x1={startPos.x}
          y1={startPos.y}
          x2={currentPos.x}
          y2={currentPos.y}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          opacity={0.6}
        />
      );
    }
    return null;
  };

  const tools: { id: Tool; label: string; icon: string }[] = [
    { id: "select", label: "Select", icon: "M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z" },
    { id: "rect", label: "Rectangle", icon: "M3 3h18v18H3V3z" },
    { id: "circle", label: "Circle", icon: "M12 2a10 10 0 100 20 10 10 0 000-20z" },
    { id: "line", label: "Line", icon: "M4 20L20 4" },
    { id: "text", label: "Text", icon: "M4 7V4h16v3M9 20h6M12 4v16" },
  ];

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">SVG Editor</h1>
        <p className="text-[var(--text-secondary)] text-sm">
          Draw shapes, lines, and text on a visual canvas. Import existing SVGs,
          export as SVG or PNG. Everything runs in your browser.
        </p>
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2 mb-4 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-3">
        {/* Tools */}
        <div className="flex gap-1">
          {tools.map((t) => (
            <button
              key={t.id}
              onClick={() => {
                setTool(t.id);
                setSelectedId(null);
              }}
              className={`p-2 rounded-lg transition-colors ${
                tool === t.id
                  ? "bg-purple-600 text-white"
                  : "hover:bg-[var(--bg-tertiary)] text-[var(--text-secondary)]"
              }`}
              title={t.label}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                <path d={t.icon} />
              </svg>
            </button>
          ))}
        </div>

        <div className="w-px h-6 bg-[var(--border)] mx-1" />

        {/* Colors */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <label className="text-xs text-[var(--text-secondary)]">Fill</label>
            <input
              type="color"
              value={fillColor}
              onChange={(e) => setFillColor(e.target.value)}
              className="w-7 h-7 rounded cursor-pointer border-0"
            />
          </div>
          <div className="flex items-center gap-1">
            <label className="text-xs text-[var(--text-secondary)]">Stroke</label>
            <input
              type="color"
              value={strokeColor}
              onChange={(e) => setStrokeColor(e.target.value)}
              className="w-7 h-7 rounded cursor-pointer border-0"
            />
          </div>
          <div className="flex items-center gap-1">
            <label className="text-xs text-[var(--text-secondary)]">Width</label>
            <input
              type="number"
              min={0}
              max={20}
              value={strokeWidth}
              onChange={(e) => setStrokeWidth(parseInt(e.target.value) || 0)}
              className="w-12 bg-[var(--bg-tertiary)] border border-[var(--border)] rounded px-1 py-0.5 text-xs text-center"
            />
          </div>
        </div>

        {tool === "text" && (
          <>
            <div className="w-px h-6 bg-[var(--border)] mx-1" />
            <input
              type="text"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder="Text to add"
              className="bg-[var(--bg-tertiary)] border border-[var(--border)] rounded px-2 py-1 text-sm w-32"
            />
          </>
        )}

        <div className="w-px h-6 bg-[var(--border)] mx-1" />

        {/* Actions */}
        <div className="flex gap-1 ml-auto">
          {selectedId && (
            <button
              onClick={deleteSelected}
              className="px-3 py-1.5 rounded-lg text-xs bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
            >
              Delete
            </button>
          )}
          <button
            onClick={() => setShowImport(!showImport)}
            className="px-3 py-1.5 rounded-lg text-xs bg-[var(--bg-tertiary)] border border-[var(--border)] hover:border-purple-500/50 transition-colors"
          >
            Import SVG
          </button>
          <button
            onClick={() => setShowCode(!showCode)}
            className="px-3 py-1.5 rounded-lg text-xs bg-[var(--bg-tertiary)] border border-[var(--border)] hover:border-purple-500/50 transition-colors"
          >
            {showCode ? "Hide Code" : "View Code"}
          </button>
          <button
            onClick={exportSvg}
            className="px-3 py-1.5 rounded-lg text-xs bg-purple-600 hover:bg-purple-700 text-white font-medium transition-colors"
          >
            Export SVG
          </button>
          <button
            onClick={exportPng}
            className="px-3 py-1.5 rounded-lg text-xs bg-[var(--bg-tertiary)] border border-[var(--border)] hover:border-purple-500/50 transition-colors"
          >
            Export PNG
          </button>
          <button
            onClick={() => {
              setElements([]);
              setSelectedId(null);
            }}
            className="px-3 py-1.5 rounded-lg text-xs text-[var(--text-secondary)] hover:text-red-400 transition-colors"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Import panel */}
      {showImport && (
        <div className="mb-4 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-4">
          <label className="text-sm font-medium block mb-2">Paste SVG Code</label>
          <textarea
            value={importSvg}
            onChange={(e) => setImportSvg(e.target.value)}
            placeholder='<svg xmlns="http://www.w3.org/2000/svg" ...>...</svg>'
            className="w-full h-32 bg-[var(--bg-tertiary)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm font-mono resize-none"
            spellCheck={false}
          />
          <div className="flex gap-2 mt-2">
            <button
              onClick={handleImport}
              className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium transition-colors"
            >
              Import
            </button>
            <button
              onClick={() => {
                setShowImport(false);
                setImportSvg("");
              }}
              className="px-4 py-2 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border)] text-sm transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Canvas */}
      <div className="border border-[var(--border)] rounded-lg overflow-hidden bg-[#1a1a2e]">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${canvasWidth} ${canvasHeight}`}
          className="w-full"
          style={{ cursor: tool === "select" ? "default" : "crosshair" }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={() => drawing && handleMouseUp()}
        >
          {/* Grid */}
          <defs>
            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />

          {/* Elements */}
          {elements.map((el) => {
            const isSelected = el.id === selectedId;
            switch (el.type) {
              case "rect":
                return (
                  <g key={el.id} onClick={() => selectElement(el.id)}>
                    <rect
                      x={el.x}
                      y={el.y}
                      width={el.width}
                      height={el.height}
                      fill={el.fill}
                      stroke={isSelected ? "#a855f7" : el.stroke}
                      strokeWidth={isSelected ? Math.max(el.strokeWidth, 3) : el.strokeWidth}
                      strokeDasharray={isSelected ? "6 3" : "none"}
                    />
                  </g>
                );
              case "circle":
                return (
                  <g key={el.id} onClick={() => selectElement(el.id)}>
                    <ellipse
                      cx={el.x}
                      cy={el.y}
                      rx={el.width}
                      ry={el.height}
                      fill={el.fill}
                      stroke={isSelected ? "#a855f7" : el.stroke}
                      strokeWidth={isSelected ? Math.max(el.strokeWidth, 3) : el.strokeWidth}
                      strokeDasharray={isSelected ? "6 3" : "none"}
                    />
                  </g>
                );
              case "line":
                return (
                  <g key={el.id} onClick={() => selectElement(el.id)}>
                    <line
                      x1={el.x}
                      y1={el.y}
                      x2={el.x2}
                      y2={el.y2}
                      stroke={isSelected ? "#a855f7" : el.stroke}
                      strokeWidth={isSelected ? Math.max(el.strokeWidth, 3) : el.strokeWidth}
                      strokeDasharray={isSelected ? "6 3" : "none"}
                    />
                  </g>
                );
              case "text":
                return (
                  <g key={el.id} onClick={() => selectElement(el.id)}>
                    <text
                      x={el.x}
                      y={el.y}
                      fill={isSelected ? "#a855f7" : el.fill}
                      fontSize={24}
                      fontFamily="Arial, sans-serif"
                    >
                      {el.text}
                    </text>
                  </g>
                );
              default:
                return null;
            }
          })}

          {/* Drawing preview */}
          {drawing && renderPreview()}
        </svg>
      </div>

      {/* Element count */}
      <div className="flex items-center justify-between mt-2 text-xs text-[var(--text-secondary)]">
        <span>{elements.length} element{elements.length !== 1 ? "s" : ""}</span>
        <span>{canvasWidth} x {canvasHeight}</span>
        {selectedId && (
          <span className="text-purple-400">
            Selected: {elements.find((e) => e.id === selectedId)?.type} (Arrow keys to move, Delete to remove)
          </span>
        )}
      </div>

      {/* Code view */}
      {showCode && (
        <div className="mt-4 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2 border-b border-[var(--border)]">
            <span className="text-xs font-medium">SVG Code</span>
            <button
              onClick={() => {
                navigator.clipboard.writeText(generateSvgCode());
              }}
              className="text-xs text-purple-400 hover:text-purple-300"
            >
              Copy
            </button>
          </div>
          <pre className="p-4 text-xs font-mono overflow-auto max-h-60 text-[var(--text-secondary)]">
            {generateSvgCode()}
          </pre>
        </div>
      )}

      <AdSlot className="mt-8" />

      {/* SEO content */}
      <section className="mt-10 text-sm text-[var(--text-secondary)] space-y-3">
        <h2 className="text-lg font-semibold text-white">About SVG Editor</h2>
        <p>
          A simple yet powerful SVG drawing tool that runs entirely in your browser.
          Draw rectangles, circles, lines, and text on a visual canvas with a grid
          overlay. Import existing SVGs to edit, and export your work as SVG or PNG.
        </p>
        <h3 className="text-base font-semibold text-white pt-2">How it works</h3>
        <ol className="list-decimal list-inside space-y-1">
          <li>Select a drawing tool from the toolbar (rectangle, circle, line, or text).</li>
          <li>Pick your fill color, stroke color, and stroke width.</li>
          <li>Click and drag on the canvas to draw shapes.</li>
          <li>Use the Select tool to click elements and move or delete them with keyboard shortcuts.</li>
          <li>Export as SVG for vector output or PNG for rasterized output.</li>
        </ol>
        <h3 className="text-base font-semibold text-white pt-2">Features</h3>
        <ul className="list-disc list-inside space-y-1">
          <li>Draw rectangles, circles/ellipses, lines, and text</li>
          <li>Color picker for fill and stroke</li>
          <li>Adjustable stroke width</li>
          <li>Select, move (arrow keys), and delete elements</li>
          <li>Import existing SVG code to edit visually</li>
          <li>View and copy generated SVG code</li>
          <li>Export as SVG or PNG</li>
          <li>No signup, no watermarks, completely free</li>
        </ul>
      </section>
    </>
  );
}
