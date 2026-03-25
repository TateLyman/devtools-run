"use client";
import { useState } from "react";

function svgToDataUri(svg: string): string {
  const encoded = svg
    .replace(/\n/g, " ")
    .replace(/\s+/g, " ")
    .replace(/"/g, "'")
    .replace(/#/g, "%23")
    .replace(/</g, "%3C")
    .replace(/>/g, "%3E")
    .trim();
  return `url("data:image/svg+xml,${encoded}")`;
}

function svgToBase64(svg: string): string {
  try {
    return `url("data:image/svg+xml;base64,${btoa(svg)}")`;
  } catch {
    return "Error: Invalid SVG for base64 encoding";
  }
}

export default function SvgToCss() {
  const [svg, setSvg] = useState("");
  const [mode, setMode] = useState<"uri" | "base64">("uri");
  const [copied, setCopied] = useState(false);

  const output = svg.trim()
    ? mode === "uri"
      ? svgToDataUri(svg)
      : svgToBase64(svg)
    : "";

  const cssSnippet = output ? `background-image: ${output};` : "";

  const handleCopy = () => {
    navigator.clipboard.writeText(cssSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const sampleSVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <circle cx="12" cy="12" r="10"/>
  <path d="M9 12l2 2 4-4"/>
</svg>`;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">SVG to CSS Background</h1>
        <p className="text-[var(--text-secondary)]">
          Convert SVG code to CSS background-image data URI. No external files needed — embed SVGs directly in your CSS.
        </p>
      </div>

      <div className="flex gap-2 mb-2">
        <button onClick={() => setMode("uri")} className={`px-3 py-1 rounded text-sm ${mode === "uri" ? "bg-purple-600 text-white" : "bg-[var(--bg-secondary)] text-[var(--text-secondary)]"}`}>
          URI Encoded (smaller)
        </button>
        <button onClick={() => setMode("base64")} className={`px-3 py-1 rounded text-sm ${mode === "base64" ? "bg-purple-600 text-white" : "bg-[var(--bg-secondary)] text-[var(--text-secondary)]"}`}>
          Base64
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-sm font-medium">SVG Input</label>
            <button onClick={() => setSvg(sampleSVG)} className="text-xs text-purple-400 hover:text-purple-300">Load Example</button>
          </div>
          <textarea value={svg} onChange={(e) => setSvg(e.target.value)} placeholder="Paste SVG code here..." className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded px-3 py-2 text-white h-64 resize-none font-mono text-sm" spellCheck={false} />
        </div>
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-sm font-medium">CSS Output</label>
            {cssSnippet && <button onClick={handleCopy} className="text-xs text-purple-400 hover:text-purple-300">{copied ? "Copied!" : "Copy CSS"}</button>}
          </div>
          <textarea value={cssSnippet} readOnly className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded px-3 py-2 text-emerald-400 h-64 resize-none font-mono text-sm" />
        </div>
      </div>

      {svg.trim() && (
        <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-6">
          <h3 className="font-bold text-white mb-3">Preview</h3>
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 bg-white rounded flex items-center justify-center" dangerouslySetInnerHTML={{ __html: svg }} />
            <div className="w-24 h-24 rounded" style={{ backgroundImage: mode === "uri" ? svgToDataUri(svg) : svgToBase64(svg), backgroundSize: "contain", backgroundRepeat: "no-repeat", backgroundPosition: "center" }} />
            <div className="text-sm text-[var(--text-secondary)]">
              <p>Left: Original SVG</p>
              <p>Right: CSS background-image</p>
              <p className="mt-2">Size: ~{new Blob([output]).size} bytes</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
