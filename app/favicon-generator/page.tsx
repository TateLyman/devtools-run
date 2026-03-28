"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import JSZip from "jszip";
import AdSlot from "../components/AdSlot";

interface FaviconSize {
  size: number;
  label: string;
  filename: string;
}

const FAVICON_SIZES: FaviconSize[] = [
  { size: 16, label: "16x16", filename: "favicon-16x16.png" },
  { size: 32, label: "32x32", filename: "favicon-32x32.png" },
  { size: 48, label: "48x48", filename: "favicon-48x48.png" },
  { size: 180, label: "180x180", filename: "apple-touch-icon.png" },
  { size: 192, label: "192x192", filename: "android-chrome-192x192.png" },
  { size: 512, label: "512x512", filename: "android-chrome-512x512.png" },
];

export default function FaviconGeneratorPage() {
  const [sourceImage, setSourceImage] = useState<string | null>(null);
  const [sourceFileName, setSourceFileName] = useState("");
  const [previews, setPreviews] = useState<Map<number, string>>(new Map());
  const [generating, setGenerating] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [bgColor, setBgColor] = useState("#000000");
  const [useBg, setUseBg] = useState(false);
  const [padding, setPadding] = useState(0);
  const [rounded, setRounded] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const masterCanvasRef = useRef<HTMLCanvasElement>(null);

  // Design-from-scratch state
  const [mode, setMode] = useState<"upload" | "design">("upload");
  const [designText, setDesignText] = useState("AB");
  const [designBg, setDesignBg] = useState("#7c3aed");
  const [designFg, setDesignFg] = useState("#ffffff");
  const [designRounded, setDesignRounded] = useState(true);
  const designCanvasRef = useRef<HTMLCanvasElement>(null);

  // Generate design favicon
  const renderDesign = useCallback(() => {
    const canvas = designCanvasRef.current;
    if (!canvas) return;
    const size = 512;
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d")!;
    ctx.clearRect(0, 0, size, size);

    if (designRounded) {
      ctx.beginPath();
      const r = size * 0.15;
      ctx.moveTo(r, 0);
      ctx.lineTo(size - r, 0);
      ctx.quadraticCurveTo(size, 0, size, r);
      ctx.lineTo(size, size - r);
      ctx.quadraticCurveTo(size, size, size - r, size);
      ctx.lineTo(r, size);
      ctx.quadraticCurveTo(0, size, 0, size - r);
      ctx.lineTo(0, r);
      ctx.quadraticCurveTo(0, 0, r, 0);
      ctx.closePath();
      ctx.clip();
    }

    ctx.fillStyle = designBg;
    ctx.fillRect(0, 0, size, size);

    ctx.fillStyle = designFg;
    const fontSize =
      designText.length <= 1
        ? size * 0.6
        : designText.length <= 2
        ? size * 0.45
        : designText.length <= 3
        ? size * 0.35
        : size * 0.28;
    ctx.font = `bold ${fontSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(designText.slice(0, 4), size / 2, size / 2 + size * 0.03);

    setSourceImage(canvas.toDataURL("image/png"));
  }, [designText, designBg, designFg, designRounded]);

  useEffect(() => {
    if (mode === "design") renderDesign();
  }, [mode, renderDesign]);

  // Generate all favicon sizes when source changes
  useEffect(() => {
    if (!sourceImage) {
      setPreviews(new Map());
      return;
    }

    const img = new Image();
    img.onload = () => {
      const newPreviews = new Map<number, string>();

      for (const { size } of FAVICON_SIZES) {
        const canvas = document.createElement("canvas");
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext("2d")!;

        // Optional background
        if (useBg) {
          ctx.fillStyle = bgColor;
          if (rounded) {
            const r = size * 0.15;
            ctx.beginPath();
            ctx.moveTo(r, 0);
            ctx.lineTo(size - r, 0);
            ctx.quadraticCurveTo(size, 0, size, r);
            ctx.lineTo(size, size - r);
            ctx.quadraticCurveTo(size, size, size - r, size);
            ctx.lineTo(r, size);
            ctx.quadraticCurveTo(0, size, 0, size - r);
            ctx.lineTo(0, r);
            ctx.quadraticCurveTo(0, 0, r, 0);
            ctx.closePath();
            ctx.fill();
            ctx.clip();
          } else {
            ctx.fillRect(0, 0, size, size);
          }
        } else if (rounded) {
          const r = size * 0.15;
          ctx.beginPath();
          ctx.moveTo(r, 0);
          ctx.lineTo(size - r, 0);
          ctx.quadraticCurveTo(size, 0, size, r);
          ctx.lineTo(size, size - r);
          ctx.quadraticCurveTo(size, size, size - r, size);
          ctx.lineTo(r, size);
          ctx.quadraticCurveTo(0, size, 0, size - r);
          ctx.lineTo(0, r);
          ctx.quadraticCurveTo(0, 0, r, 0);
          ctx.closePath();
          ctx.clip();
        }

        const p = (padding / 100) * size;
        ctx.drawImage(img, p, p, size - p * 2, size - p * 2);
        newPreviews.set(size, canvas.toDataURL("image/png"));
      }

      setPreviews(newPreviews);
    };
    img.src = sourceImage;
  }, [sourceImage, bgColor, useBg, padding, rounded]);

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    setSourceFileName(file.name);
    setMode("upload");

    const reader = new FileReader();
    reader.onload = (e) => {
      setSourceImage(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const downloadSingle = (size: number) => {
    const dataUrl = previews.get(size);
    if (!dataUrl) return;
    const info = FAVICON_SIZES.find((s) => s.size === size);
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = info?.filename || `favicon-${size}x${size}.png`;
    a.click();
  };

  const downloadIco = async () => {
    // Generate a .ico file with 16x16, 32x32, and 48x48 sizes
    // ICO format: header + directory entries + image data (stored as PNGs)
    const sizes = [16, 32, 48];
    const images: Uint8Array[] = [];

    for (const size of sizes) {
      const dataUrl = previews.get(size);
      if (!dataUrl) continue;
      const res = await fetch(dataUrl);
      const blob = await res.blob();
      images.push(new Uint8Array(await blob.arrayBuffer()));
    }

    if (images.length === 0) return;

    // ICO header: 6 bytes
    // Directory entries: 16 bytes each
    // Image data follows
    const headerSize = 6 + images.length * 16;
    let totalSize = headerSize;
    for (const img of images) totalSize += img.length;

    const buffer = new ArrayBuffer(totalSize);
    const view = new DataView(buffer);

    // Header
    view.setUint16(0, 0, true); // Reserved
    view.setUint16(2, 1, true); // Type: ICO
    view.setUint16(4, images.length, true); // Count

    let offset = headerSize;
    for (let i = 0; i < images.length; i++) {
      const size = sizes[i];
      const dirOffset = 6 + i * 16;
      view.setUint8(dirOffset, size < 256 ? size : 0); // Width
      view.setUint8(dirOffset + 1, size < 256 ? size : 0); // Height
      view.setUint8(dirOffset + 2, 0); // Color palette
      view.setUint8(dirOffset + 3, 0); // Reserved
      view.setUint16(dirOffset + 4, 1, true); // Color planes
      view.setUint16(dirOffset + 6, 32, true); // Bits per pixel
      view.setUint32(dirOffset + 8, images[i].length, true); // Image size
      view.setUint32(dirOffset + 12, offset, true); // Offset

      const arr = new Uint8Array(buffer, offset, images[i].length);
      arr.set(images[i]);
      offset += images[i].length;
    }

    const blob = new Blob([buffer], { type: "image/x-icon" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "favicon.ico";
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadAllZip = async () => {
    setGenerating(true);
    try {
      const zip = new JSZip();

      for (const { size, filename } of FAVICON_SIZES) {
        const dataUrl = previews.get(size);
        if (!dataUrl) continue;
        const res = await fetch(dataUrl);
        const blob = await res.blob();
        zip.file(filename, blob);
      }

      // Generate .ico
      const icoSizes = [16, 32, 48];
      const icoImages: Uint8Array[] = [];
      for (const size of icoSizes) {
        const dataUrl = previews.get(size);
        if (!dataUrl) continue;
        const res = await fetch(dataUrl);
        const blob = await res.blob();
        icoImages.push(new Uint8Array(await blob.arrayBuffer()));
      }

      if (icoImages.length > 0) {
        const headerSize = 6 + icoImages.length * 16;
        let totalSize = headerSize;
        for (const img of icoImages) totalSize += img.length;
        const buffer = new ArrayBuffer(totalSize);
        const view = new DataView(buffer);
        view.setUint16(0, 0, true);
        view.setUint16(2, 1, true);
        view.setUint16(4, icoImages.length, true);
        let offset = headerSize;
        for (let i = 0; i < icoImages.length; i++) {
          const size = icoSizes[i];
          const dirOffset = 6 + i * 16;
          view.setUint8(dirOffset, size < 256 ? size : 0);
          view.setUint8(dirOffset + 1, size < 256 ? size : 0);
          view.setUint8(dirOffset + 2, 0);
          view.setUint8(dirOffset + 3, 0);
          view.setUint16(dirOffset + 4, 1, true);
          view.setUint16(dirOffset + 6, 32, true);
          view.setUint32(dirOffset + 8, icoImages[i].length, true);
          view.setUint32(dirOffset + 12, offset, true);
          const arr = new Uint8Array(buffer, offset, icoImages[i].length);
          arr.set(icoImages[i]);
          offset += icoImages[i].length;
        }
        zip.file("favicon.ico", new Uint8Array(buffer));
      }

      // Add HTML snippet
      const html = `<!-- Favicon HTML -->\n<link rel="icon" type="image/x-icon" href="/favicon.ico">\n<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">\n<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">\n<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">\n<link rel="manifest" href="/site.webmanifest">`;
      zip.file("favicon-html.txt", html);

      // Add webmanifest
      const manifest = JSON.stringify(
        {
          name: "",
          short_name: "",
          icons: [
            { src: "/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
            { src: "/android-chrome-512x512.png", sizes: "512x512", type: "image/png" },
          ],
          theme_color: "#ffffff",
          background_color: "#ffffff",
          display: "standalone",
        },
        null,
        2
      );
      zip.file("site.webmanifest", manifest);

      const content = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(content);
      const a = document.createElement("a");
      a.href = url;
      a.download = "favicons.zip";
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">Favicon Generator</h1>
        <p className="text-[var(--text-secondary)] text-sm">
          Generate favicons in all required sizes from any image, or design one
          from scratch. Creates favicon.ico, apple-touch-icon, and android-chrome
          icons. Download individually or as a ZIP.
        </p>
      </div>

      {/* Mode toggle */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setMode("upload")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            mode === "upload"
              ? "bg-purple-600 text-white"
              : "bg-[var(--bg-secondary)] border border-[var(--border)] hover:border-purple-500/50"
          }`}
        >
          Upload Image
        </button>
        <button
          onClick={() => setMode("design")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            mode === "design"
              ? "bg-purple-600 text-white"
              : "bg-[var(--bg-secondary)] border border-[var(--border)] hover:border-purple-500/50"
          }`}
        >
          Design from Scratch
        </button>
      </div>

      {mode === "upload" ? (
        <>
          {/* Drop zone */}
          <div
            onDrop={(e) => {
              e.preventDefault();
              setDragOver(false);
              const file = e.dataTransfer.files[0];
              if (file) handleFile(file);
            }}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={(e) => {
              if (!e.currentTarget.contains(e.relatedTarget as Node)) setDragOver(false);
            }}
            onClick={() => inputRef.current?.click()}
            className={`relative cursor-pointer rounded-lg border-2 border-dashed transition-colors ${
              dragOver
                ? "border-purple-500 bg-purple-500/10"
                : "border-[var(--border)] hover:border-purple-500/50 bg-[var(--bg-secondary)]"
            } p-8 text-center`}
          >
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFile(file);
                e.target.value = "";
              }}
            />
            <div className="flex flex-col items-center gap-2">
              <svg
                className={`w-10 h-10 transition-colors ${
                  dragOver ? "text-purple-400" : "text-[var(--text-secondary)]"
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 16V4m0 0L8 8m4-4l4 4M2 17l.621 2.485A2 2 0 004.561 21h14.878a2 2 0 001.94-1.515L22 17"
                />
              </svg>
              <p className="text-sm font-medium">
                {dragOver ? "Drop image here" : "Drag & drop an image, or click to browse"}
              </p>
              <p className="text-xs text-[var(--text-secondary)]">
                PNG, JPG, SVG, WebP — any image works
              </p>
            </div>
          </div>

          {/* Upload options */}
          {sourceImage && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
              <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-4">
                <label className="text-xs font-medium text-[var(--text-secondary)] flex items-center gap-2 mb-2">
                  <input
                    type="checkbox"
                    checked={useBg}
                    onChange={(e) => setUseBg(e.target.checked)}
                    className="accent-purple-500"
                  />
                  Background Color
                </label>
                {useBg && (
                  <input
                    type="color"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="w-full h-8 rounded cursor-pointer"
                  />
                )}
              </div>
              <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-4">
                <label className="text-xs font-medium text-[var(--text-secondary)] block mb-2">
                  Padding: {padding}%
                </label>
                <input
                  type="range"
                  min={0}
                  max={30}
                  value={padding}
                  onChange={(e) => setPadding(parseInt(e.target.value))}
                  className="w-full accent-purple-500"
                />
              </div>
              <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-4 flex items-center">
                <label className="text-xs font-medium text-[var(--text-secondary)] flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={rounded}
                    onChange={(e) => setRounded(e.target.checked)}
                    className="accent-purple-500"
                  />
                  Rounded Corners
                </label>
              </div>
            </div>
          )}
        </>
      ) : (
        /* Design from scratch */
        <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-6 space-y-4">
          <div className="flex justify-center">
            <canvas
              ref={designCanvasRef}
              className="w-32 h-32 rounded-xl border border-[var(--border)]"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-[var(--text-secondary)] block mb-1">
              Text (1-4 characters)
            </label>
            <input
              value={designText}
              onChange={(e) => setDesignText(e.target.value)}
              maxLength={4}
              className="w-full bg-[var(--bg-tertiary)] border border-[var(--border)] rounded-lg px-3 py-2 text-center text-lg font-mono"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-xs text-[var(--text-secondary)] block mb-1">Background</label>
              <input
                type="color"
                value={designBg}
                onChange={(e) => setDesignBg(e.target.value)}
                className="w-full h-10 rounded cursor-pointer"
              />
            </div>
            <div>
              <label className="text-xs text-[var(--text-secondary)] block mb-1">Text Color</label>
              <input
                type="color"
                value={designFg}
                onChange={(e) => setDesignFg(e.target.value)}
                className="w-full h-10 rounded cursor-pointer"
              />
            </div>
            <div className="flex items-end pb-1">
              <label className="text-xs font-medium text-[var(--text-secondary)] flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={designRounded}
                  onChange={(e) => setDesignRounded(e.target.checked)}
                  className="accent-purple-500"
                />
                Rounded
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Browser tab preview */}
      {previews.size > 0 && (
        <div className="mt-6">
          <h2 className="text-sm font-medium mb-3">Browser Tab Preview</h2>
          <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-4">
            <div className="bg-[#2a2a3e] rounded-t-lg px-3 pt-2">
              <div className="flex items-center gap-2 bg-[#1a1a2e] rounded-t-lg px-3 py-2 max-w-xs">
                {previews.get(16) && (
                  <img
                    src={previews.get(16)}
                    alt="favicon preview"
                    className="w-4 h-4"
                  />
                )}
                <span className="text-xs text-[var(--text-secondary)] truncate">
                  My Website — Home Page
                </span>
                <span className="ml-auto text-[var(--text-secondary)] text-xs">x</span>
              </div>
            </div>
            <div className="bg-[#1a1a2e] h-8 rounded-b-lg flex items-center px-3">
              <div className="flex items-center gap-1 bg-[#2a2a3e] rounded-full px-3 py-1 text-xs text-[var(--text-secondary)] flex-1 max-w-md">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <rect x="3" y="11" width="18" height="11" rx="2" />
                  <path d="M7 11V7a5 5 0 0110 0v4" />
                </svg>
                mywebsite.com
              </div>
            </div>
          </div>
        </div>
      )}

      {/* All sizes */}
      {previews.size > 0 && (
        <div className="mt-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-medium">Generated Sizes</h2>
            <div className="flex gap-2">
              <button
                onClick={downloadIco}
                className="px-4 py-2 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border)] hover:border-purple-500/50 text-sm font-medium transition-colors"
              >
                Download .ico
              </button>
              <button
                onClick={downloadAllZip}
                disabled={generating}
                className="px-5 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white text-sm font-medium transition-colors"
              >
                {generating ? "Generating..." : "Download All (ZIP)"}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {FAVICON_SIZES.map(({ size, label, filename }) => {
              const dataUrl = previews.get(size);
              if (!dataUrl) return null;
              return (
                <div
                  key={size}
                  className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-3 flex flex-col items-center gap-2 hover:border-purple-500/50 transition-colors"
                >
                  <div
                    className="flex items-center justify-center"
                    style={{ width: Math.min(size, 64), height: Math.min(size, 64) }}
                  >
                    <img
                      src={dataUrl}
                      alt={label}
                      style={{
                        width: Math.min(size, 64),
                        height: Math.min(size, 64),
                        imageRendering: size <= 32 ? "pixelated" : "auto",
                      }}
                    />
                  </div>
                  <div className="text-center">
                    <p className="text-xs font-mono">{label}</p>
                    <p className="text-[10px] text-[var(--text-secondary)] truncate max-w-full">
                      {filename}
                    </p>
                  </div>
                  <button
                    onClick={() => downloadSingle(size)}
                    className="text-xs text-purple-400 hover:text-purple-300 font-medium transition-colors"
                  >
                    Download
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* HTML snippet */}
      {previews.size > 0 && (
        <div className="mt-6 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2 border-b border-[var(--border)]">
            <span className="text-xs font-medium">HTML Code</span>
            <button
              onClick={() => {
                const html = `<link rel="icon" type="image/x-icon" href="/favicon.ico">\n<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">\n<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">\n<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">\n<link rel="manifest" href="/site.webmanifest">`;
                navigator.clipboard.writeText(html);
              }}
              className="text-xs text-purple-400 hover:text-purple-300"
            >
              Copy
            </button>
          </div>
          <pre className="p-4 text-xs font-mono overflow-auto text-[var(--text-secondary)]">
{`<link rel="icon" type="image/x-icon" href="/favicon.ico">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">`}
          </pre>
        </div>
      )}

      <canvas ref={masterCanvasRef} className="hidden" />

      <AdSlot className="mt-8" />

      {/* SEO content */}
      <section className="mt-10 text-sm text-[var(--text-secondary)] space-y-3">
        <h2 className="text-lg font-semibold text-white">About Favicon Generator</h2>
        <p>
          This tool generates favicons in all the sizes your website needs from a single
          image or a text-based design. Creates favicon.ico, apple-touch-icon, android-chrome
          icons, and more. Everything runs in your browser — no images uploaded.
        </p>
        <h3 className="text-base font-semibold text-white pt-2">What you get</h3>
        <ul className="list-disc list-inside space-y-1">
          <li>favicon.ico (16x16, 32x32, 48x48 combined)</li>
          <li>favicon-16x16.png and favicon-32x32.png</li>
          <li>apple-touch-icon.png (180x180)</li>
          <li>android-chrome-192x192.png and android-chrome-512x512.png</li>
          <li>site.webmanifest file</li>
          <li>Ready-to-use HTML code snippet</li>
        </ul>
        <h3 className="text-base font-semibold text-white pt-2">Features</h3>
        <ul className="list-disc list-inside space-y-1">
          <li>Upload any image or design from scratch with text</li>
          <li>Optional background color, padding, and rounded corners</li>
          <li>Live browser tab preview</li>
          <li>Download individual sizes or all as a ZIP</li>
          <li>Generates real .ico files (not just renamed PNG)</li>
          <li>No signup, no watermarks, completely free</li>
        </ul>
      </section>
    </>
  );
}
