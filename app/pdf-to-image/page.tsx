"use client";

import { useState, useRef, useCallback } from "react";
import JSZip from "jszip";
import AdSlot from "../components/AdSlot";

interface PageImage {
  pageNum: number;
  dataUrl: string;
  blob: Blob;
}

export default function PdfToImagePage() {
  const [pages, setPages] = useState<PageImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [format, setFormat] = useState<"png" | "jpeg">("png");
  const [quality, setQuality] = useState(90);
  const [scale, setScale] = useState(2);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const processPdf = useCallback(
    async (file: File) => {
      if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
        setError("Please select a PDF file.");
        return;
      }

      setLoading(true);
      setError(null);
      setPages([]);
      setFileName(file.name);

      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const pdfjsLib: any = await import("pdfjs-dist");
        pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        const numPages = pdf.numPages;
        setTotalPages(numPages);

        const results: PageImage[] = [];

        for (let i = 1; i <= numPages; i++) {
          setProgress(i);
          const page = await pdf.getPage(i);
          const viewport = page.getViewport({ scale });
          const canvas = document.createElement("canvas");
          canvas.width = viewport.width;
          canvas.height = viewport.height;
          const ctx = canvas.getContext("2d")!;

          await page.render({ canvasContext: ctx, viewport }).promise;

          const mimeType = format === "png" ? "image/png" : "image/jpeg";
          const qualityVal = format === "jpeg" ? quality / 100 : undefined;
          const dataUrl = canvas.toDataURL(mimeType, qualityVal);

          const blob = await new Promise<Blob>((resolve) => {
            canvas.toBlob(
              (b) => resolve(b!),
              mimeType,
              qualityVal
            );
          });

          results.push({ pageNum: i, dataUrl, blob });
        }

        setPages(results);
      } catch (err) {
        setError(
          `Failed to process PDF: ${err instanceof Error ? err.message : "Unknown error"}`
        );
      } finally {
        setLoading(false);
        setProgress(0);
      }
    },
    [format, quality, scale]
  );

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processPdf(file);
    e.target.value = "";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) processPdf(file);
  };

  const downloadPage = (page: PageImage) => {
    const ext = format === "png" ? "png" : "jpg";
    const a = document.createElement("a");
    a.href = page.dataUrl;
    a.download = `${fileName.replace(/\.pdf$/i, "")}-page-${page.pageNum}.${ext}`;
    a.click();
  };

  const downloadAll = async () => {
    if (pages.length === 0) return;
    const zip = new JSZip();
    const ext = format === "png" ? "png" : "jpg";
    const baseName = fileName.replace(/\.pdf$/i, "");

    for (const page of pages) {
      zip.file(`${baseName}-page-${page.pageNum}.${ext}`, page.blob);
    }

    const content = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(content);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${baseName}-images.zip`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">PDF to Image Converter</h1>
        <p className="text-[var(--text-secondary)] text-sm">
          Convert each page of a PDF into a high-quality PNG or JPG image.
          Everything runs in your browser — your files never leave your device.
        </p>
      </div>

      {/* Settings */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-4">
          <label className="text-xs font-medium text-[var(--text-secondary)] block mb-2">
            Format
          </label>
          <div className="flex gap-2">
            <button
              onClick={() => setFormat("png")}
              className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                format === "png"
                  ? "bg-purple-600 text-white"
                  : "bg-[var(--bg-tertiary)] border border-[var(--border)] hover:border-purple-500/50"
              }`}
            >
              PNG
            </button>
            <button
              onClick={() => setFormat("jpeg")}
              className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                format === "jpeg"
                  ? "bg-purple-600 text-white"
                  : "bg-[var(--bg-tertiary)] border border-[var(--border)] hover:border-purple-500/50"
              }`}
            >
              JPG
            </button>
          </div>
        </div>

        {format === "jpeg" && (
          <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-4">
            <label className="text-xs font-medium text-[var(--text-secondary)] block mb-2">
              Quality: {quality}%
            </label>
            <input
              type="range"
              min={10}
              max={100}
              value={quality}
              onChange={(e) => setQuality(parseInt(e.target.value))}
              className="w-full accent-purple-500"
            />
          </div>
        )}

        <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-4">
          <label className="text-xs font-medium text-[var(--text-secondary)] block mb-2">
            Scale: {scale}x
          </label>
          <input
            type="range"
            min={1}
            max={4}
            step={0.5}
            value={scale}
            onChange={(e) => setScale(parseFloat(e.target.value))}
            className="w-full accent-purple-500"
          />
        </div>
      </div>

      {/* Drop zone */}
      <div
        onDrop={handleDrop}
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
          accept="application/pdf,.pdf"
          className="hidden"
          onChange={handleFile}
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
            {dragOver ? "Drop PDF here" : "Drag & drop a PDF file, or click to browse"}
          </p>
          <p className="text-xs text-[var(--text-secondary)]">
            Converts each page to {format.toUpperCase()}
          </p>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      {/* Loading progress */}
      {loading && (
        <div className="mt-6">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-[var(--text-secondary)]">Converting pages...</span>
            <span className="font-mono">
              {progress}/{totalPages}
            </span>
          </div>
          <div className="w-full bg-[var(--bg-tertiary)] rounded-full h-2 overflow-hidden">
            <div
              className="h-full bg-purple-600 rounded-full transition-all duration-300"
              style={{ width: `${(progress / totalPages) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Results */}
      {pages.length > 0 && !loading && (
        <div className="mt-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium">
              {pages.length} page{pages.length !== 1 ? "s" : ""} converted
            </span>
            <button
              onClick={downloadAll}
              className="px-5 py-2.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium transition-colors"
            >
              Download All as ZIP
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {pages.map((page) => (
              <div
                key={page.pageNum}
                className="group bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg overflow-hidden hover:border-purple-500/50 transition-colors"
              >
                <div className="aspect-[3/4] overflow-hidden bg-white flex items-center justify-center">
                  <img
                    src={page.dataUrl}
                    alt={`Page ${page.pageNum}`}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="p-2 flex items-center justify-between">
                  <span className="text-xs text-[var(--text-secondary)]">
                    Page {page.pageNum}
                  </span>
                  <button
                    onClick={() => downloadPage(page)}
                    className="text-xs text-purple-400 hover:text-purple-300 font-medium transition-colors"
                  >
                    Download
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <AdSlot className="mt-8" />

      {/* SEO content */}
      <section className="mt-10 text-sm text-[var(--text-secondary)] space-y-3">
        <h2 className="text-lg font-semibold text-white">About PDF to Image Converter</h2>
        <p>
          This tool converts each page of a PDF document into a high-quality image (PNG or JPG).
          Everything is processed client-side using pdf.js — your files never leave your browser.
        </p>
        <h3 className="text-base font-semibold text-white pt-2">How it works</h3>
        <ol className="list-decimal list-inside space-y-1">
          <li>Select your output format (PNG for lossless, JPG for smaller files).</li>
          <li>Adjust the scale and quality settings to your needs.</li>
          <li>Upload or drop a PDF — pages are converted instantly.</li>
          <li>Download individual pages or grab them all as a ZIP.</li>
        </ol>
        <h3 className="text-base font-semibold text-white pt-2">Features</h3>
        <ul className="list-disc list-inside space-y-1">
          <li>100% client-side — zero server uploads</li>
          <li>PNG and JPEG output with quality control</li>
          <li>Adjustable render scale (1x to 4x)</li>
          <li>Download individual pages or all as ZIP</li>
          <li>Works on desktop and mobile browsers</li>
          <li>No signup, no watermarks, completely free</li>
        </ul>
      </section>
    </>
  );
}
