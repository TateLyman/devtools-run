"use client";
import { useState } from "react";

function jsonToCsv(json: string): string {
  try {
    const data = JSON.parse(json);
    const arr = Array.isArray(data) ? data : [data];
    if (arr.length === 0) return "";

    // Get all unique keys
    const keys = new Set<string>();
    arr.forEach((item) => {
      if (typeof item === "object" && item !== null) {
        Object.keys(item).forEach((k) => keys.add(k));
      }
    });

    const headers = Array.from(keys);
    const csvRows = [headers.map((h) => `"${h}"`).join(",")];

    arr.forEach((item) => {
      const row = headers.map((h) => {
        const val = item[h];
        if (val === null || val === undefined) return "";
        if (typeof val === "object") return `"${JSON.stringify(val).replace(/"/g, '""')}"`;
        return `"${String(val).replace(/"/g, '""')}"`;
      });
      csvRows.push(row.join(","));
    });

    return csvRows.join("\n");
  } catch {
    return "Error: Invalid JSON";
  }
}

function csvToJson(csv: string): string {
  try {
    const lines = csv.trim().split("\n");
    if (lines.length < 2) return "[]";

    const headers = lines[0].split(",").map((h) => h.replace(/^"|"$/g, "").trim());
    const result = lines.slice(1).map((line) => {
      const values = line.match(/(".*?"|[^,]+)/g) || [];
      const obj: Record<string, any> = {};
      headers.forEach((h, i) => {
        let val = (values[i] || "").replace(/^"|"$/g, "").trim();
        // Try to parse numbers and booleans
        if (/^-?\d+(\.\d+)?$/.test(val)) obj[h] = Number(val);
        else if (val === "true") obj[h] = true;
        else if (val === "false") obj[h] = false;
        else if (val === "") obj[h] = null;
        else obj[h] = val;
      });
      return obj;
    });

    return JSON.stringify(result, null, 2);
  } catch {
    return "Error: Invalid CSV";
  }
}

const sampleJson = `[
  {"name": "Alice", "age": 30, "city": "NYC", "active": true},
  {"name": "Bob", "age": 25, "city": "LA", "active": false},
  {"name": "Charlie", "age": 35, "city": "Chicago", "active": true}
]`;

export default function JsonToCsv() {
  const [mode, setMode] = useState<"json-to-csv" | "csv-to-json">("json-to-csv");
  const [input, setInput] = useState("");
  const [copied, setCopied] = useState(false);

  const output = input.trim()
    ? mode === "json-to-csv"
      ? jsonToCsv(input)
      : csvToJson(input)
    : "";

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const ext = mode === "json-to-csv" ? "csv" : "json";
    const blob = new Blob([output], { type: ext === "csv" ? "text/csv" : "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.download = `converted.${ext}`;
    a.href = url;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">JSON ↔ CSV Converter</h1>
        <p className="text-[var(--text-secondary)]">
          Convert between JSON and CSV formats. Handles nested objects, arrays, numbers, and booleans. Download the result.
        </p>
      </div>

      <div className="flex gap-2 items-center">
        <button onClick={() => setMode("json-to-csv")} className={`px-4 py-2 rounded text-sm font-bold ${mode === "json-to-csv" ? "bg-purple-600 text-white" : "bg-[var(--bg-secondary)] text-[var(--text-secondary)]"}`}>JSON → CSV</button>
        <button onClick={() => setMode("csv-to-json")} className={`px-4 py-2 rounded text-sm font-bold ${mode === "csv-to-json" ? "bg-purple-600 text-white" : "bg-[var(--bg-secondary)] text-[var(--text-secondary)]"}`}>CSV → JSON</button>
        <button onClick={() => setInput(sampleJson)} className="text-xs text-purple-400 hover:text-purple-300 ml-auto">Load Example</button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="text-sm font-medium mb-1 block">{mode === "json-to-csv" ? "JSON Input" : "CSV Input"}</label>
          <textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder={mode === "json-to-csv" ? "Paste JSON array..." : "Paste CSV with headers..."} className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded px-3 py-2 text-white h-[350px] resize-none font-mono text-sm" spellCheck={false} />
        </div>
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-sm font-medium">{mode === "json-to-csv" ? "CSV Output" : "JSON Output"}</label>
            <div className="flex gap-2">
              {output && !output.startsWith("Error") && <button onClick={handleDownload} className="text-xs text-purple-400 hover:text-purple-300">Download</button>}
              {output && <button onClick={handleCopy} className="text-xs text-purple-400 hover:text-purple-300">{copied ? "Copied!" : "Copy"}</button>}
            </div>
          </div>
          <pre className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded px-3 py-2 text-emerald-400 h-[350px] overflow-auto font-mono text-sm whitespace-pre-wrap">{output}</pre>
        </div>
      </div>
    </div>
  );
}
