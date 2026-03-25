"use client";
import { useState } from "react";

function jsonToSchema(json: string): string {
  try {
    const data = JSON.parse(json);
    return JSON.stringify(generateSchema(data), null, 2);
  } catch {
    return "// Invalid JSON";
  }
}

function generateSchema(value: any): any {
  if (value === null) return { type: "null" };
  if (Array.isArray(value)) {
    return {
      type: "array",
      items: value.length > 0 ? generateSchema(value[0]) : {},
    };
  }
  switch (typeof value) {
    case "string": return { type: "string" };
    case "number": return Number.isInteger(value) ? { type: "integer" } : { type: "number" };
    case "boolean": return { type: "boolean" };
    case "object": {
      const properties: Record<string, any> = {};
      const required: string[] = [];
      for (const [key, val] of Object.entries(value)) {
        properties[key] = generateSchema(val);
        if (val !== null && val !== undefined) required.push(key);
      }
      return { type: "object", properties, required };
    }
    default: return {};
  }
}

const sampleJSON = `{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "age": 30,
  "active": true,
  "tags": ["admin", "user"],
  "address": {
    "street": "123 Main St",
    "city": "NYC"
  }
}`;

export default function JSONSchema() {
  const [input, setInput] = useState("");
  const [copied, setCopied] = useState(false);
  const output = input.trim() ? jsonToSchema(input) : "";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">JSON Schema Generator</h1>
        <p className="text-[var(--text-secondary)]">
          Generate JSON Schema from JSON data. Detects types, arrays, nested objects, required fields. Free JSON Schema generator.
        </p>
      </div>
      <div className="flex gap-2">
        <button onClick={() => setInput(sampleJSON)} className="text-xs text-purple-400 hover:text-purple-300">Load Example</button>
        <button onClick={() => { navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 2000); }} className="text-xs text-purple-400 ml-auto">{copied ? "Copied!" : "Copy Schema"}</button>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="text-sm font-medium mb-1 block">JSON Input</label>
          <textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder="Paste JSON..." className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded px-3 py-2 text-white h-[400px] resize-none font-mono text-sm" spellCheck={false} />
        </div>
        <div>
          <label className="text-sm font-medium mb-1 block">JSON Schema</label>
          <pre className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded px-3 py-2 text-emerald-400 h-[400px] overflow-auto font-mono text-sm whitespace-pre-wrap">{output}</pre>
        </div>
      </div>
    </div>
  );
}
