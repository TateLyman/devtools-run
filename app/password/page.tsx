"use client";

import { useState, useCallback } from "react";

import AdSlot from "../components/AdSlot";

const CHAR_SETS = {
  uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  lowercase: "abcdefghijklmnopqrstuvwxyz",
  numbers: "0123456789",
  symbols: "!@#$%^&*()_+-=[]{}|;:,.<>?",
};

function getStrength(
  password: string,
  length: number,
  options: { uppercase: boolean; lowercase: boolean; numbers: boolean; symbols: boolean }
): { label: string; color: string; percent: number } {
  const activeCount = [options.uppercase, options.lowercase, options.numbers, options.symbols].filter(Boolean).length;

  if (length < 8 || activeCount === 0) {
    return { label: "Very Weak", color: "var(--error)", percent: 10 };
  }

  let score = 0;
  if (length >= 8) score += 1;
  if (length >= 12) score += 1;
  if (length >= 16) score += 1;
  if (length >= 24) score += 1;
  score += activeCount;

  if (password.length === 0) {
    return { label: "N/A", color: "var(--text-secondary)", percent: 0 };
  }

  if (score <= 3) return { label: "Weak", color: "var(--error)", percent: 25 };
  if (score <= 5) return { label: "Fair", color: "#f59e0b", percent: 50 };
  if (score <= 7) return { label: "Strong", color: "var(--success)", percent: 75 };
  return { label: "Very Strong", color: "var(--success)", percent: 100 };
}

export default function PasswordGeneratorPage() {
  const [length, setLength] = useState(16);
  const [uppercase, setUppercase] = useState(true);
  const [lowercase, setLowercase] = useState(true);
  const [numbers, setNumbers] = useState(true);
  const [symbols, setSymbols] = useState(true);
  const [password, setPassword] = useState("");

  const generate = useCallback(() => {
    let chars = "";
    if (uppercase) chars += CHAR_SETS.uppercase;
    if (lowercase) chars += CHAR_SETS.lowercase;
    if (numbers) chars += CHAR_SETS.numbers;
    if (symbols) chars += CHAR_SETS.symbols;

    if (!chars) {
      setPassword("");
      return;
    }

    const array = new Uint32Array(length);
    crypto.getRandomValues(array);
    let result = "";
    for (let i = 0; i < length; i++) {
      result += chars[array[i] % chars.length];
    }
    setPassword(result);
  }, [length, uppercase, lowercase, numbers, symbols]);

  const strength = getStrength(password, length, {
    uppercase,
    lowercase,
    numbers,
    symbols,
  });

  function copyPassword() {
    navigator.clipboard.writeText(password);
  }

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">Password Generator</h1>
        <p className="text-[var(--text-secondary)] text-sm">
          Generate strong, random passwords with customizable options. Runs
          entirely in your browser using the Web Crypto API.
        </p>
      </div>

      <div className="space-y-6">
        {/* Generated password display */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium">
              Generated Password
            </label>
            {password && (
              <button
                onClick={copyPassword}
                className="text-xs text-[var(--accent)] hover:underline"
              >
                Copy
              </button>
            )}
          </div>
          <pre className="min-h-[60px] flex items-center text-lg break-all">
            {password}
          </pre>
        </div>

        {/* Strength indicator */}
        {password && (
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium">Strength</span>
              <span
                className="text-sm font-semibold"
                style={{ color: strength.color }}
              >
                {strength.label}
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-[var(--bg-tertiary)] border border-[var(--border)] overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{
                  width: `${strength.percent}%`,
                  backgroundColor: strength.color,
                }}
              />
            </div>
          </div>
        )}

        {/* Length slider */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium">Length</label>
            <span className="text-sm font-mono text-[var(--accent)]">
              {length}
            </span>
          </div>
          <input
            type="range"
            min={8}
            max={128}
            value={length}
            onChange={(e) => setLength(Number(e.target.value))}
            className="w-full h-2 rounded-full appearance-none cursor-pointer accent-[var(--accent)]"
            style={{ background: "var(--bg-tertiary)" }}
          />
          <div className="flex justify-between text-xs text-[var(--text-secondary)] mt-1">
            <span>8</span>
            <span>128</span>
          </div>
        </div>

        {/* Character options */}
        <div>
          <label className="block text-sm font-medium mb-3">
            Character Types
          </label>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Uppercase (A-Z)", checked: uppercase, set: setUppercase },
              { label: "Lowercase (a-z)", checked: lowercase, set: setLowercase },
              { label: "Numbers (0-9)", checked: numbers, set: setNumbers },
              { label: "Symbols (!@#$...)", checked: symbols, set: setSymbols },
            ].map(({ label, checked, set }) => (
              <label
                key={label}
                className="flex items-center gap-2 text-sm cursor-pointer rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] p-3 hover:border-[var(--accent)] transition-colors"
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={(e) => set(e.target.checked)}
                  className="w-4 h-4 accent-[var(--accent)]"
                />
                {label}
              </label>
            ))}
          </div>
        </div>

        <button
          onClick={generate}
          className="w-full px-4 py-3 rounded-lg bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white text-sm font-medium transition-colors"
        >
          Generate Password
        </button>
      </div>

      <AdSlot className="mt-8" />

      <section className="mt-10 text-sm text-[var(--text-secondary)] space-y-2">
        <h2 className="text-lg font-semibold text-white">
          About Password Generator
        </h2>
        <p>
          This password generator uses the Web Crypto API to create
          cryptographically secure random passwords. All generation happens
          in your browser &mdash; no passwords are ever sent to a server.
          Use longer passwords with a mix of character types for maximum
          security.
        </p>
      </section>
    </>
  );
}
