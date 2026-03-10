"use client";

import { useState } from "react";

export default function JsonFormatterPage() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

  function format() {
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, 2));
      setError("");
    } catch (e) {
      setError((e as Error).message);
      setOutput("");
    }
  }

  function minify() {
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed));
      setError("");
    } catch (e) {
      setError((e as Error).message);
      setOutput("");
    }
  }

  function validate() {
    try {
      JSON.parse(input);
      setError("");
      setOutput("Valid JSON");
    } catch (e) {
      setError("Invalid JSON: " + (e as Error).message);
      setOutput("");
    }
  }

  function copyOutput() {
    navigator.clipboard.writeText(output);
  }

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">JSON Formatter & Validator</h1>
        <p className="text-[var(--text-secondary)] text-sm">
          Paste your JSON below to format, minify, or validate it. Runs
          entirely in your browser.
        </p>
      </div>

      {/* AD SLOT - Top */}
      <div className="ad-slot mb-6">
        {/* AD SLOT: in-content ad */}
        <span>Ad Space</span>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div>
          <label className="block text-sm font-medium mb-2">Input JSON</label>
          <textarea
            rows={14}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder='{"key": "value"}'
            spellCheck={false}
          />
          <div className="flex gap-2 mt-3">
            <button
              onClick={format}
              className="px-4 py-2 rounded-lg bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white text-sm font-medium transition-colors"
            >
              Format
            </button>
            <button
              onClick={minify}
              className="px-4 py-2 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border)] hover:border-[var(--accent)] text-sm font-medium transition-colors"
            >
              Minify
            </button>
            <button
              onClick={validate}
              className="px-4 py-2 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border)] hover:border-[var(--accent)] text-sm font-medium transition-colors"
            >
              Validate
            </button>
          </div>
        </div>

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
          {error && (
            <div className="rounded-lg border border-[var(--error)] bg-[var(--error)]/10 p-3 text-sm text-[var(--error)] mb-3">
              {error}
            </div>
          )}
          <pre className="min-h-[340px]">{output}</pre>
        </div>
      </div>

      {/* AD SLOT - Bottom */}
      <div className="ad-slot mt-8">
        {/* AD SLOT: in-content ad */}
        <span>Ad Space</span>
      </div>

      <section className="mt-10 text-sm text-[var(--text-secondary)] space-y-2">
        <h2 className="text-lg font-semibold text-white">
          About JSON Formatter
        </h2>
        <p>
          This free online JSON formatter lets you format, validate, and minify
          JSON data instantly. All processing happens in your browser &mdash;
          your data never leaves your machine.
        </p>
      </section>
    </>
  );
}
