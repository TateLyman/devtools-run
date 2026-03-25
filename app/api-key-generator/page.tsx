"use client";
import { useState } from "react";

function generateKey(format: string, length: number): string {
  const chars: Record<string, string> = {
    hex: "0123456789abcdef",
    alphanumeric: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
    base64url: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_",
    uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
  };
  const pool = chars[format] || chars.alphanumeric;
  const arr = new Uint32Array(length);
  crypto.getRandomValues(arr);
  return Array.from(arr, (n) => pool[n % pool.length]).join("");
}

function generatePrefixed(prefix: string, format: string, length: number): string {
  return `${prefix}${generateKey(format, length)}`;
}

export default function APIKeyGenerator() {
  const [prefix, setPrefix] = useState("sk_");
  const [format, setFormat] = useState("alphanumeric");
  const [length, setLength] = useState(32);
  const [count, setCount] = useState(5);
  const [keys, setKeys] = useState<string[]>([]);
  const [copied, setCopied] = useState<number | null>(null);

  const generate = () => {
    setKeys(Array.from({ length: count }, () => generatePrefixed(prefix, format, length)));
  };

  const presets = [
    { label: "Stripe-style", prefix: "sk_live_", format: "alphanumeric", length: 24 },
    { label: "OpenAI-style", prefix: "sk-", format: "alphanumeric", length: 48 },
    { label: "GitHub PAT", prefix: "ghp_", format: "alphanumeric", length: 36 },
    { label: "AWS-style", prefix: "AKIA", format: "uppercase", length: 16 },
    { label: "Hex token", prefix: "", format: "hex", length: 64 },
    { label: "UUID-like", prefix: "", format: "hex", length: 32 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">API Key Generator</h1>
        <p className="text-[var(--text-secondary)]">
          Generate secure API keys with custom prefixes, formats, and lengths. Presets for Stripe, OpenAI, GitHub, AWS styles.
        </p>
      </div>

      <div className="flex gap-2 flex-wrap">
        {presets.map((p) => (
          <button key={p.label} onClick={() => { setPrefix(p.prefix); setFormat(p.format); setLength(p.length); }} className="px-3 py-1 rounded text-xs bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-white">{p.label}</button>
        ))}
      </div>

      <div className="max-w-lg mx-auto space-y-4">
        <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-4 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-400 mb-1">Prefix</label>
              <input value={prefix} onChange={(e) => setPrefix(e.target.value)} placeholder="sk_" className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded px-3 py-2 text-white font-mono text-sm" />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Format</label>
              <select value={format} onChange={(e) => setFormat(e.target.value)} className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded px-3 py-2 text-white text-sm">
                <option value="alphanumeric">Alphanumeric</option>
                <option value="hex">Hexadecimal</option>
                <option value="base64url">Base64 URL</option>
                <option value="uppercase">Uppercase</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-400 mb-1">Length: {length}</label>
              <input type="range" min={8} max={128} value={length} onChange={(e) => setLength(Number(e.target.value))} className="w-full accent-purple-500" />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Count: {count}</label>
              <input type="range" min={1} max={20} value={count} onChange={(e) => setCount(Number(e.target.value))} className="w-full accent-purple-500" />
            </div>
          </div>
          <button onClick={generate} className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-3 rounded font-bold">Generate Keys</button>
        </div>

        {keys.length > 0 && (
          <div className="space-y-1.5">
            {keys.map((key, i) => (
              <div key={i} className="flex items-center gap-2 bg-[var(--bg-secondary)] border border-[var(--border)] rounded px-3 py-2">
                <code className="flex-1 text-xs font-mono text-emerald-400 select-all break-all">{key}</code>
                <button onClick={() => { navigator.clipboard.writeText(key); setCopied(i); setTimeout(() => setCopied(null), 1500); }} className="text-xs text-purple-400 shrink-0">{copied === i ? "✓" : "Copy"}</button>
              </div>
            ))}
            <button onClick={() => navigator.clipboard.writeText(keys.join("\n"))} className="text-xs text-purple-400 hover:text-purple-300">Copy All</button>
          </div>
        )}
      </div>
    </div>
  );
}
