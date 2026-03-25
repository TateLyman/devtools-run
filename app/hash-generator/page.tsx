"use client";
import { useState } from "react";

async function computeHash(text: string, algorithm: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest(algorithm, data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

export default function HashGenerator() {
  const [input, setInput] = useState("");
  const [hashes, setHashes] = useState<Record<string, string>>({});
  const [copied, setCopied] = useState<string | null>(null);

  const algorithms = [
    { name: "SHA-1", algo: "SHA-1" },
    { name: "SHA-256", algo: "SHA-256" },
    { name: "SHA-384", algo: "SHA-384" },
    { name: "SHA-512", algo: "SHA-512" },
  ];

  const generateAll = async () => {
    if (!input) return;
    const results: Record<string, string> = {};
    for (const { name, algo } of algorithms) {
      results[name] = await computeHash(input, algo);
    }
    // MD5 not available in SubtleCrypto, provide a simple one
    results["MD5"] = "(not available in Web Crypto API — use SHA-256 instead)";
    setHashes(results);
  };

  const handleInputChange = async (value: string) => {
    setInput(value);
    if (value) {
      const results: Record<string, string> = {};
      for (const { name, algo } of algorithms) {
        results[name] = await computeHash(value, algo);
      }
      setHashes(results);
    } else {
      setHashes({});
    }
  };

  const copy = (text: string, algo: string) => {
    navigator.clipboard.writeText(text);
    setCopied(algo);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Hash Generator</h1>
        <p className="text-[var(--text-secondary)]">
          Generate SHA-1, SHA-256, SHA-384, and SHA-512 hashes instantly as you type. Free online hash calculator.
        </p>
      </div>

      <textarea
        value={input}
        onChange={(e) => handleInputChange(e.target.value)}
        placeholder="Enter text to hash..."
        className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded px-4 py-3 text-white h-32 resize-none font-mono text-sm"
      />

      {Object.keys(hashes).length > 0 && (
        <div className="space-y-3">
          {algorithms.map(({ name }) => (
            <div key={name} className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-bold text-purple-400">{name}</span>
                <button onClick={() => copy(hashes[name], name)} className="text-xs text-[var(--text-secondary)] hover:text-white">
                  {copied === name ? "Copied!" : "Copy"}
                </button>
              </div>
              <code className="text-xs text-emerald-400 font-mono break-all select-all">{hashes[name]}</code>
            </div>
          ))}
        </div>
      )}

      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-4 text-sm text-[var(--text-secondary)]">
        <h3 className="font-bold text-white mb-2">About Hashes</h3>
        <ul className="list-disc list-inside space-y-1">
          <li><strong>SHA-256</strong> — Most commonly used, secure for most applications</li>
          <li><strong>SHA-512</strong> — Longer output, slightly more secure</li>
          <li><strong>SHA-1</strong> — Legacy, not recommended for security</li>
          <li>Hashes are computed locally in your browser using Web Crypto API</li>
        </ul>
      </div>
    </div>
  );
}
