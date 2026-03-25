"use client";
import { useState } from "react";

const templates: Record<string, string> = {
  circle: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">\n  <circle cx="50" cy="50" r="40" fill="#6366f1" />\n</svg>',
  rect: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">\n  <rect x="10" y="10" width="80" height="80" rx="10" fill="#22c55e" />\n</svg>',
  star: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">\n  <polygon points="50,5 61,35 95,35 68,57 79,91 50,70 21,91 32,57 5,35 39,35" fill="#eab308" />\n</svg>',
  heart: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">\n  <path d="M50 90 C25 65 0 50 0 30 A25 25 0 0 1 50 20 A25 25 0 0 1 100 30 C100 50 75 65 50 90Z" fill="#ef4444" />\n</svg>',
  logo: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 60">\n  <rect width="200" height="60" rx="8" fill="#1a1a2e" />\n  <text x="100" y="38" text-anchor="middle" font-family="Arial" font-size="24" font-weight="bold" fill="#7c3aed">DevTools</text>\n</svg>',
};

export default function SVGEditor() {
  const [svg, setSvg] = useState(templates.circle);
  const [copied, setCopied] = useState(false);

  const downloadSVG = () => {
    const blob = new Blob([svg], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.download = "image.svg";
    a.href = url;
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadPNG = () => {
    const svgBlob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(svgBlob);
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 512;
      canvas.height = 512;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0, 512, 512);
      const a = document.createElement("a");
      a.download = "image.png";
      a.href = canvas.toDataURL("image/png");
      a.click();
      URL.revokeObjectURL(url);
    };
    img.src = url;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">SVG Editor</h1>
        <p className="text-[var(--text-secondary)]">
          Edit SVG code with live preview. Templates for common shapes. Export as SVG or PNG. Free online SVG editor.
        </p>
      </div>

      <div className="flex gap-2 flex-wrap">
        {Object.entries(templates).map(([name]) => (
          <button key={name} onClick={() => setSvg(templates[name])} className="px-3 py-1 rounded text-xs bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-white capitalize">{name}</button>
        ))}
        <div className="ml-auto flex gap-2">
          <button onClick={downloadSVG} className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded text-xs font-bold">Download SVG</button>
          <button onClick={downloadPNG} className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded text-xs">Download PNG</button>
          <button onClick={() => { navigator.clipboard.writeText(svg); setCopied(true); setTimeout(() => setCopied(false), 2000); }} className="text-xs text-purple-400">{copied ? "Copied!" : "Copy"}</button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="text-sm font-medium mb-1 block">SVG Code</label>
          <textarea value={svg} onChange={(e) => setSvg(e.target.value)} className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded px-3 py-2 text-white h-[400px] resize-none font-mono text-sm" spellCheck={false} />
        </div>
        <div>
          <label className="text-sm font-medium mb-1 block">Preview</label>
          <div className="bg-white border border-[var(--border)] rounded p-4 h-[400px] flex items-center justify-center overflow-hidden" dangerouslySetInnerHTML={{ __html: svg }} />
        </div>
      </div>

      <div className="flex gap-4 text-xs text-[var(--text-secondary)]">
        <span>{svg.length} chars</span>
        <span>{(new Blob([svg]).size / 1024).toFixed(1)} KB</span>
      </div>
    </div>
  );
}
