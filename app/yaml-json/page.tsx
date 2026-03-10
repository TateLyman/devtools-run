"use client";

import { useState } from "react";

/* ── Basic YAML parser ── */

interface YamlLine {
  indent: number;
  key: string;
  value: string;
  isArrayItem: boolean;
  raw: string;
}

function parseYamlValue(val: string): unknown {
  const trimmed = val.trim();
  if (trimmed === "" || trimmed === "~" || trimmed === "null") return null;
  if (trimmed === "true" || trimmed === "True" || trimmed === "TRUE") return true;
  if (trimmed === "false" || trimmed === "False" || trimmed === "FALSE") return false;
  if (/^-?\d+$/.test(trimmed)) return parseInt(trimmed, 10);
  if (/^-?\d+\.\d+$/.test(trimmed)) return parseFloat(trimmed);
  // Remove quotes if present
  if ((trimmed.startsWith('"') && trimmed.endsWith('"')) ||
      (trimmed.startsWith("'") && trimmed.endsWith("'"))) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
}

function tokenizeYaml(input: string): YamlLine[] {
  const lines = input.split("\n");
  const result: YamlLine[] = [];

  for (const raw of lines) {
    // Skip empty lines and comments
    if (raw.trim() === "" || raw.trim().startsWith("#")) continue;

    const indent = raw.length - raw.trimStart().length;
    const trimmed = raw.trim();

    // Array item
    if (trimmed.startsWith("- ")) {
      const content = trimmed.slice(2);
      const colonIdx = content.indexOf(": ");
      if (colonIdx > 0 && !content.startsWith('"') && !content.startsWith("'")) {
        result.push({
          indent,
          key: content.slice(0, colonIdx).trim(),
          value: content.slice(colonIdx + 2).trim(),
          isArrayItem: true,
          raw,
        });
      } else {
        result.push({
          indent,
          key: "",
          value: content.trim(),
          isArrayItem: true,
          raw,
        });
      }
      continue;
    }

    // Key: value
    const colonIdx = trimmed.indexOf(": ");
    if (colonIdx > 0) {
      result.push({
        indent,
        key: trimmed.slice(0, colonIdx).trim(),
        value: trimmed.slice(colonIdx + 2).trim(),
        isArrayItem: false,
        raw,
      });
      continue;
    }

    // Key with no value (parent for nested object)
    if (trimmed.endsWith(":")) {
      result.push({
        indent,
        key: trimmed.slice(0, -1).trim(),
        value: "",
        isArrayItem: false,
        raw,
      });
      continue;
    }

    // Bare value
    result.push({
      indent,
      key: "",
      value: trimmed,
      isArrayItem: false,
      raw,
    });
  }

  return result;
}

function buildYamlObject(tokens: YamlLine[], start: number, baseIndent: number): [unknown, number] {
  const result: Record<string, unknown> = {};
  let i = start;

  while (i < tokens.length && tokens[i].indent >= baseIndent) {
    const token = tokens[i];

    if (token.indent > baseIndent) {
      // This shouldn't happen at top level, skip
      i++;
      continue;
    }

    if (token.isArrayItem) {
      // Switch to array mode
      const [arr, nextI] = buildYamlArray(tokens, i, baseIndent);
      return [arr, nextI];
    }

    if (token.key && token.value === "") {
      // Check next line to determine if child is array or object
      if (i + 1 < tokens.length && tokens[i + 1].indent > baseIndent) {
        const childIndent = tokens[i + 1].indent;
        const [child, nextI] = tokens[i + 1].isArrayItem
          ? buildYamlArray(tokens, i + 1, childIndent)
          : buildYamlObject(tokens, i + 1, childIndent);
        result[token.key] = child;
        i = nextI;
      } else {
        result[token.key] = null;
        i++;
      }
    } else if (token.key) {
      result[token.key] = parseYamlValue(token.value);
      i++;
    } else {
      i++;
    }
  }

  return [result, i];
}

