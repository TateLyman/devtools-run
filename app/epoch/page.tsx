"use client";

import { useState } from "react";

import AdSlot from "../components/AdSlot";

type Mode = "toDate" | "toEpoch";

interface ConversionResult {
  input: string;
  output: string;
  error?: boolean;
}

function timestampToDate(ts: string): string {
  const trimmed = ts.trim();
  if (!trimmed) return "";

  let num: number;
  try {
    num = Number(trimmed);
    if (isNaN(num)) throw new Error("Not a number");
  } catch {
    return "Invalid timestamp";
  }

  // Auto-detect seconds vs milliseconds
  // Timestamps before year 3000 in seconds: < 32503680000
  // Timestamps in milliseconds would be > 10000000000
  let ms: number;
  if (num > 9999999999) {
    // Likely milliseconds
    ms = num;
  } else {
    // Likely seconds
    ms = num * 1000;
  }

  try {
    const date = new Date(ms);
    if (isNaN(date.getTime())) return "Invalid timestamp";

    const isMs = num > 9999999999;
    const utc = date.toUTCString();
    const iso = date.toISOString();
    const local = date.toLocaleString();

    return `${local}\nUTC: ${utc}\nISO: ${iso}${isMs ? "\n(detected as milliseconds)" : "\n(detected as seconds)"}`;
  } catch {
    return "Invalid timestamp";
  }
}

function dateToEpoch(dateStr: string): string {
  const trimmed = dateStr.trim();
  if (!trimmed) return "";

  try {
    const date = new Date(trimmed);
    if (isNaN(date.getTime())) return "Invalid date";

    const seconds = Math.floor(date.getTime() / 1000);
    const milliseconds = date.getTime();

    return `Seconds:      ${seconds}\nMilliseconds: ${milliseconds}\nISO:          ${date.toISOString()}`;
  } catch {
    return "Invalid date";
  }
}

export default function EpochPage() {
  const [mode, setMode] = useState<Mode>("toDate");
  const [input, setInput] = useState("");
  const [results, setResults] = useState<ConversionResult[]>([]);
  const [copied, setCopied] = useState(false);

  function handleConvert() {
    const lines = input
      .split("\n")
      .map((l) => l.trim())
      .filter((l) => l.length > 0);

    if (lines.length === 0) {
      setResults([]);
      return;
    }

    const converted = lines.map((line) => {
      if (mode === "toDate") {
        const output = timestampToDate(line);
        return {
          input: line,
          output,
          error: output === "Invalid timestamp",
        };
      } else {
        const output = dateToEpoch(line);
        return {
          input: line,
          output,
          error: output === "Invalid date",
        };
      }
    });

    setResults(converted);
  }

  function copyAll() {
    const text = results
      .map((r) => `${r.input} => ${r.output.split("\n")[0]}`)
      .join("\n");
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  function handleNow() {
    const now = Math.floor(Date.now() / 1000);
    if (mode === "toDate") {
      setInput(now.toString());
    } else {
      setInput(new Date().toISOString());
    }
  }

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">Epoch / Date Batch Converter</h1>
        <p className="text-[var(--text-secondary)] text-sm">
          Convert multiple Unix timestamps to dates or dates to timestamps. Paste one per line. Supports seconds and milliseconds.
        </p>
      </div>

      <div className="flex items-center gap-3 mb-4">
        <button
          onClick={() => {
            setMode("toDate");
            setInput("");
            setResults([]);
          }}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            mode === "toDate"
              ? "bg-[var(--accent)] text-white"
              : "bg-[var(--bg-tertiary)] border border-[var(--border)]"
          }`}
        >
          Timestamps to Dates
        </button>
        <button
          onClick={() => {
            setMode("toEpoch");
            setInput("");
            setResults([]);
          }}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            mode === "toEpoch"
              ? "bg-[var(--accent)] text-white"
              : "bg-[var(--bg-tertiary)] border border-[var(--border)]"
          }`}
        >
          Dates to Timestamps
        </button>
        <button
          onClick={handleNow}
          className="px-4 py-2 rounded-lg text-sm font-medium bg-[var(--bg-tertiary)] border border-[var(--border)] hover:border-[var(--accent)] transition-colors ml-auto"
        >
          Now
        </button>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div>
          <label className="block text-sm font-medium mb-2">
            {mode === "toDate" ? "Timestamps (one per line)" : "Dates (one per line)"}
          </label>
          <textarea
            rows={12}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              mode === "toDate"
                ? "1700000000\n1700000000000\n1609459200\n1672531200000"
                : "2024-01-15T12:00:00Z\nJan 1, 2024\n2023-06-15\nMarch 15, 2025 3:30 PM"
            }
            spellCheck={false}
          />
          <div className="mt-3">
            <button
              onClick={handleConvert}
              className="px-4 py-2 rounded-lg bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white text-sm font-medium transition-colors"
            >
              Convert All
            </button>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium">Results</label>
            {results.length > 0 && (
              <button
                onClick={copyAll}
                className="text-xs text-[var(--accent)] hover:underline"
              >
                {copied ? "Copied!" : "Copy All"}
              </button>
            )}
          </div>

          {results.length === 0 ? (
            <div className="min-h-[288px] rounded-lg border border-[var(--border)] bg-[var(--bg-tertiary)] p-4 text-sm text-[var(--text-secondary)]">
              Results will appear here after conversion.
            </div>
          ) : (
            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              {results.map((r, i) => (
                <div
                  key={i}
                  className={`rounded-lg border p-3 text-sm ${
                    r.error
                      ? "border-[var(--error)] bg-[var(--error)]/10"
                      : "border-[var(--border)] bg-[var(--bg-tertiary)]"
                  }`}
                >
                  <div className="font-mono text-xs text-[var(--text-secondary)] mb-1">
                    {r.input}
                  </div>
                  <pre className="text-white text-xs whitespace-pre-wrap font-mono">{r.output}</pre>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 rounded-lg border border-[var(--border)] bg-[var(--bg-tertiary)] p-3 text-xs text-[var(--text-secondary)]">
        <strong>Current time:</strong>{" "}
        <span className="font-mono">
          {Math.floor(Date.now() / 1000)} (seconds) / {Date.now()} (milliseconds)
        </span>{" "}
        &mdash; {new Date().toUTCString()}
      </div>

      <AdSlot className="mt-8" />

      <section className="mt-10 text-sm text-[var(--text-secondary)] space-y-2">
        <h2 className="text-lg font-semibold text-white">
          About Epoch Converter
        </h2>
        <p>
          Unix epoch time (or POSIX time) is the number of seconds since January 1, 1970 UTC.
          This tool converts between epoch timestamps and human-readable dates in bulk. It
          auto-detects whether your input is in seconds or milliseconds based on magnitude.
          All parsing happens client-side using your browser&apos;s Date API.
        </p>
      </section>
    </>
  );
}
