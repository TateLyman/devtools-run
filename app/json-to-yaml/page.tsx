"use client";
import { useState } from "react";

function jsonToYaml(obj: unknown, indent: number = 0): string {
  const prefix = "  ".repeat(indent);
  if (obj === null) return "null";
  if (obj === undefined) return "~";
  if (typeof obj === "boolean") return obj ? "true" : "false";
  if (typeof obj === "number") return String(obj);
  if (typeof obj === "string") {
    if (
      obj.includes("\n") ||
      obj.includes(": ") ||
      obj.includes("#") ||
      obj.startsWith("{") ||
      obj.startsWith("[") ||
      obj.startsWith("'") ||
      obj.startsWith('"') ||
      obj === "" ||
      obj === "true" ||
      obj === "false" ||
      obj === "null" ||
      /^\d/.test(obj)
    ) {
      return JSON.stringify(obj);
    }
    return obj;
  }
  if (Array.isArray(obj)) {
    if (obj.length === 0) return "[]";
    return obj
      .map((item) => {
        const val = jsonToYaml(item, indent + 1);
        if (typeof item === "object" && item !== null && !Array.isArray(item)) {
          const lines = val.split("\n");
          return `${prefix}- ${lines[0]}\n${lines.slice(1).map((l) => `${prefix}  ${l}`).join("\n")}`;
        }
        return `${prefix}- ${val}`;
      })
      .join("\n");
  }
  if (typeof obj === "object") {
    const entries = Object.entries(obj as Record<string, unknown>);
    if (entries.length === 0) return "{}";
    return entries
      .map(([key, val]) => {
        const safeKey = /[:\s#\[\]{}&*!|>'"%@`]/.test(key) || key === "" ? JSON.stringify(key) : key;
        if (typeof val === "object" && val !== null) {
          const nested = jsonToYaml(val, indent + 1);
          return `${prefix}${safeKey}:\n${nested}`;
        }
        return `${prefix}${safeKey}: ${jsonToYaml(val, indent + 1)}`;
      })
      .join("\n");
  }
  return String(obj);
}

function yamlToJson(yaml: string): unknown {
  const lines = yaml.split("\n");
  const result = parseYamlLines(lines, 0, 0).value;
  return result;
}

function getIndent(line: string): number {
  const match = line.match(/^(\s*)/);
  return match ? match[1].length : 0;
}

function parseYamlLines(
  lines: string[],
  start: number,
  baseIndent: number
): { value: unknown; nextIndex: number } {
  if (start >= lines.length) return { value: null, nextIndex: start };
  const firstLine = lines[start];
  const trimmed = firstLine.trim();
  if (trimmed === "" || trimmed.startsWith("#"))
    return parseYamlLines(lines, start + 1, baseIndent);
  if (trimmed.startsWith("- ") || trimmed === "-") {
    const arr: unknown[] = [];
    let i = start;
    while (i < lines.length) {
      const line = lines[i];
      if (line.trim() === "" || line.trim().startsWith("#")) { i++; continue; }
      const ind = getIndent(line);
      if (ind < baseIndent) break;
      if (ind === baseIndent && line.trim().startsWith("-")) {
        const rest = line.trim().slice(1).trim();
        if (rest === "") {
          const { value, nextIndex } = parseYamlLines(lines, i + 1, baseIndent + 2);
          arr.push(value);
          i = nextIndex;
        } else if (rest.includes(": ") || rest.endsWith(":")) {
          const tempLines = [rest, ...lines.slice(i + 1).filter((l) => getIndent(l) > baseIndent).map((l) => l.slice(2))];
          const { value } = parseYamlLines(tempLines, 0, 0);
          arr.push(value);
          i++;
          while (i < lines.length && lines[i].trim() !== "" && getIndent(lines[i]) > baseIndent) i++;
        } else {
          arr.push(parseScalar(rest));
          i++;
        }
      } else {
        break;
      }
    }
    return { value: arr, nextIndex: i };
  }
  if (trimmed.includes(": ") || trimmed.endsWith(":")) {
    const obj: Record<string, unknown> = {};
    let i = start;
    while (i < lines.length) {
      const line = lines[i];
      if (line.trim() === "" || line.trim().startsWith("#")) { i++; continue; }
      const ind = getIndent(line);
      if (ind < baseIndent) break;
      if (ind > baseIndent) { i++; continue; }
      const t = line.trim();
      const colonIdx = t.indexOf(": ");
      const endsColon = t.endsWith(":");
      if (colonIdx > 0 || endsColon) {
        const key = endsColon && colonIdx < 0 ? t.slice(0, -1) : t.slice(0, colonIdx);
        const val = endsColon && colonIdx < 0 ? "" : t.slice(colonIdx + 2);
        const cleanKey = (key.startsWith('"') && key.endsWith('"')) || (key.startsWith("'") && key.endsWith("'")) ? key.slice(1, -1) : key;
        if (val === "" || val === undefined) {
          const { value, nextIndex } = parseYamlLines(lines, i + 1, ind + 2);
          obj[cleanKey] = value;
          i = nextIndex;
        } else {
          obj[cleanKey] = parseScalar(val);
          i++;
        }
      } else {
        i++;
      }
    }
    return { value: obj, nextIndex: i };
  }
  return { value: parseScalar(trimmed), nextIndex: start + 1 };
}

function parseScalar(val: string): unknown {
  if (val === "null" || val === "~") return null;
  if (val === "true") return true;
  if (val === "false") return false;
  if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'")))
    return val.slice(1, -1);
  if (val.startsWith("[") || val.startsWith("{")) {
    try { return JSON.parse(val); } catch { return val; }
  }
  if (/^-?\d+$/.test(val)) return parseInt(val, 10);
  if (/^-?\d+\.\d+$/.test(val)) return parseFloat(val);
  return val;
}

export default function JsonToYaml() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<"json-to-yaml" | "yaml-to-json">("json-to-yaml");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const convert = () => {
    setError("");
    setOutput("");
    if (!input.trim()) { setError("Please enter some input."); return; }
    try {
      if (mode === "json-to-yaml") {
        const parsed = JSON.parse(input);
        setOutput(jsonToYaml(parsed));
      } else {
        const parsed = yamlToJson(input);
        setOutput(JSON.stringify(parsed, null, 2));
      }
    } catch (e) {
      setError(`Invalid ${mode === "json-to-yaml" ? "JSON" : "YAML"}: ${(e as Error).message}`);
    }
  };

  const copy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const swap = () => {
    setMode(mode === "json-to-yaml" ? "yaml-to-json" : "json-to-yaml");
    setInput(output);
    setOutput("");
    setError("");
  };

  const loadSample = () => {
    const sample = JSON.stringify({
      name: "my-project",
      version: "1.0.0",
      dependencies: { react: "^18.2.0", next: "^14.0.0" },
      scripts: { dev: "next dev", build: "next build", start: "next start" },
      features: ["SSR", "TypeScript", "API Routes"],
      config: { port: 3000, debug: false, database: null },
    }, null, 2);
    setMode("json-to-yaml");
    setInput(sample);
    setOutput("");
    setError("");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">JSON to YAML Converter</h1>
        <p className="text-[var(--text-secondary)]">
          Convert between JSON and YAML formats instantly. Bidirectional conversion with syntax validation. Everything runs locally in your browser.
        </p>
      </div>

      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-4 flex flex-wrap gap-3 items-center">
        <button
          onClick={() => { setMode("json-to-yaml"); setOutput(""); setError(""); }}
          className={`px-4 py-2 rounded text-sm font-bold ${mode === "json-to-yaml" ? "bg-purple-600 text-white" : "bg-[var(--bg-primary)] text-[var(--text-secondary)] hover:text-white"}`}
        >
          JSON → YAML
        </button>
        <button
          onClick={() => { setMode("yaml-to-json"); setOutput(""); setError(""); }}
          className={`px-4 py-2 rounded text-sm font-bold ${mode === "yaml-to-json" ? "bg-purple-600 text-white" : "bg-[var(--bg-primary)] text-[var(--text-secondary)] hover:text-white"}`}
        >
          YAML → JSON
        </button>
        <button onClick={swap} className="text-sm text-purple-400 hover:text-purple-300 ml-2">
          ⇄ Swap
        </button>
        <button onClick={loadSample} className="text-sm text-[var(--text-secondary)] hover:text-white ml-auto">
          Load Sample
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-bold text-purple-400 mb-1 block">
            {mode === "json-to-yaml" ? "JSON Input" : "YAML Input"}
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={mode === "json-to-yaml" ? '{\n  "key": "value"\n}' : "key: value\nlist:\n  - item1\n  - item2"}
            className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded px-4 py-3 text-white h-72 resize-none font-mono text-sm"
            spellCheck={false}
          />
        </div>
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-sm font-bold text-emerald-400">
              {mode === "json-to-yaml" ? "YAML Output" : "JSON Output"}
            </label>
            {output && (
              <button onClick={copy} className="text-xs text-[var(--text-secondary)] hover:text-white">
                {copied ? "Copied!" : "Copy"}
              </button>
            )}
          </div>
          <textarea
            value={output}
            readOnly
            placeholder="Output will appear here..."
            className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded px-4 py-3 text-emerald-400 h-72 resize-none font-mono text-sm"
          />
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-sm text-red-400">{error}</div>
      )}

      <button
        onClick={convert}
        className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-2.5 rounded font-bold text-sm"
      >
        Convert
      </button>

      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-4 text-sm text-[var(--text-secondary)]">
        <h3 className="font-bold text-white mb-2">About JSON & YAML</h3>
        <ul className="list-disc list-inside space-y-1">
          <li><strong>JSON</strong> — JavaScript Object Notation, widely used for APIs and config</li>
          <li><strong>YAML</strong> — YAML Ain&apos;t Markup Language, popular for Docker Compose, Kubernetes, CI/CD configs</li>
          <li>YAML supports comments, JSON does not</li>
          <li>All conversion happens locally in your browser — no data is sent anywhere</li>
        </ul>
      </div>
    </div>
  );
}
