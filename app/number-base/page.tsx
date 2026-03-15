"use client";

import { useState } from "react";

type Base = "2" | "8" | "10" | "16";

const BASE_LABELS: Record<Base, string> = {
  "2": "Binary (Base 2)",
  "8": "Octal (Base 8)",
  "10": "Decimal (Base 10)",
  "16": "Hexadecimal (Base 16)",
};

function isValidForBase(value: string, base: number): boolean {
  if (!value.trim()) return true;
  const cleaned = value.trim().toLowerCase();
  switch (base) {
    case 2:
      return /^[01]+$/.test(cleaned);
    case 8:
      return /^[0-7]+$/.test(cleaned);
    case 10:
      return /^[0-9]+$/.test(cleaned);
    case 16:
      return /^[0-9a-f]+$/i.test(cleaned);
    default:
      return false;
  }
}

function convertNumber(
  value: string,
  fromBase: number
): { binary: string; octal: string; decimal: string; hex: string } | null {
  if (!value.trim()) return null;
  try {
    const decimal = BigInt(
      fromBase === 16
        ? "0x" + value.trim()
        : fromBase === 8
        ? "0o" + value.trim()
        : fromBase === 2
        ? "0b" + value.trim()
        : value.trim()
    );
    return {
      binary: decimal.toString(2),
      octal: decimal.toString(8),
      decimal: decimal.toString(10),
      hex: decimal.toString(16).toUpperCase(),
    };
  } catch {
    return null;
  }
}

function formatBinary(bin: string): string {
  const padded = bin.padStart(Math.ceil(bin.length / 4) * 4, "0");
  return padded.replace(/(.{4})/g, "$1 ").trim();
}

export default function NumberBasePage() {
  const [input, setInput] = useState("");
  const [fromBase, setFromBase] = useState<Base>("10");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState<string | null>(null);

  const results = (() => {
    if (!input.trim()) return null;
    if (!isValidForBase(input, parseInt(fromBase))) {
      return null;
    }
    return convertNumber(input, parseInt(fromBase));
  })();

  function handleInputChange(value: string) {
    setInput(value);
    if (!value.trim()) {
      setError("");
      return;
    }
    if (!isValidForBase(value, parseInt(fromBase))) {
      setError(`Invalid character for ${BASE_LABELS[fromBase]}`);
    } else {
      setError("");
    }
  }

  function handleBaseChange(base: Base) {
    setFromBase(base);
    if (input.trim() && !isValidForBase(input, parseInt(base))) {
      setError(`Invalid character for ${BASE_LABELS[base]}`);
    } else {
      setError("");
    }
  }

  function copyValue(label: string, value: string) {
    navigator.clipboard.writeText(value);
    setCopied(label);
    setTimeout(() => setCopied(null), 1500);
  }

  const outputRows: { label: string; key: string; value: string; display: string }[] = results
    ? [
        { label: "Binary", key: "2", value: results.binary, display: formatBinary(results.binary) },
        { label: "Octal", key: "8", value: results.octal, display: results.octal },
        { label: "Decimal", key: "10", value: results.decimal, display: results.decimal },
        { label: "Hex", key: "16", value: results.hex, display: results.hex },
      ]
    : [];

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">Number Base Converter</h1>
        <p className="text-[var(--text-secondary)] text-sm">
          Convert numbers between binary, octal, decimal, and hexadecimal. Supports arbitrarily large numbers.
        </p>
      </div>

      {/* AD SLOT - Top */}
      <div className="ad-slot mb-6">
        {/* AD SLOT: in-content ad */}
        <span>Ad Space</span>
      </div>

      <div className="max-w-xl">
        <label className="block text-sm font-medium mb-2">Input Base</label>
        <div className="flex gap-2 mb-4 flex-wrap">
          {(Object.keys(BASE_LABELS) as Base[]).map((base) => (
            <button
              key={base}
              onClick={() => handleBaseChange(base)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                fromBase === base
                  ? "bg-[var(--accent)] text-white"
                  : "bg-[var(--bg-tertiary)] border border-[var(--border)] hover:border-[var(--accent)]"
              }`}
            >
              {BASE_LABELS[base]}
            </button>
          ))}
        </div>

        <label className="block text-sm font-medium mb-2">Enter Number</label>
        <input
          type="text"
          value={input}
          onChange={(e) => handleInputChange(e.target.value)}
          placeholder={
            fromBase === "2"
              ? "e.g. 11010110"
              : fromBase === "8"
              ? "e.g. 326"
              : fromBase === "10"
              ? "e.g. 214"
              : "e.g. D6"
          }
          spellCheck={false}
          className="w-full px-4 py-3 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border)] text-white font-mono text-lg focus:border-[var(--accent)] focus:outline-none transition-colors"
        />

        {error && (
          <div className="rounded-lg border border-[var(--error)] bg-[var(--error)]/10 p-3 text-sm text-[var(--error)] mt-3">
            {error}
          </div>
        )}

        {outputRows.length > 0 && (
          <div className="mt-6 space-y-3">
            <label className="block text-sm font-medium">Conversions</label>
            {outputRows.map((row) => (
              <div
                key={row.key}
                className={`flex items-center justify-between rounded-lg border p-3 ${
                  row.key === fromBase
                    ? "border-[var(--accent)]/40 bg-[var(--accent)]/5"
                    : "border-[var(--border)] bg-[var(--bg-tertiary)]"
                }`}
              >
                <div>
                  <div className="text-xs text-[var(--text-secondary)] mb-1">{row.label}</div>
                  <div className="font-mono text-sm text-white break-all">{row.display}</div>
                </div>
                <button
                  onClick={() => copyValue(row.key, row.value)}
                  className="text-xs text-[var(--accent)] hover:underline ml-4 shrink-0"
                >
                  {copied === row.key ? "Copied!" : "Copy"}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* AD SLOT - Bottom */}
      <div className="ad-slot mt-8">
        {/* AD SLOT: in-content ad */}
        <span>Ad Space</span>
      </div>

      <section className="mt-10 text-sm text-[var(--text-secondary)] space-y-2">
        <h2 className="text-lg font-semibold text-white">
          About Number Base Conversion
        </h2>
        <p>
          This tool converts integers between binary (base 2), octal (base 8), decimal (base 10),
          and hexadecimal (base 16). It uses BigInt for arbitrary precision, so it handles
          numbers of any size without losing accuracy.
        </p>
      </section>
    </>
  );
}
