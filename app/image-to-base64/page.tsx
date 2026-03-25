"use client";
import { useState, useRef } from "react";

export default function ImageToBase64() {
  const [base64, setBase64] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState("");
  const [fileSize, setFileSize] = useState(0);
  const [copied, setCopied] = useState<"raw" | "css" | "html" | "img" | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    setFileName(file.name);
    setFileSize(file.size);

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setBase64(result);
      setPreview(result);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const rawBase64 = base64.split(",")[1] || "";
  const cssValue = base64 ? `background-image: url(${base64});` : "";
  const htmlValue = base64 ? `<img src="${base64}" alt="${fileName}" />` : "";
  const imgSrc = base64;

  const copy = (text: string, type: "raw" | "css" | "html" | "img") => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Image to Base64 Converter</h1>
        <p className="text-[var(--text-secondary)]">
          Convert images to Base64 encoded strings. Get CSS, HTML, and raw Base64 output. Drag & drop or click to upload.
        </p>
      </div>

      <div
        className="bg-[var(--bg-secondary)] border-2 border-dashed border-[var(--border)] rounded-lg p-12 text-center cursor-pointer hover:border-purple-500/50 transition-colors"
        onClick={() => fileRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
      >
        {preview ? (
          <div className="space-y-3">
            <img src={preview} alt="Preview" className="max-h-48 mx-auto rounded" />
            <p className="text-sm text-[var(--text-secondary)]">{fileName} ({formatSize(fileSize)})</p>
            <p className="text-xs text-purple-400">Click or drop to change image</p>
          </div>
        ) : (
          <div>
            <p className="text-lg font-medium mb-2">Drop an image here or click to upload</p>
            <p className="text-sm text-[var(--text-secondary)]">Supports PNG, JPG, GIF, SVG, WebP</p>
          </div>
        )}
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
      </div>

      {base64 && (
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-sm">Raw Base64</h3>
                <button onClick={() => copy(rawBase64, "raw")} className="text-xs text-purple-400 hover:text-purple-300">{copied === "raw" ? "Copied!" : "Copy"}</button>
              </div>
              <pre className="text-xs text-emerald-400 font-mono break-all max-h-24 overflow-auto">{rawBase64.slice(0, 500)}...</pre>
            </div>

            <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-sm">Data URI (img src)</h3>
                <button onClick={() => copy(imgSrc, "img")} className="text-xs text-purple-400 hover:text-purple-300">{copied === "img" ? "Copied!" : "Copy"}</button>
              </div>
              <pre className="text-xs text-blue-400 font-mono break-all max-h-24 overflow-auto">{imgSrc.slice(0, 500)}...</pre>
            </div>

            <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-sm">CSS Background</h3>
                <button onClick={() => copy(cssValue, "css")} className="text-xs text-purple-400 hover:text-purple-300">{copied === "css" ? "Copied!" : "Copy"}</button>
              </div>
              <pre className="text-xs text-yellow-400 font-mono break-all max-h-24 overflow-auto">{cssValue.slice(0, 500)}...</pre>
            </div>

            <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-sm">HTML img Tag</h3>
                <button onClick={() => copy(htmlValue, "html")} className="text-xs text-purple-400 hover:text-purple-300">{copied === "html" ? "Copied!" : "Copy"}</button>
              </div>
              <pre className="text-xs text-orange-400 font-mono break-all max-h-24 overflow-auto">{htmlValue.slice(0, 500)}...</pre>
            </div>
          </div>

          <div className="flex gap-4 text-xs text-[var(--text-secondary)]">
            <span>Original: {formatSize(fileSize)}</span>
            <span>Base64: {formatSize(rawBase64.length)}</span>
            <span>Overhead: +{Math.round((rawBase64.length / fileSize - 1) * 100)}%</span>
          </div>
        </div>
      )}
    </div>
  );
}
