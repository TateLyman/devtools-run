"use client";
import { useState } from "react";

function jsonToTs(json: any, name: string = "Root", indent: number = 0): string {
  const pad = "  ".repeat(indent);
  if (Array.isArray(json)) {
    if (json.length === 0) return "any[]";
    return jsonToTs(json[0], name, indent) + "[]";
  }
  if (typeof json === "object" && json !== null) {
    const lines = [`${pad}interface ${name} {`];
    for (const [key, val] of Object.entries(json)) {
      const type = typeof val === "string" ? "string"
        : typeof val === "number" ? "number"
        : typeof val === "boolean" ? "boolean"
        : val === null ? "null"
        : Array.isArray(val) ? (val.length > 0 && typeof val[0] === "object" ? `${key.charAt(0).toUpperCase() + key.slice(1)}[]` : `${typeof val[0]}[]`)
        : "object";
      lines.push(`${pad}  ${key}: ${type};`);
    }
    lines.push(`${pad}}`);
    return lines.join("\n");
  }
  return typeof json;
}

export default function JsonToTsPage() {
  const [input, setInput] = useState('{\n  "name": "John",\n  "age": 30,\n  "active": true,\n  "tags": ["dev", "crypto"]\n}');
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

  function convert() {
    try {
      const parsed = JSON.parse(input);
      setOutput(jsonToTs(parsed, "Root"));
      setError("");
    } catch (e: any) {
      setError(e.message);
      setOutput("");
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-extrabold mb-2 text-center">JSON to TypeScript</h1>
        <p className="text-gray-400 text-center mb-8">Paste JSON, get TypeScript interfaces.</p>
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="text-sm text-gray-400 block mb-1">JSON Input</label>
            <textarea value={input} onChange={e => setInput(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-green-400 font-mono text-sm h-64 resize-none" />
          </div>
          <div>
            <label className="text-sm text-gray-400 block mb-1">TypeScript Output</label>
            <textarea readOnly value={output || error}
              className={`w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 font-mono text-sm h-64 resize-none ${error ? "text-red-400" : "text-blue-400"}`} />
          </div>
        </div>
        <button onClick={convert} className="block mx-auto bg-purple-600 hover:bg-purple-700 text-white font-bold px-8 py-3 rounded-lg">Convert</button>
        <div className="mt-12 text-center text-gray-500 text-sm">
          <a href="/json" className="text-purple-400 hover:underline">JSON Formatter</a>{" | "}
          <a href="/yaml-json" className="text-purple-400 hover:underline">YAML/JSON</a>{" | "}
          <a href="/base64" className="text-purple-400 hover:underline">Base64</a>{" | "}
          <a href="/regex" className="text-purple-400 hover:underline">Regex</a>{" | "}
          <a href="/diff" className="text-purple-400 hover:underline">Diff</a>
        </div>
      </div>
    </div>
  );
}
