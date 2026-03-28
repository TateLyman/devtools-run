"use client";
import { useState, useRef, useCallback } from "react";
import { PDFDocument } from "pdf-lib";

type SplitMode = "extract" | "individual" | "chunks";

export default function PdfSplitPage() {
  const [pdfBytes, setPdfBytes] = useState<Uint8Array | null>(null);
  const [fileName, setFileName] = useState("");
  const [pageCount, setPageCount] = useState(0);
  const [thumbnails, setThumbnails] = useState<string[]>([]);
  const [mode, setMode] = useState<SplitMode>("extract");
  const [extractPages, setExtractPages] = useState("");
  const [chunkSize, setChunkSize] = useState(5);
  const [processing, setProcessing] = useState(false);
  const [results, setResults] = useState<{ name: string; url: string }[]>([]);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const generateThumbnails = useCallback(async (data: Uint8Array, count: number) => {
    const thumbs: string[] = [];
    try {
      const blob = new Blob([data.buffer as ArrayBuffer], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const pdfjsLib: any = await import("pdfjs-dist");
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;
      const pdf = await pdfjsLib.getDocument(url).promise;
      const maxThumbs = Math.min(count, 20);
      for (let i = 1; i <= maxThumbs; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 0.3 });
        const canvas = document.createElement("canvas");
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext("2d")!;
        await page.render({ canvasContext: ctx, viewport }).promise;
        thumbs.push(canvas.toDataURL("image/jpeg", 0.6));
      }
      URL.revokeObjectURL(url);
    } catch {
      // thumbnails are optional — fall back to numbered placeholders
    }
    setThumbnails(thumbs);
  }, []);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError("");
    setResults([]);
    setThumbnails([]);
    try {
      const bytes = new Uint8Array(await file.arrayBuffer());
      const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
      const count = doc.getPageCount();
      setPdfBytes(bytes);
      setFileName(file.name.replace(/\.pdf$/i, ""));
      setPageCount(count);
      setExtractPages(`1-${count}`);
      generateThumbnails(bytes, count);
    } catch {
      setError("Failed to read PDF. The file may be corrupted or password-protected.");
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type === "application/pdf") {
      const input = fileRef.current;
      if (input) {
        const dt = new DataTransfer();
        dt.items.add(file);
        input.files = dt.files;
        input.dispatchEvent(new Event("change", { bubbles: true }));
      }
    }
  };

  // Parse page ranges like "1,3,5-8"
  function parsePageRanges(input: string, max: number): number[] {
    const pages = new Set<number>();
    const parts = input.split(",").map((s) => s.trim()).filter(Boolean);
    for (const part of parts) {
      if (part.includes("-")) {
        const [startStr, endStr] = part.split("-");
        const start = parseInt(startStr);
        const end = parseInt(endStr);
        if (isNaN(start) || isNaN(end)) continue;
        for (let i = Math.max(1, start); i <= Math.min(max, end); i++) pages.add(i);
      } else {
        const p = parseInt(part);
        if (!isNaN(p) && p >= 1 && p <= max) pages.add(p);
      }
    }
    return Array.from(pages).sort((a, b) => a - b);
  }

  async function extractSpecificPages() {
    if (!pdfBytes) return;
    const pages = parsePageRanges(extractPages, pageCount);
    if (pages.length === 0) { setError("No valid pages specified."); return; }

    const srcDoc = await PDFDocument.load(pdfBytes);
    const newDoc = await PDFDocument.create();
    const copied = await newDoc.copyPages(srcDoc, pages.map((p) => p - 1));
    copied.forEach((page) => newDoc.addPage(page));
    const out = await newDoc.save();
    const blob = new Blob([out.buffer as ArrayBuffer], { type: "application/pdf" });
    setResults([{ name: `${fileName}-pages-${extractPages.replace(/\s/g, "")}.pdf`, url: URL.createObjectURL(blob) }]);
  }

  async function splitIndividual() {
    if (!pdfBytes) return;
    const srcDoc = await PDFDocument.load(pdfBytes);
    const out: { name: string; url: string }[] = [];
    for (let i = 0; i < pageCount; i++) {
      const newDoc = await PDFDocument.create();
      const [copied] = await newDoc.copyPages(srcDoc, [i]);
      newDoc.addPage(copied);
      const bytes = await newDoc.save();
      const blob = new Blob([bytes.buffer as ArrayBuffer], { type: "application/pdf" });
      out.push({ name: `${fileName}-page-${i + 1}.pdf`, url: URL.createObjectURL(blob) });
    }
    setResults(out);
  }

  async function splitChunks() {
    if (!pdfBytes) return;
    const srcDoc = await PDFDocument.load(pdfBytes);
    const out: { name: string; url: string }[] = [];
    for (let start = 0; start < pageCount; start += chunkSize) {
      const end = Math.min(start + chunkSize, pageCount);
      const newDoc = await PDFDocument.create();
      const indices = Array.from({ length: end - start }, (_, i) => start + i);
      const copied = await newDoc.copyPages(srcDoc, indices);
      copied.forEach((page) => newDoc.addPage(page));
      const bytes = await newDoc.save();
      const blob = new Blob([bytes.buffer as ArrayBuffer], { type: "application/pdf" });
      out.push({ name: `${fileName}-pages-${start + 1}-to-${end}.pdf`, url: URL.createObjectURL(blob) });
    }
    setResults(out);
  }

  async function handleSplit() {
    setProcessing(true);
    setError("");
    setResults([]);
    try {
      if (mode === "extract") await extractSpecificPages();
      else if (mode === "individual") await splitIndividual();
      else await splitChunks();
    } catch {
      setError("Failed to split PDF. Please try again.");
    }
    setProcessing(false);
  }

  function downloadAll() {
    results.forEach((r, i) => {
      setTimeout(() => {
        const a = document.createElement("a");
        a.href = r.url;
        a.download = r.name;
        a.click();
      }, i * 200);
    });
  }

  return (
    <div className="space-y-6">
      <section className="text-center">
        <h1 className="text-4xl font-bold mb-2">PDF Splitter</h1>
        <p className="text-[var(--text-secondary)]">
          Extract pages, split into individual files, or break into chunks. Runs entirely in your browser.
        </p>
      </section>

      {/* Upload area */}
      <div
        className="bg-[var(--bg-secondary)] border-2 border-dashed border-[var(--border)] rounded-xl p-8 text-center cursor-pointer hover:border-purple-500/50 transition-colors"
        onClick={() => fileRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
      >
        {pdfBytes ? (
          <div>
            <div className="text-lg font-bold">{fileName}.pdf</div>
            <div className="text-sm text-[var(--text-secondary)] mt-1">{pageCount} page{pageCount !== 1 ? "s" : ""} &middot; {(pdfBytes.length / 1024).toFixed(0)} KB</div>
            <div className="text-xs text-purple-400 mt-2">Click to replace</div>
          </div>
        ) : (
          <div>
            <div className="text-4xl mb-2 opacity-40">&#128196;</div>
            <p className="text-[var(--text-secondary)]">Drop a PDF here or click to upload</p>
          </div>
        )}
        <input ref={fileRef} type="file" accept=".pdf,application/pdf" className="hidden" onChange={handleFile} />
      </div>

      {error && <div className="bg-red-900/30 border border-red-700 rounded-lg p-3 text-red-400 text-sm">{error}</div>}

      {/* Thumbnails */}
      {pageCount > 0 && (
        <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-4">
          <h2 className="text-sm font-bold text-[var(--text-secondary)] mb-3">Page Preview</h2>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {thumbnails.length > 0
              ? thumbnails.map((thumb, i) => (
                  <div key={i} className="flex-shrink-0 text-center">
                    <img src={thumb} alt={`Page ${i + 1}`} className="h-24 rounded border border-[var(--border)] bg-white" />
                    <div className="text-[10px] text-[var(--text-secondary)] mt-1">{i + 1}</div>
                  </div>
                ))
              : Array.from({ length: Math.min(pageCount, 20) }, (_, i) => (
                  <div key={i} className="flex-shrink-0 w-16 h-24 bg-[var(--bg-tertiary)] border border-[var(--border)] rounded flex items-center justify-center text-xs text-[var(--text-secondary)]">
                    {i + 1}
                  </div>
                ))}
            {pageCount > 20 && (
              <div className="flex-shrink-0 w-16 h-24 bg-[var(--bg-tertiary)] border border-[var(--border)] rounded flex items-center justify-center text-xs text-[var(--text-secondary)]">
                +{pageCount - 20}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Split options */}
      {pageCount > 0 && (
        <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-6 space-y-4">
          <h2 className="text-sm font-bold text-[var(--text-secondary)]">Split Mode</h2>
          <div className="flex gap-2 flex-wrap">
            {([
              ["extract", "Extract Pages"],
              ["individual", "Split All Pages"],
              ["chunks", "Split into Chunks"],
            ] as const).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setMode(key)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  mode === key
                    ? "bg-purple-600 text-white"
                    : "bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:text-white"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {mode === "extract" && (
            <div>
              <label className="block text-xs text-[var(--text-secondary)] mb-1">
                Pages to extract (e.g., 1,3,5-8)
              </label>
              <input
                type="text"
                value={extractPages}
                onChange={(e) => setExtractPages(e.target.value)}
                placeholder="1,3,5-8"
                className="w-full bg-[var(--bg-tertiary)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm font-mono"
              />
              <div className="text-xs text-[var(--text-secondary)] mt-1">
                Parsed: {parsePageRanges(extractPages, pageCount).join(", ") || "none"} ({parsePageRanges(extractPages, pageCount).length} page{parsePageRanges(extractPages, pageCount).length !== 1 ? "s" : ""})
              </div>
            </div>
          )}

          {mode === "individual" && (
            <div className="text-sm text-[var(--text-secondary)]">
              Creates {pageCount} separate PDF file{pageCount !== 1 ? "s" : ""}, one for each page.
            </div>
          )}

          {mode === "chunks" && (
            <div>
              <label className="block text-xs text-[var(--text-secondary)] mb-1">Pages per chunk</label>
              <input
                type="number"
                min={1}
                max={pageCount}
                value={chunkSize}
                onChange={(e) => setChunkSize(Math.max(1, Math.min(pageCount, parseInt(e.target.value) || 1)))}
                className="w-24 bg-[var(--bg-tertiary)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm font-mono"
              />
              <div className="text-xs text-[var(--text-secondary)] mt-1">
                Creates {Math.ceil(pageCount / chunkSize)} file{Math.ceil(pageCount / chunkSize) !== 1 ? "s" : ""}
              </div>
            </div>
          )}

          <button
            onClick={handleSplit}
            disabled={processing}
            className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-bold transition-colors"
          >
            {processing ? "Splitting..." : "Split PDF"}
          </button>
        </div>
      )}

      {/* Results */}
      {results.length > 0 && (
        <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-6 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-[var(--text-secondary)]">
              Results ({results.length} file{results.length !== 1 ? "s" : ""})
            </h2>
            {results.length > 1 && (
              <button
                onClick={downloadAll}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-1.5 rounded-lg text-xs font-bold transition-colors"
              >
                Download All
              </button>
            )}
          </div>
          <div className="space-y-2">
            {results.map((r, i) => (
              <div key={i} className="flex items-center justify-between bg-[var(--bg-tertiary)] border border-[var(--border)] rounded-lg px-4 py-2">
                <span className="text-sm font-mono truncate mr-3">{r.name}</span>
                <a
                  href={r.url}
                  download={r.name}
                  className="flex-shrink-0 bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded text-xs font-bold transition-colors"
                >
                  Download
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer links */}
      <div className="text-center text-[var(--text-secondary)] text-sm pt-4">
        <a href="/image-converter" className="text-purple-400 hover:underline">Image Converter</a>{" | "}
        <a href="/image-compress" className="text-purple-400 hover:underline">Image Compressor</a>{" | "}
        <a href="/word-to-pdf" className="text-purple-400 hover:underline">Word to PDF</a>{" | "}
        <a href="/" className="text-purple-400 hover:underline">All Tools</a>
      </div>
    </div>
  );
}
