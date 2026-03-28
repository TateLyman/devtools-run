"use client";

import { useState, useRef, useCallback } from "react";
import { PDFDocument } from "pdf-lib";
import AdSlot from "../components/AdSlot";

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export default function CompressPdfPage() {
  const [originalSize, setOriginalSize] = useState(0);
  const [compressedSize, setCompressedSize] = useState(0);
  const [compressedUrl, setCompressedUrl] = useState<string | null>(null);
  const [quality, setQuality] = useState(60);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState("");
  const [pageCount, setPageCount] = useState(0);
  const [dragOver, setDragOver] = useState(false);
  const [originalBytes, setOriginalBytes] = useState<Uint8Array | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const compressPdf = useCallback(
    async (pdfBytes: Uint8Array, name: string) => {
      setLoading(true);
      setError(null);
      setCompressedUrl(null);
      setFileName(name);
      setOriginalSize(pdfBytes.length);
      setOriginalBytes(pdfBytes);

      try {
        // Load with pdf.js to render pages, then rebuild with pdf-lib
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const pdfjsLib: any = await import("pdfjs-dist");
        pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

        const sourcePdf = await pdfjsLib.getDocument({ data: pdfBytes }).promise;
        const numPages = sourcePdf.numPages;
        setPageCount(numPages);

        const newDoc = await PDFDocument.create();

        for (let i = 1; i <= numPages; i++) {
          const page = await sourcePdf.getPage(i);
          const viewport = page.getViewport({ scale: 1.5 });
          const canvas = document.createElement("canvas");
          canvas.width = viewport.width;
          canvas.height = viewport.height;
          const ctx = canvas.getContext("2d")!;
          await page.render({ canvasContext: ctx, viewport }).promise;

          // Convert to JPEG at the specified quality
          const jpegBlob = await new Promise<Blob>((resolve) => {
            canvas.toBlob((b) => resolve(b!), "image/jpeg", quality / 100);
          });
          const jpegBytes = new Uint8Array(await jpegBlob.arrayBuffer());
          const jpegImage = await newDoc.embedJpg(jpegBytes);

          // Get original page dimensions
          const origViewport = page.getViewport({ scale: 1 });
          const newPage = newDoc.addPage([origViewport.width, origViewport.height]);
          newPage.drawImage(jpegImage, {
            x: 0,
            y: 0,
            width: origViewport.width,
            height: origViewport.height,
          });
        }

        const resultBytes = await newDoc.save();
        setCompressedSize(resultBytes.length);

        const blob = new Blob([new Uint8Array(resultBytes) as BlobPart], { type: "application/pdf" });
        const url = URL.createObjectURL(blob);
        setCompressedUrl(url);
      } catch (err) {
        setError(
          `Compression failed: ${err instanceof Error ? err.message : "Unknown error"}`
        );
      } finally {
        setLoading(false);
      }
    },
    [quality]
  );

  const handleFile = async (file: File) => {
    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      setError("Please select a PDF file.");
      return;
    }
    const bytes = new Uint8Array(await file.arrayBuffer());
    compressPdf(bytes, file.name);
  };

  const recompress = () => {
    if (originalBytes) {
      compressPdf(originalBytes, fileName);
    }
  };

  const download = () => {
    if (!compressedUrl) return;
    const a = document.createElement("a");
    a.href = compressedUrl;
    a.download = fileName.replace(/\.pdf$/i, "") + "-compressed.pdf";
    a.click();
  };

  const reduction =
    originalSize > 0 && compressedSize > 0
      ? Math.round((1 - compressedSize / originalSize) * 100)
      : 0;

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">Compress PDF</h1>
        <p className="text-[var(--text-secondary)] text-sm">
          Reduce PDF file size by re-rendering pages as compressed images. Runs
          entirely in your browser — nothing is uploaded to any server.
        </p>
      </div>

      {/* Quality setting */}
      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-medium text-[var(--text-secondary)]">
            Compression Quality
          </label>
          <span className="text-sm font-mono">{quality}%</span>
        </div>
        <input
          type="range"
          min={10}
          max={95}
          value={quality}
          onChange={(e) => setQuality(parseInt(e.target.value))}
          className="w-full accent-purple-500"
        />
        <div className="flex justify-between text-xs text-[var(--text-secondary)] mt-1">
          <span>Smaller file</span>
          <span>Higher quality</span>
        </div>
      </div>

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
          accept="application/pdf,.pdf"
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
            {dragOver ? "Drop PDF here" : "Drag & drop a PDF file, or click to browse"}
          </p>
          <p className="text-xs text-[var(--text-secondary)]">
            PDF will be compressed at {quality}% quality
          </p>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="mt-6 text-center">
          <div className="inline-block w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mb-2" />
          <p className="text-sm text-[var(--text-secondary)]">
            Compressing {pageCount} page{pageCount !== 1 ? "s" : ""}...
          </p>
        </div>
      )}

      {/* Results */}
      {compressedUrl && !loading && (
        <div className="mt-6 space-y-4">
          {/* Comparison card */}
          <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-medium">Compression Results</h2>
              <span className="text-xs text-[var(--text-secondary)]">
                {pageCount} page{pageCount !== 1 ? "s" : ""}
              </span>
            </div>

            {/* Visual bar comparison */}
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-[var(--text-secondary)]">Original</span>
                  <span className="font-mono">{formatSize(originalSize)}</span>
                </div>
                <div className="w-full bg-[var(--bg-tertiary)] rounded-full h-4 overflow-hidden">
                  <div className="h-full bg-red-500/60 rounded-full" style={{ width: "100%" }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-[var(--text-secondary)]">Compressed</span>
                  <span className="font-mono text-green-400">{formatSize(compressedSize)}</span>
                </div>
                <div className="w-full bg-[var(--bg-tertiary)] rounded-full h-4 overflow-hidden">
                  <div
                    className="h-full bg-green-500/60 rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.max(5, (compressedSize / originalSize) * 100)}%`,
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Reduction badge */}
            <div className="mt-4 flex items-center justify-center gap-3">
              {reduction > 0 ? (
                <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/30 rounded-lg px-4 py-2">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-green-400" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 17l5-5-5-5M6 17l5-5-5-5" />
                  </svg>
                  <span className="text-green-400 font-bold text-lg">{reduction}%</span>
                  <span className="text-green-400 text-sm">smaller</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/30 rounded-lg px-4 py-2">
                  <span className="text-yellow-400 text-sm">
                    File grew — try a lower quality setting
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={download}
              className="px-5 py-2.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium transition-colors"
            >
              Download Compressed PDF
            </button>
            <button
              onClick={recompress}
              className="px-4 py-2.5 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border)] hover:border-purple-500/50 text-sm font-medium transition-colors"
            >
              Re-compress at {quality}%
            </button>
            <button
              onClick={() => inputRef.current?.click()}
              className="px-4 py-2.5 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border)] hover:border-purple-500/50 text-sm font-medium transition-colors"
            >
              Choose Different PDF
            </button>
          </div>
        </div>
      )}

      <AdSlot className="mt-8" />

      {/* SEO content */}
      <section className="mt-10 text-sm text-[var(--text-secondary)] space-y-3">
        <h2 className="text-lg font-semibold text-white">About PDF Compressor</h2>
        <p>
          This tool reduces PDF file size by re-rendering each page as a compressed
          JPEG image and rebuilding the document. Everything runs in your browser
          using pdf.js and pdf-lib — your files are never uploaded anywhere.
        </p>
        <h3 className="text-base font-semibold text-white pt-2">How it works</h3>
        <ol className="list-decimal list-inside space-y-1">
          <li>Set your preferred quality level (lower = smaller file, lower fidelity).</li>
          <li>Upload or drop a PDF file.</li>
          <li>The tool renders each page and rebuilds the PDF with compressed images.</li>
          <li>Compare the before/after sizes and download the result.</li>
        </ol>
        <h3 className="text-base font-semibold text-white pt-2">Features</h3>
        <ul className="list-disc list-inside space-y-1">
          <li>100% client-side — zero server uploads</li>
          <li>Adjustable quality slider</li>
          <li>Visual before/after size comparison</li>
          <li>Re-compress with different settings without re-uploading</li>
          <li>Works on desktop and mobile browsers</li>
          <li>No signup, no watermarks, completely free</li>
        </ul>
      </section>
    </>
  );
}
