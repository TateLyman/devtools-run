"use client";
import { useState, useRef, useCallback, useEffect } from "react";

type OutputFormat = "image/png" | "image/jpeg" | "image/webp" | "image/bmp";

const FORMAT_OPTIONS: { value: OutputFormat; label: string; ext: string; hasQuality: boolean }[] = [
  { value: "image/png", label: "PNG", ext: "png", hasQuality: false },
  { value: "image/jpeg", label: "JPEG", ext: "jpg", hasQuality: true },
  { value: "image/webp", label: "WebP", ext: "webp", hasQuality: true },
  { value: "image/bmp", label: "BMP", ext: "bmp", hasQuality: false },
];

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function detectFormat(file: File): string {
  const type = file.type;
  if (type === "image/png") return "PNG";
  if (type === "image/jpeg") return "JPEG";
  if (type === "image/webp") return "WebP";
  if (type === "image/bmp") return "BMP";
  if (type === "image/gif") return "GIF";
  if (type === "image/svg+xml") return "SVG";
  if (type === "image/avif") return "AVIF";
  const ext = file.name.split(".").pop()?.toLowerCase();
  if (ext) return ext.toUpperCase();
  return "Unknown";
}

export default function ImageConverterPage() {
  const [file, setFile] = useState<File | null>(null);
  const [imgEl, setImgEl] = useState<HTMLImageElement | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [inputInfo, setInputInfo] = useState<{ format: string; width: number; height: number; size: number } | null>(null);
  const [outputFormat, setOutputFormat] = useState<OutputFormat>("image/png");
  const [quality, setQuality] = useState(85);
  const [outputBlob, setOutputBlob] = useState<Blob | null>(null);
  const [outputUrl, setOutputUrl] = useState<string | null>(null);
  const [estimatedSize, setEstimatedSize] = useState<string>("");
  const [converting, setConverting] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((f: File) => {
    setFile(f);
    setOutputBlob(null);
    setOutputUrl(null);
    setEstimatedSize("");
    const url = URL.createObjectURL(f);
    setPreview(url);
    const img = new Image();
    img.onload = () => {
      setImgEl(img);
      setInputInfo({
        format: detectFormat(f),
        width: img.naturalWidth,
        height: img.naturalHeight,
        size: f.size,
      });
    };
    img.src = url;
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) handleFile(f);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const f = e.dataTransfer.files[0];
    if (f && f.type.startsWith("image/")) handleFile(f);
  };

  // Estimate output size when format/quality changes
  useEffect(() => {
    if (!imgEl) return;
    const canvas = document.createElement("canvas");
    // Use a smaller canvas for estimation to keep it fast
    const scale = Math.min(1, 500 / Math.max(imgEl.naturalWidth, imgEl.naturalHeight));
    canvas.width = Math.round(imgEl.naturalWidth * scale);
    canvas.height = Math.round(imgEl.naturalHeight * scale);
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(imgEl, 0, 0, canvas.width, canvas.height);

    const fmt = FORMAT_OPTIONS.find((f) => f.value === outputFormat)!;
    const q = fmt.hasQuality ? quality / 100 : undefined;

    canvas.toBlob(
      (blob) => {
        if (!blob) return;
        // Scale estimate back up based on area ratio
        const areaRatio = (imgEl.naturalWidth * imgEl.naturalHeight) / (canvas.width * canvas.height);
        // For lossless formats the scaling is roughly linear, for lossy it's approximate
        const estimated = Math.round(blob.size * areaRatio);
        setEstimatedSize(`~${formatSize(estimated)}`);
      },
      outputFormat,
      q
    );
  }, [imgEl, outputFormat, quality]);

  const convert = useCallback(() => {
    if (!imgEl) return;
    setConverting(true);
    // Use requestAnimationFrame to let the UI update before heavy canvas work
    requestAnimationFrame(() => {
      const canvas = canvasRef.current;
      if (!canvas) { setConverting(false); return; }
      canvas.width = imgEl.naturalWidth;
      canvas.height = imgEl.naturalHeight;
      const ctx = canvas.getContext("2d")!;

      // For JPEG/BMP, fill white background (no alpha support)
      if (outputFormat === "image/jpeg" || outputFormat === "image/bmp") {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      ctx.drawImage(imgEl, 0, 0);

      const fmt = FORMAT_OPTIONS.find((f) => f.value === outputFormat)!;
      const q = fmt.hasQuality ? quality / 100 : undefined;

      canvas.toBlob(
        (blob) => {
          if (blob) {
            if (outputUrl) URL.revokeObjectURL(outputUrl);
            const url = URL.createObjectURL(blob);
            setOutputBlob(blob);
            setOutputUrl(url);
          }
          setConverting(false);
        },
        outputFormat,
        q
      );
    });
  }, [imgEl, outputFormat, quality, outputUrl]);

  const download = () => {
    if (!outputUrl || !file) return;
    const fmt = FORMAT_OPTIONS.find((f) => f.value === outputFormat)!;
    const baseName = file.name.replace(/\.[^.]+$/, "");
    const a = document.createElement("a");
    a.href = outputUrl;
    a.download = `${baseName}.${fmt.ext}`;
    a.click();
  };

  return (
    <div className="space-y-6">
      <canvas ref={canvasRef} className="hidden" />

      <section className="text-center">
        <h1 className="text-4xl font-bold mb-2">Image Format Converter</h1>
        <p className="text-[var(--text-secondary)]">
          Convert between PNG, JPEG, WebP, and BMP. Adjust quality. Free, runs in your browser.
        </p>
      </section>

      {/* Upload area */}
      <div
        className="bg-[var(--bg-secondary)] border-2 border-dashed border-[var(--border)] rounded-xl p-8 text-center cursor-pointer hover:border-purple-500/50 transition-colors"
        onClick={() => fileRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
      >
        {preview ? (
          <div>
            <img src={preview} alt="Preview" className="max-h-48 mx-auto rounded-lg border border-[var(--border)] mb-3" />
            <div className="text-xs text-purple-400">Click to replace</div>
          </div>
        ) : (
          <div>
            <div className="text-4xl mb-2 opacity-40">&#128444;</div>
            <p className="text-[var(--text-secondary)]">Drop an image here or click to upload</p>
            <p className="text-xs text-[var(--text-secondary)] mt-1">PNG, JPG, WebP, BMP, GIF, SVG, AVIF</p>
          </div>
        )}
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleInputChange} />
      </div>

      {/* File info */}
      {inputInfo && (
        <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div>
              <div className="text-[10px] uppercase tracking-wider text-[var(--text-secondary)]">Format</div>
              <div className="text-sm font-bold">{inputInfo.format}</div>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-wider text-[var(--text-secondary)]">Dimensions</div>
              <div className="text-sm font-bold">{inputInfo.width} x {inputInfo.height}</div>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-wider text-[var(--text-secondary)]">File Size</div>
              <div className="text-sm font-bold">{formatSize(inputInfo.size)}</div>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-wider text-[var(--text-secondary)]">Pixels</div>
              <div className="text-sm font-bold">{(inputInfo.width * inputInfo.height / 1_000_000).toFixed(1)} MP</div>
            </div>
          </div>
        </div>
      )}

      {/* Conversion options */}
      {inputInfo && (
        <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-6 space-y-5">
          <div>
            <h2 className="text-sm font-bold text-[var(--text-secondary)] mb-3">Output Format</h2>
            <div className="flex gap-2 flex-wrap">
              {FORMAT_OPTIONS.map((fmt) => (
                <button
                  key={fmt.value}
                  onClick={() => { setOutputFormat(fmt.value); setOutputBlob(null); setOutputUrl(null); }}
                  className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    outputFormat === fmt.value
                      ? "bg-purple-600 text-white"
                      : "bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:text-white"
                  }`}
                >
                  {fmt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Quality slider for JPEG/WebP */}
          {FORMAT_OPTIONS.find((f) => f.value === outputFormat)?.hasQuality && (
            <div>
              <div className="flex justify-between text-xs text-[var(--text-secondary)] mb-1">
                <span>Quality</span>
                <span className="font-mono">{quality}%</span>
              </div>
              <input
                type="range"
                min={1}
                max={100}
                value={quality}
                onChange={(e) => { setQuality(parseInt(e.target.value)); setOutputBlob(null); setOutputUrl(null); }}
                className="w-full accent-purple-600"
              />
              <div className="flex justify-between text-[10px] text-[var(--text-secondary)]">
                <span>Smaller file</span>
                <span>Better quality</span>
              </div>
            </div>
          )}

          {/* Estimated size */}
          {estimatedSize && (
            <div className="text-sm text-[var(--text-secondary)]">
              Estimated output size: <span className="font-mono text-white">{estimatedSize}</span>
            </div>
          )}

          <button
            onClick={convert}
            disabled={converting}
            className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-bold transition-colors"
          >
            {converting ? "Converting..." : `Convert to ${FORMAT_OPTIONS.find((f) => f.value === outputFormat)?.label}`}
          </button>
        </div>
      )}

      {/* Output */}
      {outputBlob && outputUrl && (
        <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-[var(--text-secondary)]">Converted Image</h2>
            <div className="text-sm font-mono">
              {formatSize(outputBlob.size)}
              {inputInfo && (
                <span className={`ml-2 text-xs ${outputBlob.size < inputInfo.size ? "text-green-400" : "text-red-400"}`}>
                  {outputBlob.size < inputInfo.size ? "-" : "+"}{Math.abs(Math.round((1 - outputBlob.size / inputInfo.size) * 100))}%
                </span>
              )}
            </div>
          </div>

          {/* Side by side comparison */}
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-xs text-[var(--text-secondary)] mb-1">Original ({inputInfo?.format})</div>
              <img src={preview!} alt="Original" className="max-h-40 mx-auto rounded border border-[var(--border)]" />
              <div className="text-xs font-mono text-[var(--text-secondary)] mt-1">{formatSize(inputInfo!.size)}</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-[var(--text-secondary)] mb-1">Converted ({FORMAT_OPTIONS.find((f) => f.value === outputFormat)?.label})</div>
              <img src={outputUrl} alt="Converted" className="max-h-40 mx-auto rounded border border-[var(--border)]" />
              <div className="text-xs font-mono text-[var(--text-secondary)] mt-1">{formatSize(outputBlob.size)}</div>
            </div>
          </div>

          <button
            onClick={download}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-bold transition-colors"
          >
            Download {FORMAT_OPTIONS.find((f) => f.value === outputFormat)?.label}
          </button>
        </div>
      )}

      {/* Footer links */}
      <div className="text-center text-[var(--text-secondary)] text-sm pt-4">
        <a href="/pdf-split" className="text-purple-400 hover:underline">PDF Splitter</a>{" | "}
        <a href="/image-compress" className="text-purple-400 hover:underline">Image Compressor</a>{" | "}
        <a href="/image-resize" className="text-purple-400 hover:underline">Image Resizer</a>{" | "}
        <a href="/" className="text-purple-400 hover:underline">All Tools</a>
      </div>
    </div>
  );
}
