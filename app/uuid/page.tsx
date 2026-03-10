"use client";

import { useState, useCallback } from "react";

function generateUUIDv4(): string {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  // Set version 4
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  // Set variant 10xx
  bytes[8] = (bytes[8] & 0x3f) | 0x80;

  const hex = Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  return [
    hex.slice(0, 8),
    hex.slice(8, 12),
    hex.slice(12, 16),
    hex.slice(16, 20),
    hex.slice(20, 32),
  ].join("-");
}

export default function UuidPage() {
  const [uuids, setUuids] = useState<string[]>([]);
  const [count, setCount] = useState(1);
  const [hyphens, setHyphens] = useState(true);
  const [copied, setCopied] = useState<number | "all" | null>(null);

  const generate = useCallback(() => {
    const newUuids: string[] = [];
    for (let i = 0; i < count; i++) {
      newUuids.push(generateUUIDv4());
    }
    setUuids(newUuids);
    setCopied(null);
  }, [count]);

  function formatUuid(uuid: string): string {
    return hyphens ? uuid : uuid.replace(/-/g, "");
  }

  function copyOne(index: number) {
    navigator.clipboard.writeText(formatUuid(uuids[index]));
    setCopied(index);
    setTimeout(() => setCopied(null), 1500);
  }

  function copyAll() {
    const text = uuids.map(formatUuid).join("\n");
    navigator.clipboard.writeText(text);
    setCopied("all");
    setTimeout(() => setCopied(null), 1500);
  }

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">UUID Generator</h1>
        <p className="text-[var(--text-secondary)] text-sm">
          Generate random v4 UUIDs. Bulk generate up to 100 at once. Runs
          entirely in your browser.
        </p>
      </div>

      <div className="ad-slot mb-6">
        <span>Ad Space</span>
      </div>

      <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
        <div>
          <label className="block text-sm font-medium mb-2">
            Count (1&ndash;100)
          </label>
          <input
            type="number"
            min={1}
            max={100}
            value={count}
            onChange={(e) =>
              setCount(Math.max(1, Math.min(100, Number(e.target.value) || 1)))
            }
          />

          <label className="flex items-center gap-2 mt-4 text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={hyphens}
              onChange={(e) => setHyphens(e.target.checked)}
              className="w-4 h-4 rounded"
            />
            Include hyphens
          </label>

          <div className="flex gap-2 mt-4">
            <button
              onClick={generate}
              className="px-4 py-2 rounded-lg bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white text-sm font-medium transition-colors"
            >
              Generate
            </button>
            {uuids.length > 1 && (
              <button
                onClick={copyAll}
                className="px-4 py-2 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border)] hover:border-[var(--accent)] text-sm font-medium transition-colors"
              >
                {copied === "all" ? "Copied!" : "Copy All"}
              </button>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Generated UUIDs {uuids.length > 0 && `(${uuids.length})`}
          </label>
          {uuids.length === 0 ? (
            <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-tertiary)] p-6 text-center text-sm text-[var(--text-secondary)]">
              Click Generate to create UUIDs
            </div>
          ) : (
            <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-tertiary)] divide-y divide-[var(--border)] max-h-[500px] overflow-y-auto">
              {uuids.map((uuid, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between px-3 py-2 hover:bg-[var(--bg-secondary)] transition-colors"
                >
                  <code className="text-sm font-mono">{formatUuid(uuid)}</code>
                  <button
                    onClick={() => copyOne(i)}
                    className="text-xs text-[var(--accent)] hover:underline shrink-0 ml-3"
                  >
                    {copied === i ? "Copied!" : "Copy"}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="ad-slot mt-8">
        <span>Ad Space</span>
      </div>

      <section className="mt-10 text-sm text-[var(--text-secondary)] space-y-2">
        <h2 className="text-lg font-semibold text-white">About UUID Generator</h2>
        <p>
          This tool generates cryptographically random version 4 UUIDs using the
          Web Crypto API. All generation happens in your browser &mdash; nothing
          is sent to a server.
        </p>
      </section>
    </>
  );
}
