"use client";
import { useState } from "react";
import Link from "next/link";

function convert(from: string, to: string, input: string): string {
  try {
    // JSON conversions
    if (from === "JSON" && to === "YAML") {
      const obj = JSON.parse(input);
      return Object.entries(obj).map(([k, v]) => `${k}: ${JSON.stringify(v)}`).join("\n");
    }
    if (from === "JSON" && to === "CSV") {
      const arr = JSON.parse(input);
      if (!Array.isArray(arr) || !arr.length) return "Input must be a JSON array";
      const keys = Object.keys(arr[0]);
      return [keys.join(","), ...arr.map((r: any) => keys.map(k => JSON.stringify(r[k] ?? "")).join(","))].join("\n");
    }
    if (from === "JSON" && to === "TypeScript") {
      const obj = JSON.parse(input);
      const lines = ["interface Root {"];
      for (const [k, v] of Object.entries(obj)) {
        const t = v === null ? "null" : Array.isArray(v) ? "any[]" : typeof v;
        lines.push(`  ${k}: ${t};`);
      }
      lines.push("}");
      return lines.join("\n");
    }
    // Base64
    if (from === "Text" && to === "Base64") return btoa(input);
    if (from === "Base64" && to === "Text") return atob(input);
    // URL encode
    if (from === "Text" && to === "URL Encoded") return encodeURIComponent(input);
    if (from === "URL Encoded" && to === "Text") return decodeURIComponent(input);
    // Number base
    if (from === "Binary" && to === "Decimal") return String(parseInt(input, 2));
    if (from === "Decimal" && to === "Binary") return (parseInt(input) >>> 0).toString(2);
    if (from === "Hexadecimal" && to === "Decimal") return String(parseInt(input, 16));
    if (from === "Decimal" && to === "Hexadecimal") return parseInt(input).toString(16);
    // Temp
    if (from === "Celsius" && to === "Fahrenheit") return String((parseFloat(input) * 9/5 + 32).toFixed(2));
    if (from === "Fahrenheit" && to === "Celsius") return String(((parseFloat(input) - 32) * 5/9).toFixed(2));
    // CSS
    if (from === "PX" && to === "REM") return (parseFloat(input) / 16).toFixed(4) + "rem";
    if (from === "REM" && to === "PX") return (parseFloat(input) * 16).toFixed(0) + "px";
    if (from === "PX" && to === "EM") return (parseFloat(input) / 16).toFixed(4) + "em";
    // Distance
    if (from === "Kilometers" && to === "Miles") return (parseFloat(input) * 0.621371).toFixed(4);
    if (from === "Miles" && to === "Kilometers") return (parseFloat(input) * 1.60934).toFixed(4);
    if (from === "Inches" && to === "Centimeters") return (parseFloat(input) * 2.54).toFixed(4);
    if (from === "Centimeters" && to === "Inches") return (parseFloat(input) / 2.54).toFixed(4);
    // Weight
    if (from === "Kilograms" && to === "Pounds") return (parseFloat(input) * 2.20462).toFixed(4);
    if (from === "Pounds" && to === "Kilograms") return (parseFloat(input) / 2.20462).toFixed(4);
    // Data size
    if (from === "Bytes" && to === "Kilobytes") return (parseFloat(input) / 1024).toFixed(4);
    if (from === "Megabytes" && to === "Gigabytes") return (parseFloat(input) / 1024).toFixed(6);
    // HEX/RGB
    if (from === "HEX" && to === "RGB") {
      const hex = input.replace("#", "");
      return `rgb(${parseInt(hex.slice(0,2),16)}, ${parseInt(hex.slice(2,4),16)}, ${parseInt(hex.slice(4,6),16)})`;
    }
    if (from === "RGB" && to === "HEX") {
      const match = input.match(/(\d+)/g);
      if (match && match.length >= 3) return "#" + match.slice(0,3).map(n => parseInt(n).toString(16).padStart(2,"0")).join("");
    }
    // Unix
    if (from === "Unix Timestamp" && to === "Date") return new Date(parseInt(input) * 1000).toISOString();
    if (from === "Date" && to === "Unix Timestamp") return String(Math.floor(new Date(input).getTime() / 1000));
    // Markdown to HTML
    if (from === "Markdown" && to === "HTML") {
      return input.replace(/^### (.*$)/gim, '<h3>$1</h3>').replace(/^## (.*$)/gim, '<h2>$1</h2>').replace(/^# (.*$)/gim, '<h1>$1</h1>')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\*(.*?)\*/g, '<em>$1</em>').replace(/\n/g, '<br>');
    }
    return "Conversion not implemented for this pair yet";
  } catch (e: any) {
    return "Error: " + e.message;
  }
}

export default function ConvertClient({ from, to, slug, allConversions }: {
  from: string; to: string; slug: string;
  allConversions: [string, { from: string; to: string; category: string }][];
}) {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-extrabold mb-2 text-center">{from} to {to} Converter</h1>
        <p className="text-gray-400 text-center mb-8">Free online {from} to {to} converter. Paste input, get output instantly.</p>
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="text-sm text-gray-400 block mb-1">{from} Input</label>
            <textarea value={input} onChange={e => setInput(e.target.value)} placeholder={`Paste ${from} here...`}
              className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-green-400 font-mono text-sm h-48 resize-none" />
          </div>
          <div>
            <label className="text-sm text-gray-400 block mb-1">{to} Output</label>
            <textarea readOnly value={output}
              className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-blue-400 font-mono text-sm h-48 resize-none" />
          </div>
        </div>
        <div className="flex gap-2 justify-center mb-8">
          <button onClick={() => setOutput(convert(from, to, input))}
            className="bg-purple-600 hover:bg-purple-700 px-8 py-3 rounded-xl font-bold">Convert</button>
          <button onClick={() => { navigator.clipboard.writeText(output); }}
            className="bg-gray-700 hover:bg-gray-600 px-6 py-3 rounded-xl font-bold">Copy</button>
        </div>
        <div className="bg-gray-900 rounded-xl p-6 mb-8">
          <h2 className="font-bold mb-3">All Converters</h2>
          <div className="flex flex-wrap gap-2">
            {allConversions.map(([s, c]) => (
              <Link key={s} href={`/convert/${s}`}
                className={`text-xs px-3 py-1 rounded-lg ${s === slug ? "bg-purple-600 text-white" : "bg-gray-800 text-gray-400 hover:bg-gray-700"}`}>
                {c.from} → {c.to}
              </Link>
            ))}
          </div>
        </div>
        <div className="text-center text-gray-500 text-sm">
          <a href="/json" className="text-purple-400 hover:underline">JSON</a>{" | "}
          <a href="/base64" className="text-purple-400 hover:underline">Base64</a>{" | "}
          <a href="/hex-rgb" className="text-purple-400 hover:underline">Colors</a>{" | "}
          <a href="/number-base" className="text-purple-400 hover:underline">Numbers</a>{" | "}
          <a href="/epoch" className="text-purple-400 hover:underline">Epoch</a>
        </div>
      </div>
    </div>
  );
}
