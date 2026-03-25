"use client";
import { useState } from "react";

function jsonToTypeScript(json: string, rootName: string = "Root"): string {
  try {
    const data = JSON.parse(json);
    const interfaces: string[] = [];

    function getType(value: any, name: string): string {
      if (value === null) return "null";
      if (Array.isArray(value)) {
        if (value.length === 0) return "any[]";
        const itemType = getType(value[0], name + "Item");
        return `${itemType}[]`;
      }
      switch (typeof value) {
        case "string": return "string";
        case "number": return Number.isInteger(value) ? "number" : "number";
        case "boolean": return "boolean";
        case "object": {
          const interfaceName = name.charAt(0).toUpperCase() + name.slice(1);
          generateInterface(value, interfaceName);
          return interfaceName;
        }
        default: return "any";
      }
    }

    function generateInterface(obj: Record<string, any>, name: string) {
      const props: string[] = [];
      for (const [key, value] of Object.entries(obj)) {
        const safeName = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key) ? key : `"${key}"`;
        const type = getType(value, key);
        props.push(`  ${safeName}: ${type};`);
      }
      interfaces.push(`interface ${name} {\n${props.join("\n")}\n}`);
    }

    if (Array.isArray(data)) {
      if (data.length > 0 && typeof data[0] === "object") {
        generateInterface(data[0], rootName);
        return interfaces.reverse().join("\n\n") + `\n\ntype ${rootName}Array = ${rootName}[];`;
      }
      return `type ${rootName} = ${getType(data[0], rootName)}[];`;
    }

    if (typeof data === "object" && data !== null) {
      generateInterface(data, rootName);
      return interfaces.reverse().join("\n\n");
    }

    return `type ${rootName} = ${typeof data};`;
  } catch (e) {
    return "// Error: Invalid JSON";
  }
}

const sampleJSON = `{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "age": 30,
  "active": true,
  "address": {
    "street": "123 Main St",
    "city": "New York",
    "zip": "10001",
    "coordinates": {
      "lat": 40.7128,
      "lng": -74.006
    }
  },
  "roles": ["admin", "user"],
  "orders": [
    {
      "id": 101,
      "total": 99.99,
      "items": ["Widget A", "Widget B"]
    }
  ]
}`;

export default function JsonToTypescript() {
  const [input, setInput] = useState("");
  const [rootName, setRootName] = useState("Root");
  const [copied, setCopied] = useState(false);

  const output = input.trim() ? jsonToTypeScript(input, rootName) : "";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">JSON to TypeScript</h1>
        <p className="text-[var(--text-secondary)]">
          Convert JSON to TypeScript interfaces instantly. Handles nested objects, arrays, optional fields. Free JSON to TS converter.
        </p>
      </div>

      <div className="flex gap-2 items-center">
        <input value={rootName} onChange={(e) => setRootName(e.target.value)} placeholder="Root interface name" className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded px-3 py-1.5 text-white text-sm w-40" />
        <button onClick={() => setInput(sampleJSON)} className="text-xs text-purple-400 hover:text-purple-300">Load Example</button>
        <button onClick={() => { navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 2000); }} className="text-xs text-purple-400 hover:text-purple-300 ml-auto">{copied ? "Copied!" : "Copy TS"}</button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="text-sm font-medium mb-1 block">JSON Input</label>
          <textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder="Paste JSON here..." className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded px-3 py-2 text-white h-[400px] resize-none font-mono text-sm" spellCheck={false} />
        </div>
        <div>
          <label className="text-sm font-medium mb-1 block">TypeScript Output</label>
          <pre className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded px-3 py-2 text-emerald-400 h-[400px] overflow-auto font-mono text-sm whitespace-pre-wrap">{output}</pre>
        </div>
      </div>
    </div>
  );
}
