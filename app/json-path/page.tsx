"use client";
import { useState } from "react";

function getPaths(obj: any, prefix = ""): string[] {
  const paths: string[] = [];
  if (typeof obj === "object" && obj !== null) {
    for (const [k, v] of Object.entries(obj)) {
      const path = prefix ? `${prefix}.${k}` : k;
      paths.push(path);
      if (typeof v === "object" && v !== null) paths.push(...getPaths(v, path));
    }
  }
  return paths;
}

export default function JsonPathPage() {
  const [input, setInput] = useState('{\n  "user": {\n    "name": "Sol",\n    "settings": {\n      "theme": "dark",\n      "notifications": true\n    },\n    "tags": ["dev", "crypto"]\n  }\n}');
  const [paths, setPaths] = useState<string[]>([]);

  function analyze() {
    try {
      const obj = JSON.parse(input);
      setPaths(getPaths(obj));
    } catch { setPaths(["Invalid JSON"]); }
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-3xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-extrabold mb-2 text-center">JSON Path Finder</h1>
        <p className="text-gray-400 text-center mb-8">Paste JSON to see all paths. Click any path to copy.</p>
        <textarea value={input} onChange={e=>setInput(e.target.value)}
          className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-green-400 font-mono text-sm h-40 resize-none mb-4" />
        <button onClick={analyze} className="w-full bg-purple-600 hover:bg-purple-700 py-3 rounded-xl font-bold mb-4">Find Paths</button>
        {paths.length > 0 && (
          <div className="bg-gray-900 rounded-xl p-4">
            <div className="text-xs text-gray-400 mb-2">{paths.length} paths found</div>
            {paths.map((p,i) => (
              <div key={i} className="font-mono text-sm text-purple-400 py-1 px-2 hover:bg-gray-800 rounded cursor-pointer" onClick={()=>navigator.clipboard.writeText(p)}>{p}</div>
            ))}
          </div>
        )}
        <div className="mt-8 text-center text-gray-500 text-sm">
          <a href="/json" className="text-purple-400 hover:underline">JSON Formatter</a>{" | "}
          <a href="/json-validator" className="text-purple-400 hover:underline">Validator</a>{" | "}
          <a href="/json-to-ts" className="text-purple-400 hover:underline">JSON to TS</a>{" | "}
          <a href="/" className="text-purple-400 hover:underline">All Tools</a>
        </div>
      </div>
    </div>
  );
}