function buildYamlArray(tokens: YamlLine[], start: number, baseIndent: number): [unknown[], number] {
  const result: unknown[] = [];
  let i = start;

  while (i < tokens.length && tokens[i].indent >= baseIndent) {
    const token = tokens[i];

    if (token.indent > baseIndent && !token.isArrayItem) {
      // Part of previous item's nested content
      i++;
      continue;
    }

    if (token.indent < baseIndent) break;

    if (!token.isArrayItem) {
      i++;
      continue;
    }

    if (token.key) {
      // Array item with key: value — start of an object in the array
      const obj: Record<string, unknown> = {};
      obj[token.key] = token.value === "" ? null : parseYamlValue(token.value);

      // Check for additional keys at deeper indent
      const childIndent = baseIndent + 2;
      while (i + 1 < tokens.length && tokens[i + 1].indent >= childIndent && !tokens[i + 1].isArrayItem) {
        i++;
        const child = tokens[i];
        if (child.key && child.value === "") {
          if (i + 1 < tokens.length && tokens[i + 1].indent > child.indent) {
            const nextIndent = tokens[i + 1].indent;
            const [nested, nextI] = tokens[i + 1].isArrayItem
              ? buildYamlArray(tokens, i + 1, nextIndent)
              : buildYamlObject(tokens, i + 1, nextIndent);
            obj[child.key] = nested;
            i = nextI;
            continue;
          }
          obj[child.key] = null;
        } else if (child.key) {
          obj[child.key] = parseYamlValue(child.value);
        }
      }

      result.push(obj);
      i++;
    } else {
      // Simple array item
      result.push(parseYamlValue(token.value));
      i++;
    }
  }

  return [result, i];
}

function yamlToJson(yaml: string): string {
  const tokens = tokenizeYaml(yaml);
  if (tokens.length === 0) return "{}";
  const [obj] = tokens[0].isArrayItem
    ? buildYamlArray(tokens, 0, tokens[0].indent)
    : buildYamlObject(tokens, 0, tokens[0].indent);
  return JSON.stringify(obj, null, 2);
}

/* ── JSON to YAML ── */

function jsonToYaml(json: string): string {
  const parsed = JSON.parse(json);
  return toYaml(parsed, 0);
}

