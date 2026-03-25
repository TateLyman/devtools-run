"use client";
import { useState } from "react";

function textToBinary(text: string): string {
  return text.split("").map((c) => c.charCodeAt(0).toString(2).padStart(8, "0")).join(" ");
}

function binaryToText(binary: string): string {
  return binary.trim().split(/\s+/).map((b) => String.fromCharCode(parseInt(b, 2))).join("");
}

function textToHex(text: string): string {
  return text.split("").map((c) => c.charCodeAt(0).toString(16).padStart(2, "0")).join(" ");
}

function hexToText(hex: string): string {
  return hex.trim().split(/\s+/).map((h) => String.fromCharCode(parseInt(h, 16))).join("");
}

function textToOctal(text: string): string {
  return text.split("").map((c) => c.charCodeAt(0).toString(8).padStart(3, "0")).join(" ");
}

function textToMorse(text: string): string {
  const morse: Record<string, string> = {
    a: ".-", b: "-...", c: "-.-.", d: "-..", e: ".", f: "..-.", g: "--.", h: "....", i: "..",
    j: ".---", k: "-.-", l: ".-..", m: "--", n: "-.", o: "---", p: ".--.", q: "--.-", r: ".-.",
    s: "...", t: "-", u: "..-", v: "...-", w: ".--", x: "-..-", y: "-.--", z: "--..",
    "0": "-----", "1": ".----", "2": "..---", "3": "...--", "4": "....-",
    "5": ".....", "6": "-....", "7": "--...", "8": "---..", "9": "----.",
    " ": "/", ".": ".-.-.-", ",": "--..--", "?": "..--..", "!": "-.-.--",
  };
  return text.toLowerCase().split("").map((c) => morse[c] || c).join(" ");
}

export default function TextToBinary() {
  const [input, setInput] = useState("Hello World!");
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [format, setFormat] = useState("binary");
  const [copied, setCopied] = useState(false);

  let output = "";
  try {
    if (mode === "encode") {
      if (format === "binary") output = textToBinary(input);
      else if (format === "hex") output = textToHex(input);
      else if (format === "octal") output = textToOctal(input);
      else if (format === "morse") output = textToMorse(input);
    } else {
      if (format === "binary") output = binaryToText(input);
      else if (format === "hex") output = hexToText(input);
    }
  } catch { output = "Error: Invalid input"; }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Text to Binary / Hex / Morse Converter</h1>
        <p className="text-[var(--text-secondary)]">
          Convert text to binary, hexadecimal, octal, or Morse code and back. Free text encoding tool.
        </p>
      </div>

      <div className="flex gap-2 justify-center flex-wrap">
        <button onClick={() => setMode("encode")} className={`px-3 py-1.5 rounded text-xs ${mode === "encode" ? "bg-purple-600 text-white" : "bg-[var(--bg-secondary)] text-gray-400"}`}>Encode</button>
        <button onClick={() => setMode("decode")} className={`px-3 py-1.5 rounded text-xs ${mode === "decode" ? "bg-purple-600 text-white" : "bg-[var(--bg-secondary)] text-gray-400"}`}>Decode</button>
        <span className="text-gray-600">|</span>
        {["binary", "hex", "octal", "morse"].map((f) => (
          <button key={f} onClick={() => setFormat(f)} className={`px-3 py-1.5 rounded text-xs capitalize ${format === f ? "bg-emerald-600 text-white" : "bg-[var(--bg-secondary)] text-gray-400"}`}>{f}</button>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 max-w-2xl mx-auto">
        <div>
          <label className="text-sm font-medium mb-1 block">{mode === "encode" ? "Text" : `${format} Input`}</label>
          <textarea value={input} onChange={(e) => setInput(e.target.value)} className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded px-3 py-2 text-white h-32 resize-none font-mono text-sm" />
        </div>
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-sm font-medium">{mode === "encode" ? `${format} Output` : "Text"}</label>
            <button onClick={() => { navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 2000); }} className="text-xs text-purple-400">{copied ? "Copied!" : "Copy"}</button>
          </div>
          <pre className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded px-3 py-2 text-emerald-400 h-32 overflow-auto font-mono text-sm whitespace-pre-wrap break-all">{output}</pre>
        </div>
      </div>
    </div>
  );
}
