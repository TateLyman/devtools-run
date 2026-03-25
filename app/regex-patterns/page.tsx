"use client";
import { useState } from "react";

const PATTERNS = [
  { name: "Email", pattern: "^[\\w.-]+@[\\w.-]+\\.[a-zA-Z]{2,}$", example: "user@example.com", desc: "Validates email addresses" },
  { name: "URL", pattern: "^https?:\\/\\/[\\w.-]+\\.[a-zA-Z]{2,}(\\/.*)?$", example: "https://example.com/path", desc: "Matches HTTP/HTTPS URLs" },
  { name: "Phone (US)", pattern: "^\\+?1?[-.\\s]?\\(?\\d{3}\\)?[-.\\s]?\\d{3}[-.\\s]?\\d{4}$", example: "(555) 123-4567", desc: "US phone numbers" },
  { name: "IP Address", pattern: "^(\\d{1,3}\\.){3}\\d{1,3}$", example: "192.168.1.1", desc: "IPv4 addresses" },
  { name: "Hex Color", pattern: "^#?([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$", example: "#ff6b81", desc: "Hex color codes" },
  { name: "Date (YYYY-MM-DD)", pattern: "^\\d{4}-\\d{2}-\\d{2}$", example: "2026-03-24", desc: "ISO date format" },
  { name: "Time (HH:MM)", pattern: "^([01]\\d|2[0-3]):[0-5]\\d$", example: "14:30", desc: "24-hour time" },
  { name: "Credit Card", pattern: "^\\d{4}[- ]?\\d{4}[- ]?\\d{4}[- ]?\\d{4}$", example: "4111 1111 1111 1111", desc: "Basic credit card format" },
  { name: "Password (strong)", pattern: "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$", example: "Pa$$w0rd!", desc: "Min 8 chars, upper, lower, digit, special" },
  { name: "Slug", pattern: "^[a-z0-9]+(-[a-z0-9]+)*$", example: "my-blog-post", desc: "URL-friendly slugs" },
  { name: "Username", pattern: "^[a-zA-Z0-9_]{3,16}$", example: "sol_scanner", desc: "3-16 chars, letters/numbers/underscore" },
  { name: "ZIP Code (US)", pattern: "^\\d{5}(-\\d{4})?$", example: "90210", desc: "US ZIP codes" },
  { name: "HTML Tag", pattern: "<\\/?[a-z][a-z0-9]*[^>]*>", example: "<div class=\"x\">", desc: "HTML opening/closing tags" },
  { name: "Whitespace", pattern: "^\\s+|\\s+$", example: "  hello  ", desc: "Leading/trailing whitespace (for trim)" },
  { name: "Number", pattern: "^-?\\d+(\\.\\d+)?$", example: "-3.14", desc: "Integers and decimals" },
  { name: "Solana Address", pattern: "^[1-9A-HJ-NP-Za-km-z]{32,44}$", example: "NaTTUfDD...", desc: "Base58 Solana addresses" },
  { name: "Bitcoin Address", pattern: "^(bc1|[13])[a-zA-HJ-NP-Z0-9]{25,62}$", example: "bc1q...", desc: "BTC addresses (legacy + segwit)" },
  { name: "JWT Token", pattern: "^eyJ[a-zA-Z0-9_-]*\\.eyJ[a-zA-Z0-9_-]*\\.[a-zA-Z0-9_-]*$", example: "eyJhbG...", desc: "JSON Web Tokens" },
];

export default function RegexPatternsPage() {
  const [copied, setCopied] = useState("");
  const copy = (p: string) => { navigator.clipboard.writeText(p); setCopied(p); setTimeout(() => setCopied(""), 1500); };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-extrabold mb-2 text-center">Regex Pattern Library</h1>
        <p className="text-gray-400 text-center mb-8">{PATTERNS.length} ready-to-use regex patterns. Click to copy.</p>
        <div className="grid md:grid-cols-2 gap-3">
          {PATTERNS.map((p, i) => (
            <div key={i} className="bg-gray-900 rounded-xl p-4 cursor-pointer hover:bg-gray-800 transition-colors" onClick={() => copy(p.pattern)}>
              <div className="flex justify-between mb-1">
                <span className="font-bold text-sm">{p.name}</span>
                <span className="text-xs text-green-400">{copied === p.pattern ? "Copied!" : "Click to copy"}</span>
              </div>
              <code className="text-xs text-purple-400 font-mono block mb-1 break-all">{p.pattern}</code>
              <div className="text-xs text-gray-500">{p.desc} &middot; Example: <span className="text-gray-400">{p.example}</span></div>
            </div>
          ))}
        </div>
        <div className="mt-8 text-center">
          <a href="/regex" className="inline-block bg-purple-600 hover:bg-purple-700 py-2 px-6 rounded-lg font-bold text-sm">Open Regex Tester</a>
        </div>
        <div className="mt-8 text-center text-gray-500 text-sm">
          <a href="/regex" className="text-purple-400 hover:underline">Regex Tester</a>{" | "}
          <a href="/regex-cheatsheet" className="text-purple-400 hover:underline">Regex Cheatsheet</a>{" | "}
          <a href="/json" className="text-purple-400 hover:underline">JSON</a>{" | "}
          <a href="/" className="text-purple-400 hover:underline">All Tools</a>
        </div>
      </div>
    </div>
  );
}
