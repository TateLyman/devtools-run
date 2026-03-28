"use client";

import { useState, useRef, useCallback } from "react";
import { PDFDocument } from "pdf-lib";

import AdSlot from "../components/AdSlot";

interface PdfFile {
  id: string;
  name: string;
  size: number;
  pageCount: number;
  bytes: Uint8Array;
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function PdfMergePage() {
  const [files, setFiles] = useState<PdfFile[]>([]);
  const [merging, setMerging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragOverPage, setDragOverPage] = useState(false);
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  /* ── Load PDFs ── */

  const loadFiles = useCallback(async (fileList: FileList | File[]) => {
    setError(null);
    const arr = Array.from(fileList);
    const nonPdf = arr.filter((f) => f.type !== "application/pdf" && !f.name.toLowerCase().endsWith(".pdf"));
    if (nonPdf.length > 0) {
      setError(`Skipped non-PDF file${nonPdf.length > 1 ? "s" : ""}: ${nonPdf.map((f) => f.name).join(", ")}`);
    }
    const pdfs = arr.filter((f) => f.type === "application/pdf" || f.name.toLowerCase().endsWith(".pdf"));

    const loaded: PdfFile[] = [];
    for (const file of pdfs) {
      try {
        const buf = await file.arrayBuffer();
        const bytes = new Uint8Array(buf);
        const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
        loaded.push({
          id: crypto.randomUUID(),
          name: file.name,
          size: file.size,
          pageCount: doc.getPageCount(),
          bytes,
        });
      } catch {
        setError((prev) =>
          prev
            ? `${prev}\nFailed to read "${file.name}" — it may be corrupted or password-protected.`
            : `Failed to read "${file.name}" — it may be corrupted or password-protected.`
        );
      }
    }

    if (loaded.length > 0) {
      setFiles((prev) => [...prev, ...loaded]);
    }
  }, []);

  /* ── Drag-and-drop onto the drop zone ── */

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOverPage(false);
      if (e.dataTransfer.files.length > 0) {
        loadFiles(e.dataTransfer.files);
      }
    },
    [loadFiles]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOverPage(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    if (e.currentTarget === e.target || !e.currentTarget.contains(e.relatedTarget as Node)) {
      setDragOverPage(false);
    }
  }, []);

  /* ── Reorder by dragging list items ── */

  const handleRowDragStart = useCallback((idx: number) => {
    setDragIdx(idx);
  }, []);

  const handleRowDragOver = useCallback(
    (e: React.DragEvent, idx: number) => {
      e.preventDefault();
      if (dragIdx === null || dragIdx === idx) return;
      setDragOverIdx(idx);
    },
    [dragIdx]
  );

  const handleRowDrop = useCallback(
    (e: React.DragEvent, idx: number) => {
      e.preventDefault();
      e.stopPropagation();
      if (dragIdx === null || dragIdx === idx) {
        setDragIdx(null);
        setDragOverIdx(null);
        return;
      }
      setFiles((prev) => {
        const copy = [...prev];
        const [item] = copy.splice(dragIdx, 1);
        copy.splice(idx, 0, item);
        return copy;
      });
      setDragIdx(null);
      setDragOverIdx(null);
    },
    [dragIdx]
  );

  const handleRowDragEnd = useCallback(() => {
    setDragIdx(null);
    setDragOverIdx(null);
  }, []);

  /* ── Move / Remove helpers ── */

  const moveUp = (idx: number) => {
    if (idx === 0) return;
    setFiles((prev) => {
      const copy = [...prev];
      [copy[idx - 1], copy[idx]] = [copy[idx], copy[idx - 1]];
      return copy;
    });
  };

  const moveDown = (idx: number) => {
    setFiles((prev) => {
      if (idx >= prev.length - 1) return prev;
      const copy = [...prev];
      [copy[idx], copy[idx + 1]] = [copy[idx + 1], copy[idx]];
      return copy;
    });
  };

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const clearAll = () => {
    setFiles([]);
    setError(null);
  };

  /* ── Merge ── */

  const merge = async () => {
    if (files.length < 2) {
      setError("Add at least 2 PDF files to merge.");
      return;
    }
    setMerging(true);
    setError(null);

    try {
      const merged = await PDFDocument.create();

      for (const file of files) {
        const src = await PDFDocument.load(file.bytes, { ignoreEncryption: true });
        const pages = await merged.copyPages(src, src.getPageIndices());
        for (const page of pages) {
          merged.addPage(page);
        }
      }

      const pdfBytes = await merged.save();
      const blob = new Blob([new Uint8Array(pdfBytes) as BlobPart], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "merged.pdf";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(`Merge failed: ${err instanceof Error ? err.message : "Unknown error"}`);
    } finally {
      setMerging(false);
    }
  };

  /* ── Total stats ── */

  const totalPages = files.reduce((sum, f) => sum + f.pageCount, 0);
  const totalSize = files.reduce((sum, f) => sum + f.size, 0);

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">Merge PDF Files</h1>
        <p className="text-[var(--text-secondary)] text-sm">
          Combine multiple PDF files into one. Drag to reorder, then download
          the merged result. Runs entirely in your browser — your files never
          leave your device.
        </p>
      </div>

      {/* ── Drop zone ── */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
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
          accept="application/pdf,.pdf"
          multiple
          className="hidden"
          onChange={(e) => {
            if (e.target.files) loadFiles(e.target.files);
            e.target.value = "";
          }}
        />
        <div className="flex flex-col items-center gap-2">
          <svg
            className={`w-10 h-10 transition-colors ${dragOverPage ? "text-purple-400" : "text-[var(--text-secondary)]"}`}
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
            {dragOverPage ? "Drop PDF files here" : "Drag & drop PDF files here, or click to browse"}
          </p>
          <p className="text-xs text-[var(--text-secondary)]">
            Accepts multiple .pdf files
          </p>
        </div>
      </div>

      {/* ── Error ── */}
      {error && (
        <div className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400 whitespace-pre-line">
          {error}
        </div>
      )}

      {/* ── File list ── */}
      {files.length > 0 && (
        <div className="mt-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <label className="text-sm font-medium">
                {files.length} file{files.length !== 1 ? "s" : ""}
              </label>
              <span className="text-xs text-[var(--text-secondary)]">
                {totalPages} page{totalPages !== 1 ? "s" : ""} &middot;{" "}
                {formatSize(totalSize)}
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
            {files.map((file, idx) => (
              <div
                key={file.id}
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
                <span
                  className="cursor-grab active:cursor-grabbing text-[var(--text-secondary)] shrink-0 select-none"
                  title="Drag to reorder"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                  >
                    <circle cx="5" cy="3" r="1.5" />
                    <circle cx="11" cy="3" r="1.5" />
                    <circle cx="5" cy="8" r="1.5" />
                    <circle cx="11" cy="8" r="1.5" />
                    <circle cx="5" cy="13" r="1.5" />
                    <circle cx="11" cy="13" r="1.5" />
                  </svg>
                </span>

                {/* File number */}
                <span className="text-xs font-mono text-[var(--text-secondary)] w-6 text-center shrink-0">
                  {idx + 1}
                </span>

                {/* PDF icon */}
                <span className="shrink-0">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    className="text-red-400"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M7 21h10a2 2 0 002-2V9l-5-5H7a2 2 0 00-2 2v13a2 2 0 002 2z"
                    />
                    <polyline
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      points="14 4 14 9 19 9"
                    />
                  </svg>
                </span>

                {/* Name + meta */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{file.name}</p>
                  <p className="text-xs text-[var(--text-secondary)]">
                    {file.pageCount} page{file.pageCount !== 1 ? "s" : ""}{" "}
                    &middot; {formatSize(file.size)}
                  </p>
                </div>

                {/* Reorder buttons */}
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => moveUp(idx)}
                    disabled={idx === 0}
                    className="p-1 rounded hover:bg-[var(--bg-tertiary)] text-[var(--text-secondary)] disabled:opacity-30 transition-colors"
                    title="Move up"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
                    </svg>
                  </button>
                  <button
                    onClick={() => moveDown(idx)}
                    disabled={idx === files.length - 1}
                    className="p-1 rounded hover:bg-[var(--bg-tertiary)] text-[var(--text-secondary)] disabled:opacity-30 transition-colors"
                    title="Move down"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>

                {/* Remove */}
                <button
                  onClick={() => removeFile(file.id)}
                  className="p-1 rounded hover:bg-red-500/20 text-[var(--text-secondary)] hover:text-red-400 transition-colors shrink-0"
                  title="Remove file"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>

          {/* ── Action buttons ── */}
          <div className="flex flex-wrap items-center gap-3 mt-4">
            <button
              onClick={merge}
              disabled={merging || files.length < 2}
              className="px-5 py-2.5 rounded-lg bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium transition-colors"
            >
              {merging ? "Merging..." : `Merge ${files.length} Files into One PDF`}
            </button>
            <button
              onClick={() => inputRef.current?.click()}
              className="px-4 py-2.5 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border)] hover:border-purple-500/50 text-sm font-medium transition-colors"
            >
              Add More Files
            </button>
          </div>
        </div>
      )}

      <AdSlot className="mt-8" />

      {/* ── SEO / About section ── */}
      <section className="mt-10 text-sm text-[var(--text-secondary)] space-y-3">
        <h2 className="text-lg font-semibold text-white">
          About PDF Merger
        </h2>
        <p>
          This tool combines multiple PDF files into a single document entirely
          in your browser. No files are uploaded to any server — everything is
          processed client-side using the pdf-lib library. Your documents stay
          private.
        </p>
        <p>
          Drag and drop your PDFs, reorder them however you like, then click
          merge to download the combined file. Works with any standard PDF,
          including multi-page documents.
        </p>
        <h3 className="text-base font-semibold text-white pt-2">
          How it works
        </h3>
        <ol className="list-decimal list-inside space-y-1">
          <li>
            Drop or select the PDF files you want to combine.
          </li>
          <li>
            Drag the rows to set the order they appear in the merged PDF.
          </li>
          <li>
            Click <strong className="text-white">Merge</strong> — the combined
            PDF downloads instantly.
          </li>
        </ol>
        <h3 className="text-base font-semibold text-white pt-2">
          Features
        </h3>
        <ul className="list-disc list-inside space-y-1">
          <li>100% client-side — zero server uploads</li>
          <li>Drag-and-drop reordering</li>
          <li>Page count and file size preview</li>
          <li>Works on desktop and mobile browsers</li>
          <li>No signup, no watermarks, completely free</li>
        </ul>
      </section>
    </>
  );
}
