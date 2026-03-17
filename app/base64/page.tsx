"use client";

import { useState } from "react";

import AdSlot from "../components/AdSlot";

export default function Base64Page() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [error, setError] = useState("");

  function encode(text: string) {
    try {
      const encoded = btoa(
        encodeURIComponent(text).replace(/%([0-9A-F]{2})/g, (_, p1) =>
          String.fromCharCode(parseInt(p1, 16))
        )
      );
      setOutput(encoded);
      setError("");
    } catch (e) {
      setError("Encoding failed: " + (e as Error).message);
      setOutput("");
    }
  }

  function decode(text: string) {
    try {
      const decoded = decodeURIComponent(
        Array.from(atob(text), (c) =>
          "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2)
        ).join("")
      );
      setOutput(decoded);
      setError("");
    } catch {
      setError("Decoding failed: invalid Base64 string");
      setOutput("");
    }
  }

  function handleInputChange(value: string) {
    setInput(value);
    if (!value.trim()) {
      setOutput("");
      setError("");
      return;
    }
    if (mode === "encode") encode(value);
    else decode(value);
  }

  function toggleMode() {
    const newMode = mode === "encode" ? "decode" : "encode";
    setMode(newMode);
    setInput(output);
    setOutput(input);
    setError("");
  }

  function handleFileDrop(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(",")[1] || result;
      if (mode === "encode") {
        setInput(`[File: ${file.name}]`);
        setOutput(base64);
      } else {
        setInput(base64);
        decode(base64);
      }
      setError("");
    };
    reader.readAsDataURL(file);
  }

  function copyOutput() {
    navigator.clipboard.writeText(output);
  }

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">Base64 Encoder / Decoder</h1>
        <p className="text-[var(--text-secondary)] text-sm">
          Encode or decode text and files to and from Base64. Supports UTF-8.
        </p>
      </div>

      <div className="flex items-center gap-3 mb-4">
        <button
          onClick={() => {
            setMode("encode");
            setInput("");
            setOutput("");
            setError("");
          }}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            mode === "encode"
              ? "bg-[var(--accent)] text-white"
              : "bg-[var(--bg-tertiary)] border border-[var(--border)]"
          }`}
        >
          Encode
        </button>
        <button
          onClick={() => {
            setMode("decode");
            setInput("");
            setOutput("");
            setError("");
          }}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            mode === "decode"
              ? "bg-[var(--accent)] text-white"
              : "bg-[var(--bg-tertiary)] border border-[var(--border)]"
          }`}
        >
          Decode
        </button>
        <button
          onClick={toggleMode}
          className="px-4 py-2 rounded-lg text-sm font-medium bg-[var(--bg-tertiary)] border border-[var(--border)] hover:border-[var(--accent)] transition-colors ml-auto"
        >
          Swap
        </button>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div>
          <label className="block text-sm font-medium mb-2">
            {mode === "encode" ? "Text Input" : "Base64 Input"}
          </label>
          <textarea
            rows={10}
            value={input}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder={
              mode === "encode"
                ? "Enter text to encode..."
                : "Paste Base64 string to decode..."
            }
            spellCheck={false}
          />
          <div className="mt-2">
            <label className="text-xs text-[var(--text-secondary)] cursor-pointer hover:text-white transition-colors">
              Or upload a file:
              <input
                type="file"
                className="ml-2 text-xs"
                onChange={handleFileDrop}
              />
            </label>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium">
              {mode === "encode" ? "Base64 Output" : "Decoded Text"}
            </label>
            {output && (
              <button
                onClick={copyOutput}
                className="text-xs text-[var(--accent)] hover:underline"
              >
                Copy
              </button>
            )}
          </div>
          {error && (
            <div className="rounded-lg border border-[var(--error)] bg-[var(--error)]/10 p-3 text-sm text-[var(--error)] mb-3">
              {error}
            </div>
          )}
          <pre className="min-h-[240px]">{output}</pre>
        </div>
      </div>

      <AdSlot className="mt-8" />

      <section className="mt-10 text-sm text-[var(--text-secondary)] space-y-2">
        <h2 className="text-lg font-semibold text-white">
          About Base64 Encoding
        </h2>
        <p>
          Base64 is a binary-to-text encoding scheme that represents binary data
          in an ASCII string format. This tool lets you encode text or files to
          Base64, or decode Base64 strings back to their original form.
        </p>
      </section>
    </>
  );
}