function toYaml(value: unknown, indent: number): string {
  const prefix = "  ".repeat(indent);

  if (value === null || value === undefined) return "null";
  if (typeof value === "boolean") return value ? "true" : "false";
  if (typeof value === "number") return String(value);
  if (typeof value === "string") {
    // Quote if it contains special chars
    if (/[:#\[\]{}&*!|>'"%@`]/.test(value) || value === "" || value === "true" || value === "false" || value === "null") {
      return `"${value.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
    }
    return value;
  }

  if (Array.isArray(value)) {
    if (value.length === 0) return "[]";
    const lines: string[] = [];
    for (const item of value) {
      if (typeof item === "object" && item !== null && !Array.isArray(item)) {
        const entries = Object.entries(item);
        if (entries.length > 0) {
          const [firstKey, firstVal] = entries[0];
          const firstValStr = typeof firstVal === "object" && firstVal !== null
            ? "\n" + toYamlIndented(firstVal, indent + 2)
            : " " + toYaml(firstVal, indent + 1);
          lines.push(`${prefix}- ${firstKey}:${firstValStr}`);
          for (let i = 1; i < entries.length; i++) {
            const [k, v] = entries[i];
            const vStr = typeof v === "object" && v !== null
              ? "\n" + toYamlIndented(v, indent + 2)
              : " " + toYaml(v, indent + 1);
            lines.push(`${prefix}  ${k}:${vStr}`);
          }
        } else {
          lines.push(`${prefix}- {}`);
        }
      } else {
        lines.push(`${prefix}- ${toYaml(item, indent + 1)}`);
      }
    }
    return lines.join("\n");
  }

  if (typeof value === "object") {
    const entries = Object.entries(value as Record<string, unknown>);
    if (entries.length === 0) return "{}";
    const lines: string[] = [];
    for (const [k, v] of entries) {
      if (typeof v === "object" && v !== null) {
        lines.push(`${prefix}${k}:`);
        lines.push(toYamlIndented(v, indent + 1));
      } else {
        lines.push(`${prefix}${k}: ${toYaml(v, indent + 1)}`);
      }
    }
    return lines.join("\n");
  }

  return String(value);
}

function toYamlIndented(value: unknown, indent: number): string {
  if (Array.isArray(value)) {
    return toYaml(value, indent);
  }
  if (typeof value === "object" && value !== null) {
    return toYaml(value, indent);
  }
  return "  ".repeat(indent) + toYaml(value, indent);
}

/* ── Component ── */

export default function YamlJsonPage() {
  const [left, setLeft] = useState("");
  const [right, setRight] = useState("");
  const [mode, setMode] = useState<"yaml-to-json" | "json-to-yaml">("yaml-to-json");
  const [error, setError] = useState("");

  function convert() {
    setError("");
    try {
      if (mode === "yaml-to-json") {
        setRight(yamlToJson(left));
      } else {
        setRight(jsonToYaml(left));
      }
    } catch (e) {
      setError((e as Error).message);
      setRight("");
    }
  }

  function swap() {
    const newMode = mode === "yaml-to-json" ? "json-to-yaml" : "yaml-to-json";
    setMode(newMode as "yaml-to-json" | "json-to-yaml");
    setLeft(right);
    setRight("");
    setError("");
  }

  function copyOutput() {
    navigator.clipboard.writeText(right);
  }

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">YAML / JSON Converter</h1>
        <p className="text-[var(--text-secondary)] text-sm">
          Convert between YAML and JSON. Two-way conversion with a built-in
          parser. Runs entirely in your browser.
        </p>
      </div>

      <div className="ad-slot mb-6">
        <span>Ad Space</span>
      </div>

      <div className="flex items-center gap-3 mb-4">
        <button
          onClick={() => { setMode("yaml-to-json"); setRight(""); setError(""); }}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            mode === "yaml-to-json"
              ? "bg-[var(--accent)] text-white"
              : "bg-[var(--bg-tertiary)] border border-[var(--border)] hover:border-[var(--accent)]"
          }`}
        >
          YAML &rarr; JSON
        </button>
        <button
          onClick={() => { setMode("json-to-yaml"); setRight(""); setError(""); }}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            mode === "json-to-yaml"
              ? "bg-[var(--accent)] text-white"
              : "bg-[var(--bg-tertiary)] border border-[var(--border)] hover:border-[var(--accent)]"
          }`}
        >
          JSON &rarr; YAML
        </button>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div>
          <label className="block text-sm font-medium mb-2">
            {mode === "yaml-to-json" ? "Input YAML" : "Input JSON"}
          </label>
          <textarea
            rows={14}
            value={left}
            onChange={(e) => setLeft(e.target.value)}
            placeholder={
              mode === "yaml-to-json"
                ? "name: John\nage: 30\ntags:\n  - developer\n  - designer"
                : '{"name": "John", "age": 30}'
            }
            spellCheck={false}
          />
          <div className="flex gap-2 mt-3">
            <button
              onClick={convert}
              className="px-4 py-2 rounded-lg bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white text-sm font-medium transition-colors"
            >
              Convert
            </button>
            <button
              onClick={swap}
              className="px-4 py-2 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border)] hover:border-[var(--accent)] text-sm font-medium transition-colors"
            >
              Swap
            </button>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium">
              {mode === "yaml-to-json" ? "Output JSON" : "Output YAML"}
            </label>
            {right && (
              <button
                onClick={copyOutput}
                className="text-xs text-[var(--accent)] hover:underline"
              >
                Copy
              </button>
            )}
          </div>
          {error && (
            <div className="rounded-lg border border-[var(--error)] bg-[var(--error)]/10 p-3 text-sm text-[var(--error)] mb-3">
              {error}
            </div>
          )}
          <pre className="min-h-[340px]">{right}</pre>
        </div>
      </div>

      <div className="ad-slot mt-8">
        <span>Ad Space</span>
      </div>

      <section className="mt-10 text-sm text-[var(--text-secondary)] space-y-2">
        <h2 className="text-lg font-semibold text-white">
          About YAML / JSON Converter
        </h2>
        <p>
          Convert between YAML and JSON formats instantly. The built-in YAML
          parser handles key-value pairs, nested objects, arrays, strings,
          numbers, and booleans. All processing happens in your browser &mdash;
          your data never leaves your machine.
        </p>
      </section>
    </>
  );
}
