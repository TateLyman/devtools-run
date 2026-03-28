"use client";

import { useState, useRef, useCallback } from "react";
import { PDFDocument } from "pdf-lib";
import AdSlot from "../components/AdSlot";

interface ImageFile {
  id: string;
  name: string;
  size: number;
  width: number;
  height: number;
  dataUrl: string;
  bytes: Uint8Array;
  type: string;
}

type PageSize = "a4" | "letter" | "fit";

const PAGE_SIZES: Record<string, { label: string; width: number; height: number }> = {
  a4: { label: "A4 (210 x 297 mm)", width: 595.28, height: 841.89 },
  letter: { label: "US Letter (8.5 x 11 in)", width: 612, height: 792 },
  fit: { label: "Fit to Image", width: 0, height: 0 },
};

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function ImageToPdfPage() {
  const [images, setImages] = useState<ImageFile[]>([]);
  const [pageSize, setPageSize] = useState<PageSize>("a4");
  const [margin, setMargin] = useState(20);
  const [building, setBuilding] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragOverPage, setDragOverPage] = useState(false);
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const loadImages = useCallback(async (fileList: FileList | File[]) => {
    setError(null);
    const arr = Array.from(fileList);
    const valid = arr.filter((f) => f.type.startsWith("image/"));
    if (valid.length !== arr.length) {
      setError(`Skipped ${arr.length - valid.length} non-image file(s).`);
    }

    const loaded: ImageFile[] = [];
    for (const file of valid) {
      try {
        const arrayBuf = await file.arrayBuffer();
        const bytes = new Uint8Array(arrayBuf);
        const dataUrl = URL.createObjectURL(file);

        const dims = await new Promise<{ width: number; height: number }>((resolve, reject) => {
          const img = new Image();
          img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight });
          img.onerror = () => reject(new Error("Cannot read image"));
          img.src = dataUrl;
        });

        loaded.push({
          id: crypto.randomUUID(),
          name: file.name,
          size: file.size,
          width: dims.width,
          height: dims.height,
          dataUrl,
          bytes,
          type: file.type,
        });
      } catch {
        setError((prev) =>
          prev ? `${prev}\nFailed to load "${file.name}".` : `Failed to load "${file.name}".`
        );
      }
    }

    if (loaded.length > 0) {
      setImages((prev) => [...prev, ...loaded]);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOverPage(false);
      if (e.dataTransfer.files.length > 0) loadImages(e.dataTransfer.files);
    },
    [loadImages]
  );

  /* Reorder drag handlers */
  const handleRowDragStart = (idx: number) => setDragIdx(idx);
  const handleRowDragOver = (e: React.DragEvent, idx: number) => {
    e.preventDefault();
    if (dragIdx !== null && dragIdx !== idx) setDragOverIdx(idx);
  };
  const handleRowDrop = (e: React.DragEvent, idx: number) => {
    e.preventDefault();
    e.stopPropagation();
    if (dragIdx === null || dragIdx === idx) {
      setDragIdx(null);
      setDragOverIdx(null);
      return;
    }
    setImages((prev) => {
      const copy = [...prev];
      const [item] = copy.splice(dragIdx, 1);
      copy.splice(idx, 0, item);
      return copy;
    });
    setDragIdx(null);
    setDragOverIdx(null);
  };
  const handleRowDragEnd = () => {
    setDragIdx(null);
    setDragOverIdx(null);
  };

  const moveUp = (idx: number) => {
    if (idx === 0) return;
    setImages((prev) => {
      const copy = [...prev];
      [copy[idx - 1], copy[idx]] = [copy[idx], copy[idx - 1]];
      return copy;
    });
  };

  const moveDown = (idx: number) => {
    setImages((prev) => {
      if (idx >= prev.length - 1) return prev;
      const copy = [...prev];
      [copy[idx], copy[idx + 1]] = [copy[idx + 1], copy[idx]];
      return copy;
    });
  };

  const removeImage = (id: string) => setImages((prev) => prev.filter((i) => i.id !== id));
  const clearAll = () => {
    setImages([]);
    setError(null);
  };

  /* Build PDF */
  const buildPdf = async () => {
    if (images.length === 0) {
      setError("Add at least one image.");
      return;
    }
    setBuilding(true);
    setError(null);

    try {
      const pdfDoc = await PDFDocument.create();
      const marginPt = margin;

      for (const img of images) {
        let embedded;
        if (img.type === "image/png") {
          embedded = await pdfDoc.embedPng(img.bytes);
        } else if (img.type === "image/jpeg" || img.type === "image/jpg") {
          embedded = await pdfDoc.embedJpg(img.bytes);
        } else {
          // Convert other formats (WebP, etc.) to PNG via canvas
          const canvas = document.createElement("canvas");
          const imgEl = new Image();
          await new Promise<void>((resolve, reject) => {
            imgEl.onload = () => resolve();
            imgEl.onerror = () => reject(new Error("Failed to load image"));
            imgEl.src = img.dataUrl;
          });
          canvas.width = imgEl.naturalWidth;
          canvas.height = imgEl.naturalHeight;
          canvas.getContext("2d")!.drawImage(imgEl, 0, 0);
          const pngDataUrl = canvas.toDataURL("image/png");
          const pngBase64 = pngDataUrl.split(",")[1];
          const pngBytes = Uint8Array.from(atob(pngBase64), (c) => c.charCodeAt(0));
          embedded = await pdfDoc.embedPng(pngBytes);
        }

        let pageW: number, pageH: number;

        if (pageSize === "fit") {
          pageW = embedded.width + marginPt * 2;
          pageH = embedded.height + marginPt * 2;
        } else {
          const ps = PAGE_SIZES[pageSize];
          pageW = ps.width;
          pageH = ps.height;
        }

        const page = pdfDoc.addPage([pageW, pageH]);
        const availW = pageW - marginPt * 2;
        const availH = pageH - marginPt * 2;
        const imgAspect = embedded.width / embedded.height;
        const areaAspect = availW / availH;

        let drawW: number, drawH: number;
        if (imgAspect > areaAspect) {
          drawW = availW;
          drawH = availW / imgAspect;
        } else {
          drawH = availH;
          drawW = availH * imgAspect;
        }

        const x = marginPt + (availW - drawW) / 2;
        const y = marginPt + (availH - drawH) / 2;

        page.drawImage(embedded, { x, y, width: drawW, height: drawH });
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "images.pdf";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(`Build failed: ${err instanceof Error ? err.message : "Unknown error"}`);
    } finally {
      setBuilding(false);
    }
  };

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">Image to PDF Converter</h1>
        <p className="text-[var(--text-secondary)] text-sm">
          Convert multiple images into a single PDF. Drag to reorder, set page
          size and margins. Runs entirely in your browser.
        </p>
      </div>

      {/* Settings */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-4">
          <label className="text-xs font-medium text-[var(--text-secondary)] block mb-2">
            Page Size
          </label>
          <select
            value={pageSize}
            onChange={(e) => setPageSize(e.target.value as PageSize)}
            className="w-full bg-[var(--bg-tertiary)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm text-white"
          >
            {Object.entries(PAGE_SIZES).map(([key, val]) => (
              <option key={key} value={key}>
                {val.label}
              </option>
            ))}
          </select>
        </div>

        <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-4">
          <label className="text-xs font-medium text-[var(--text-secondary)] block mb-2">
            Margin: {margin}pt
          </label>
          <input
            type="range"
            min={0}
            max={72}
            value={margin}
            onChange={(e) => setMargin(parseInt(e.target.value))}
            className="w-full accent-purple-500"
          />
        </div>
      </div>

      {/* Drop zone */}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOverPage(true);
        }}
        onDragLeave={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node)) setDragOverPage(false);
        }}
        onClick={() => inputRef.current?.click()}
        className={`relative cursor-pointer rounded-lg border-2 border-dashed transition-colors ${
          dragOverPage
            ? "border-purple-500 bg-purple-500/10"
            : "border-[var(--border)] hover:border-purple-500/50 bg-[var(--bg-secondary)]"
        } p-8 text-center`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif"
          multiple
          className="hidden"
          onChange={(e) => {
            if (e.target.files) loadImages(e.target.files);
            e.target.value = "";
          }}
        />
        <div className="flex flex-col items-center gap-2">
          <svg
            className={`w-10 h-10 transition-colors ${
              dragOverPage ? "text-purple-400" : "text-[var(--text-secondary)]"
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
            {dragOverPage ? "Drop images here" : "Drag & drop images here, or click to browse"}
          </p>
          <p className="text-xs text-[var(--text-secondary)]">
            Accepts PNG, JPG, WebP, GIF
          </p>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400 whitespace-pre-line">
          {error}
        </div>
      )}

      {/* Image list */}
      {images.length > 0 && (
        <div className="mt-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium">
                {images.length} image{images.length !== 1 ? "s" : ""}
              </span>
              <span className="text-xs text-[var(--text-secondary)]">
                {formatSize(images.reduce((s, i) => s + i.size, 0))}
              </span>
            </div>
            <button
              onClick={clearAll}
              className="text-xs text-[var(--text-secondary)] hover:text-red-400 transition-colors"
            >
              Clear all
            </button>
          </div>

          <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] divide-y divide-[var(--border)] overflow-hidden">
            {images.map((img, idx) => (
              <div
                key={img.id}
                draggable
                onDragStart={() => handleRowDragStart(idx)}
                onDragOver={(e) => handleRowDragOver(e, idx)}
                onDrop={(e) => handleRowDrop(e, idx)}
                onDragEnd={handleRowDragEnd}
                className={`flex items-center gap-3 px-4 py-3 transition-colors ${
                  dragIdx === idx
                    ? "opacity-40"
                    : dragOverIdx === idx
                    ? "bg-purple-500/10"
                    : "hover:bg-[var(--bg-tertiary)]"
                }`}
              >
                {/* Drag handle */}
                <span className="cursor-grab active:cursor-grabbing text-[var(--text-secondary)] shrink-0 select-none" title="Drag to reorder">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                    <circle cx="5" cy="3" r="1.5" />
                    <circle cx="11" cy="3" r="1.5" />
                    <circle cx="5" cy="8" r="1.5" />
                    <circle cx="11" cy="8" r="1.5" />
                    <circle cx="5" cy="13" r="1.5" />
                    <circle cx="11" cy="13" r="1.5" />
                  </svg>
                </span>

                {/* Number */}
                <span className="text-xs font-mono text-[var(--text-secondary)] w-6 text-center shrink-0">
                  {idx + 1}
                </span>

                {/* Thumbnail */}
                <div className="shrink-0 w-10 h-10 rounded overflow-hidden bg-[var(--bg-tertiary)] flex items-center justify-center">
                  <img src={img.dataUrl} alt={img.name} className="w-full h-full object-cover" />
                </div>

                {/* Name + meta */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{img.name}</p>
                  <p className="text-xs text-[var(--text-secondary)]">
                    {img.width}x{img.height} &middot; {formatSize(img.size)}
                  </p>
                </div>

                {/* Reorder */}
                <div className="flex items-center gap-1 shrink-0">
                  <button onClick={() => moveUp(idx)} disabled={idx === 0} className="p-1 rounded hover:bg-[var(--bg-tertiary)] text-[var(--text-secondary)] disabled:opacity-30 transition-colors" title="Move up">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" /></svg>
                  </button>
                  <button onClick={() => moveDown(idx)} disabled={idx === images.length - 1} className="p-1 rounded hover:bg-[var(--bg-tertiary)] text-[var(--text-secondary)] disabled:opacity-30 transition-colors" title="Move down">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                  </button>
                </div>

                {/* Remove */}
                <button onClick={() => removeImage(img.id)} className="p-1 rounded hover:bg-red-500/20 text-[var(--text-secondary)] hover:text-red-400 transition-colors shrink-0" title="Remove">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
            ))}
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-3 mt-4">
            <button
              onClick={buildPdf}
              disabled={building || images.length === 0}
              className="px-5 py-2.5 rounded-lg bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium transition-colors"
            >
              {building ? "Building PDF..." : `Convert ${images.length} Image${images.length !== 1 ? "s" : ""} to PDF`}
            </button>
            <button
              onClick={() => inputRef.current?.click()}
              className="px-4 py-2.5 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border)] hover:border-purple-500/50 text-sm font-medium transition-colors"
            >
              Add More Images
            </button>
          </div>
        </div>
      )}

      <AdSlot className="mt-8" />

      {/* SEO content */}
      <section className="mt-10 text-sm text-[var(--text-secondary)] space-y-3">
        <h2 className="text-lg font-semibold text-white">About Image to PDF Converter</h2>
        <p>
          This tool combines multiple images into a single PDF document entirely
          in your browser using the pdf-lib library. Your images never leave your device.
        </p>
        <h3 className="text-base font-semibold text-white pt-2">How it works</h3>
        <ol className="list-decimal list-inside space-y-1">
          <li>Upload your images (PNG, JPG, WebP, or GIF).</li>
          <li>Drag to reorder. Set your preferred page size and margins.</li>
          <li>Click convert — the PDF downloads instantly.</li>
        </ol>
        <h3 className="text-base font-semibold text-white pt-2">Features</h3>
        <ul className="list-disc list-inside space-y-1">
          <li>100% client-side — zero server uploads</li>
          <li>Drag-and-drop reordering</li>
          <li>A4, US Letter, and fit-to-image page sizes</li>
          <li>Adjustable margins</li>
          <li>Works on desktop and mobile browsers</li>
          <li>No signup, no watermarks, completely free</li>
        </ul>
      </section>
    </>
  );
}
