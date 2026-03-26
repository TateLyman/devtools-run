"use client";
import { useState } from "react";

function encode(str: string): string {
  const div = typeof document !== "undefined" ? document.createElement("div") : null;
  if (!div) return str;
  div.textContent = str;
  return div.innerHTML;
}

function decode(str: string): string {
  const div = typeof document !== "undefined" ? document.createElement("div") : null;
  if (!div) return str;
  div.innerHTML = str;
  return div.textContent || "";
}

const COMMON = [
  ["&amp;", "&", "Ampersand"],["&lt;", "<", "Less than"],["&gt;", ">", "Greater than"],
  ["&quot;", '"', "Quote"],["&apos;", "'", "Apostrophe"],["&nbsp;", " ", "Non-breaking space"],
  ["&copy;", "©", "Copyright"],["&reg;", "®", "Registered"],["&trade;", "™", "Trademark"],
  ["&euro;", "€", "Euro"],["&pound;", "£", "Pound"],["&yen;", "¥", "Yen"],
  ["&cent;", "¢", "Cent"],["&deg;", "°", "Degree"],["&plusmn;", "±", "Plus-minus"],
  ["&times;", "×", "Multiply"],["&divide;", "÷", "Divide"],["&infin;", "∞", "Infinity"],
  ["&ne;", "≠", "Not equal"],["&le;", "≤", "Less or equal"],["&ge;", "≥", "Greater or equal"],
  ["&larr;", "←", "Left arrow"],["&rarr;", "→", "Right arrow"],["&uarr;", "↑", "Up arrow"],
  ["&darr;", "↓", "Down arrow"],["&hearts;", "♥", "Heart"],["&spades;", "♠", "Spade"],
];

export default function HtmlEntities() {
  const [input, setInput] = useState('<h1>Hello "World" & Friends</h1>');
  const [mode, setMode] = useState<"encode" | "decode">("encode");

  const output = mode === "encode" ? encode(input) : decode(input);
  const copy = () => navigator.clipboard.writeText(output);

  return (
    <div className="space-y-6">
      <section className="text-center">
        <h1 className="text-4xl font-bold mb-2">HTML Entity Encoder/Decoder</h1>
        <p className="text-[var(--text-secondary)]">Convert special characters to HTML entities and back</p>
      </section>

      <div className="flex justify-center gap-2">
        <button onClick={() => setMode("encode")} className={`px-4 py-2 rounded-lg text-sm font-bold ${mode === "encode" ? "bg-blue-600 text-white" : "bg-[var(--bg-secondary)] border border-[var(--border)]"}`}>Encode</button>
        <button onClick={() => setMode("decode")} className={`px-4 py-2 rounded-lg text-sm font-bold ${mode === "decode" ? "bg-blue-600 text-white" : "bg-[var(--bg-secondary)] border border-[var(--border)]"}`}>Decode</button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-4">
          <label className="text-sm font-bold block mb-2">Input</label>
          <textarea value={input} onChange={e => setInput(e.target.value)} rows={6}
            className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg p-3 font-mono text-sm resize-none" />
        </div>
        <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-4">
          <div className="flex justify-between mb-2">
            <label className="text-sm font-bold">Output</label>
            <button onClick={copy} className="text-xs text-blue-400">Copy</button>
          </div>
          <textarea value={output} readOnly rows={6}
            className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg p-3 font-mono text-sm resize-none" />
        </div>
      </div>

      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-6">
        <h2 className="font-bold text-lg mb-3">Common HTML Entities</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {COMMON.map(([entity, char, name]) => (
            <button key={entity} onClick={() => navigator.clipboard.writeText(entity)}
              className="bg-[var(--bg-primary)] rounded-lg p-2 text-xs text-center hover:border-blue-500/50 border border-transparent">
              <div className="text-lg">{char}</div>
              <div className="font-mono text-[var(--text-secondary)]">{entity}</div>
              <div className="text-[var(--text-secondary)]">{name}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
