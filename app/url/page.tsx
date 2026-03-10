"use client";

import { useState } from "react";

type EncodeMode = "component" | "full";

export default function UrlEncoderDecoderPage() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [mode, setMode] = useState<EncodeMode>("component");

  function encode() {
    if (!input.trim()) return;
    try {
      const encoded =
        mode === "component"
          ? encodeURIComponent(input)
          : encodeURI(input);
      setOutput(encoded);
      setError("");
    } catch (e) {
      setError("Encoding failed: " + (e as Error).message);
      setOutput("");
    }
  }

  function decode() {
    if (!input.trim()) return;
    try {
      const decoded =
        mode === "component"
          ? decodeURIComponent(input)
          : decodeURI(input);
      setOutput(decoded);
      setError("");
    } catch (e) {
      setError("Decoding failed: " + (e as Error).message);
      setOutput("");
    }
  }

  function copyOutput() {
    navigator.clipboard.writeText(output);
  }

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">URL Encoder / Decoder</h1>
        <p className="text-[var(--text-secondary)] text-sm">
          Encode or decode URLs and URL components. Runs entirely in your
          browser.
        </p>
      </div>

      {/* AD SLOT - Top */}
      <div className="ad-slot mb-6">
        {/* AD SLOT: in-content ad */}
        <span>Ad Space</span>
      </div>

      <div className="flex items-center gap-3 mb-4">
        <button
          onClick={() => setMode("component")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            mode === "component"
              ? "bg-[var(--accent)] text-white"
              : "bg-[var(--bg-tertiary)] border border-[var(--border)]"
          }`}
        >
          Component
        </button>
        <button
          onClick={() => setMode("full")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            mode === "full"
              ? "bg-[var(--accent)] text-white"
              : "bg-[var(--bg-tertiary)] border border-[var(--border)]"
          }`}
        >
          Full URL
        </button>
        <span className="text-xs text-[var(--text-secondary)] ml-2">
          {mode === "component"
            ? "encodeURIComponent / decodeURIComponent"
            : "encodeURI / decodeURI"}
        </span>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Input</label>
          <textarea
            rows={5}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              mode === "component"
                ? "Enter text or URL component to encode/decode..."
                : "Enter full URL to encode/decode..."
            }
            spellCheck={false}
          />
          <div className="flex gap-2 mt-3">
            <button
              onClick={encode}
              className="px-4 py-2 rounded-lg bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white text-sm font-medium transition-colors"
            >
              Encode
            </button>
            <button
              onClick={decode}
              className="px-4 py-2 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border)] hover:border-[var(--accent)] text-sm font-medium transition-colors"
            >
              Decode
            </button>
          </div>
        </div>

        {error && (
          <div className="rounded-lg border border-[var(--error)] bg-[var(--error)]/10 p-3 text-sm text-[var(--error)]">
            {error}
          </div>
        )}

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium">Output</label>
            {output && (
              <button
                onClick={copyOutput}
                className="text-xs text-[var(--accent)] hover:underline"
              >
                Copy
              </button>
            )}
          </div>
          <pre className="min-h-[120px]">{output}</pre>
        </div>
      </div>

      {/* AD SLOT - Bottom */}
      <div className="ad-slot mt-8">
        {/* AD SLOT: in-content ad */}
        <span>Ad Space</span>
      </div>

      <section className="mt-10 text-sm text-[var(--text-secondary)] space-y-2">
        <h2 className="text-lg font-semibold text-white">
          About URL Encoding
        </h2>
        <p>
          URL encoding converts special characters into percent-encoded values
          so they can be safely transmitted in URLs. Use &ldquo;Component&rdquo;
          mode for query parameters and fragments, or &ldquo;Full URL&rdquo; mode
          to encode an entire URL while preserving its structure.
        </p>
      </section>
    </>
  );
}
