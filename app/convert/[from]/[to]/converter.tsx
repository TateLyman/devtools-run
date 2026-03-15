"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ALL_CONVERSIONS } from "./conversions";

/* ════════════════════════════════════════════════════════════════════
   YAML PARSER (hand-written, no external deps)
   ════════════════════════════════════════════════════════════════════ */

function parseYamlValue(val: string): unknown {
  const t = val.trim();
  if (t === "" || t === "~" || t === "null") return null;
  if (t === "true" || t === "True" || t === "TRUE") return true;
  if (t === "false" || t === "False" || t === "FALSE") return false;
  if (/^-?\d+$/.test(t)) return parseInt(t, 10);
  if (/^-?\d+\.\d+$/.test(t)) return parseFloat(t);
  if ((t.startsWith('"') && t.endsWith('"')) || (t.startsWith("'") && t.endsWith("'")))
    return t.slice(1, -1);
  return t;
}

interface YLine { indent: number; key: string; value: string; isArr: boolean }

function tokenizeYaml(input: string): YLine[] {
  const out: YLine[] = [];
  for (const raw of input.split("\n")) {
    if (raw.trim() === "" || raw.trim().startsWith("#")) continue;
    const indent = raw.length - raw.trimStart().length;
    const trimmed = raw.trim();
    if (trimmed.startsWith("- ")) {
      const content = trimmed.slice(2);
      const ci = content.indexOf(": ");
      if (ci > 0 && !content.startsWith('"') && !content.startsWith("'")) {
        out.push({ indent, key: content.slice(0, ci).trim(), value: content.slice(ci + 2).trim(), isArr: true });
      } else {
        out.push({ indent, key: "", value: content.trim(), isArr: true });
      }
    } else if (trimmed.indexOf(": ") > 0) {
      const ci = trimmed.indexOf(": ");
      out.push({ indent, key: trimmed.slice(0, ci).trim(), value: trimmed.slice(ci + 2).trim(), isArr: false });
    } else if (trimmed.endsWith(":")) {
      out.push({ indent, key: trimmed.slice(0, -1).trim(), value: "", isArr: false });
    } else {
      out.push({ indent, key: "", value: trimmed, isArr: false });
    }
  }
  return out;
}

function buildObj(tokens: YLine[], start: number, base: number): [unknown, number] {
  const result: Record<string, unknown> = {};
  let i = start;
  while (i < tokens.length && tokens[i].indent >= base) {
    const t = tokens[i];
    if (t.indent > base) { i++; continue; }
    if (t.isArr) { return buildArr(tokens, i, base); }
    if (t.key && t.value === "") {
      if (i + 1 < tokens.length && tokens[i + 1].indent > base) {
        const ci = tokens[i + 1].indent;
        const [child, ni] = tokens[i + 1].isArr ? buildArr(tokens, i + 1, ci) : buildObj(tokens, i + 1, ci);
        result[t.key] = child; i = ni;
      } else { result[t.key] = null; i++; }
    } else if (t.key) { result[t.key] = parseYamlValue(t.value); i++; }
    else { i++; }
  }
  return [result, i];
}

function buildArr(tokens: YLine[], start: number, base: number): [unknown[], number] {
  const result: unknown[] = [];
  let i = start;
  while (i < tokens.length && tokens[i].indent >= base) {
    const t = tokens[i];
    if (t.indent > base && !t.isArr) { i++; continue; }
    if (t.indent < base) break;
    if (!t.isArr) { i++; continue; }
    if (t.key) {
      const obj: Record<string, unknown> = {};
      obj[t.key] = t.value === "" ? null : parseYamlValue(t.value);
      const ci = base + 2;
      while (i + 1 < tokens.length && tokens[i + 1].indent >= ci && !tokens[i + 1].isArr) {
        i++;
        const c = tokens[i];
        if (c.key && c.value === "") {
          if (i + 1 < tokens.length && tokens[i + 1].indent > c.indent) {
            const ni2 = tokens[i + 1].indent;
            const [nested, nextI] = tokens[i + 1].isArr ? buildArr(tokens, i + 1, ni2) : buildObj(tokens, i + 1, ni2);
            obj[c.key] = nested; i = nextI; continue;
          }
          obj[c.key] = null;
        } else if (c.key) { obj[c.key] = parseYamlValue(c.value); }
      }
      result.push(obj); i++;
    } else { result.push(parseYamlValue(t.value)); i++; }
  }
  return [result, i];
}

function yamlToJson(yaml: string): string {
  const tokens = tokenizeYaml(yaml);
  if (tokens.length === 0) return "{}";
  const [obj] = tokens[0].isArr ? buildArr(tokens, 0, tokens[0].indent) : buildObj(tokens, 0, tokens[0].indent);
  return JSON.stringify(obj, null, 2);
}

/* ── JSON to YAML ── */

function toYaml(value: unknown, indent: number): string {
  const pfx = "  ".repeat(indent);
  if (value === null || value === undefined) return "null";
  if (typeof value === "boolean") return value ? "true" : "false";
  if (typeof value === "number") return String(value);
  if (typeof value === "string") {
    if (/[:#\[\]{}&*!|>'"%@`]/.test(value) || value === "" || value === "true" || value === "false" || value === "null")
      return `"${value.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
    return value;
  }
  if (Array.isArray(value)) {
    if (value.length === 0) return "[]";
    const lines: string[] = [];
    for (const item of value) {
      if (typeof item === "object" && item !== null && !Array.isArray(item)) {
        const entries = Object.entries(item);
        if (entries.length > 0) {
          const [fk, fv] = entries[0];
          const fvs = typeof fv === "object" && fv !== null ? "\n" + toYamlI(fv, indent + 2) : " " + toYaml(fv, indent + 1);
          lines.push(`${pfx}- ${fk}:${fvs}`);
          for (let i = 1; i < entries.length; i++) {
            const [k, v] = entries[i];
            const vs = typeof v === "object" && v !== null ? "\n" + toYamlI(v, indent + 2) : " " + toYaml(v, indent + 1);
            lines.push(`${pfx}  ${k}:${vs}`);
          }
        } else lines.push(`${pfx}- {}`);
      } else lines.push(`${pfx}- ${toYaml(item, indent + 1)}`);
    }
    return lines.join("\n");
  }
  if (typeof value === "object") {
    const entries = Object.entries(value as Record<string, unknown>);
    if (entries.length === 0) return "{}";
    const lines: string[] = [];
    for (const [k, v] of entries) {
      if (typeof v === "object" && v !== null) { lines.push(`${pfx}${k}:`); lines.push(toYamlI(v, indent + 1)); }
      else lines.push(`${pfx}${k}: ${toYaml(v, indent + 1)}`);
    }
    return lines.join("\n");
  }
  return String(value);
}

function toYamlI(value: unknown, indent: number): string {
  if (Array.isArray(value)) return toYaml(value, indent);
  if (typeof value === "object" && value !== null) return toYaml(value, indent);
  return "  ".repeat(indent) + toYaml(value, indent);
}

function jsonToYaml(json: string): string {
  return toYaml(JSON.parse(json), 0);
}

/* ════════════════════════════════════════════════════════════════════
   MARKDOWN PARSER (basic, no external deps)
   ════════════════════════════════════════════════════════════════════ */

function mdToHtml(md: string): string {
  let html = md;

  // Code blocks (```) — must come before inline code
  html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (_m, lang, code) => {
    const escaped = code.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    return `<pre><code class="${lang}">${escaped.trimEnd()}</code></pre>`;
  });

  // Inline code
  html = html.replace(/`([^`]+)`/g, "<code>$1</code>");

  // Headings
  html = html.replace(/^######\s+(.+)$/gm, "<h6>$1</h6>");
  html = html.replace(/^#####\s+(.+)$/gm, "<h5>$1</h5>");
  html = html.replace(/^####\s+(.+)$/gm, "<h4>$1</h4>");
  html = html.replace(/^###\s+(.+)$/gm, "<h3>$1</h3>");
  html = html.replace(/^##\s+(.+)$/gm, "<h2>$1</h2>");
  html = html.replace(/^#\s+(.+)$/gm, "<h1>$1</h1>");

  // Horizontal rule
  html = html.replace(/^---$/gm, "<hr>");

  // Bold + italic
  html = html.replace(/\*\*\*(.+?)\*\*\*/g, "<strong><em>$1</em></strong>");
  html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/\*(.+?)\*/g, "<em>$1</em>");
  html = html.replace(/__(.+?)__/g, "<strong>$1</strong>");
  html = html.replace(/_(.+?)_/g, "<em>$1</em>");

  // Strikethrough
  html = html.replace(/~~(.+?)~~/g, "<del>$1</del>");

  // Images (before links)
  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1">');

  // Links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');

  // Blockquote
  html = html.replace(/^>\s+(.+)$/gm, "<blockquote>$1</blockquote>");

  // Unordered lists
  html = html.replace(/^[-*]\s+(.+)$/gm, "<li>$1</li>");
  html = html.replace(/((?:<li>.*<\/li>\n?)+)/g, "<ul>\n$1</ul>\n");

  // Ordered lists
  html = html.replace(/^\d+\.\s+(.+)$/gm, "<li>$1</li>");

  // Paragraphs — wrap remaining plain text lines
  const lines = html.split("\n");
  const out: string[] = [];
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed === "") { out.push(""); continue; }
    if (/^<(h[1-6]|ul|ol|li|pre|code|blockquote|hr|img|div|table|tr|th|td)/.test(trimmed)) {
      out.push(line); continue;
    }
    if (/^<\/(ul|ol|pre|blockquote)>/.test(trimmed)) {
      out.push(line); continue;
    }
    out.push(`<p>${trimmed}</p>`);
  }

  return out.join("\n").replace(/\n{3,}/g, "\n\n").trim();
}

/* ════════════════════════════════════════════════════════════════════
   CSV <-> JSON
   ════════════════════════════════════════════════════════════════════ */

function csvToJson(csv: string): string {
  const lines = csv.trim().split("\n");
  if (lines.length === 0) return "[]";

  function parseCsvLine(line: string): string[] {
    const result: string[] = [];
    let current = "";
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (inQuotes) {
        if (ch === '"') {
          if (i + 1 < line.length && line[i + 1] === '"') {
            current += '"'; i++;
          } else {
            inQuotes = false;
          }
        } else {
          current += ch;
        }
      } else {
        if (ch === '"') { inQuotes = true; }
        else if (ch === ",") { result.push(current.trim()); current = ""; }
        else { current += ch; }
      }
    }
    result.push(current.trim());
    return result;
  }

  const headers = parseCsvLine(lines[0]);
  const data = [];
  for (let i = 1; i < lines.length; i++) {
    if (lines[i].trim() === "") continue;
    const values = parseCsvLine(lines[i]);
    const obj: Record<string, string> = {};
    for (let j = 0; j < headers.length; j++) {
      obj[headers[j]] = values[j] ?? "";
    }
    data.push(obj);
  }
  return JSON.stringify(data, null, 2);
}

function jsonToCsv(json: string): string {
  const parsed = JSON.parse(json);
  if (!Array.isArray(parsed) || parsed.length === 0) return "";
  const headers = Object.keys(parsed[0]);

  function escapeCsv(val: unknown): string {
    const s = val === null || val === undefined ? "" : String(val);
    if (s.includes(",") || s.includes('"') || s.includes("\n")) {
      return '"' + s.replace(/"/g, '""') + '"';
    }
    return s;
  }

  const rows = [headers.map(escapeCsv).join(",")];
  for (const item of parsed) {
    rows.push(headers.map((h) => escapeCsv(item[h])).join(","));
  }
  return rows.join("\n");
}

/* ════════════════════════════════════════════════════════════════════
   CONVERSION FUNCTIONS MAP
   ════════════════════════════════════════════════════════════════════ */

type ConvertFn = (input: string) => string;

const CONVERTERS: Record<string, Record<string, ConvertFn>> = {
  json: {
    yaml: (input) => jsonToYaml(input),
    csv: (input) => jsonToCsv(input),
  },
  yaml: {
    json: (input) => yamlToJson(input),
  },
  hex: {
    rgb: (input) => {
      const clean = input.replace(/^#/, "").trim();
      let full = clean;
      if (clean.length === 3) full = clean.split("").map((c) => c + c).join("");
      if (!/^[0-9a-fA-F]{6}$/.test(full)) throw new Error("Invalid hex color. Use format: #RRGGBB or RRGGBB");
      const n = parseInt(full, 16);
      const r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
      return `rgb(${r}, ${g}, ${b})`;
    },
    decimal: (input) => {
      const clean = input.trim().replace(/^0x/i, "");
      if (!/^[0-9a-fA-F]+$/.test(clean)) throw new Error("Invalid hexadecimal number");
      return parseInt(clean, 16).toString(10);
    },
  },
  rgb: {
    hex: (input) => {
      const match = input.match(/(\d{1,3})\s*[,\s]\s*(\d{1,3})\s*[,\s]\s*(\d{1,3})/);
      if (!match) throw new Error("Invalid RGB. Use format: 255, 128, 0 or rgb(255, 128, 0)");
      const [r, g, b] = [match[1], match[2], match[3]].map(Number);
      if ([r, g, b].some((v) => v < 0 || v > 255)) throw new Error("RGB values must be 0-255");
      return "#" + [r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("");
    },
  },
  decimal: {
    hex: (input) => {
      const n = parseInt(input.trim(), 10);
      if (isNaN(n)) throw new Error("Invalid decimal number");
      return n < 0 ? "-" + Math.abs(n).toString(16) : n.toString(16);
    },
    binary: (input) => {
      const n = parseInt(input.trim(), 10);
      if (isNaN(n)) throw new Error("Invalid decimal number");
      return n < 0 ? "-" + Math.abs(n).toString(2) : n.toString(2);
    },
  },
  binary: {
    decimal: (input) => {
      const clean = input.trim().replace(/\s/g, "");
      if (!/^[01]+$/.test(clean)) throw new Error("Invalid binary number. Use only 0s and 1s");
      return parseInt(clean, 2).toString(10);
    },
  },
  celsius: {
    fahrenheit: (input) => {
      const c = parseFloat(input.trim());
      if (isNaN(c)) throw new Error("Invalid number");
      return ((c * 9) / 5 + 32).toFixed(4).replace(/\.?0+$/, "");
    },
  },
  fahrenheit: {
    celsius: (input) => {
      const f = parseFloat(input.trim());
      if (isNaN(f)) throw new Error("Invalid number");
      return (((f - 32) * 5) / 9).toFixed(4).replace(/\.?0+$/, "");
    },
  },
  km: {
    miles: (input) => {
      const v = parseFloat(input.trim());
      if (isNaN(v)) throw new Error("Invalid number");
      return (v * 0.621371).toFixed(6).replace(/\.?0+$/, "");
    },
  },
  miles: {
    km: (input) => {
      const v = parseFloat(input.trim());
      if (isNaN(v)) throw new Error("Invalid number");
      return (v * 1.60934).toFixed(6).replace(/\.?0+$/, "");
    },
  },
  kg: {
    lbs: (input) => {
      const v = parseFloat(input.trim());
      if (isNaN(v)) throw new Error("Invalid number");
      return (v * 2.20462).toFixed(6).replace(/\.?0+$/, "");
    },
  },
  lbs: {
    kg: (input) => {
      const v = parseFloat(input.trim());
      if (isNaN(v)) throw new Error("Invalid number");
      return (v * 0.453592).toFixed(6).replace(/\.?0+$/, "");
    },
  },
  px: {
    rem: (input) => {
      const v = parseFloat(input.trim());
      if (isNaN(v)) throw new Error("Invalid number");
      return (v / 16).toFixed(6).replace(/\.?0+$/, "");
    },
  },
  rem: {
    px: (input) => {
      const v = parseFloat(input.trim());
      if (isNaN(v)) throw new Error("Invalid number");
      return (v * 16).toFixed(6).replace(/\.?0+$/, "");
    },
  },
  unix: {
    date: (input) => {
      const n = parseInt(input.trim(), 10);
      if (isNaN(n)) throw new Error("Invalid Unix timestamp");
      const ms = n > 1e12 ? n : n * 1000;
      const d = new Date(ms);
      if (isNaN(d.getTime())) throw new Error("Invalid timestamp");
      return `${d.toUTCString()}\n\nISO 8601: ${d.toISOString()}\nLocal: ${d.toLocaleString()}`;
    },
  },
  date: {
    unix: (input) => {
      const d = new Date(input.trim());
      if (isNaN(d.getTime())) throw new Error("Invalid date. Try: 2024-01-15, Jan 15 2024, or 2024-01-15T12:00:00Z");
      const s = Math.floor(d.getTime() / 1000);
      return `Seconds: ${s}\nMilliseconds: ${d.getTime()}`;
    },
  },
  base64: {
    text: (input) => {
      try {
        return decodeURIComponent(
          Array.from(atob(input.trim()), (c) =>
            "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2)
          ).join("")
        );
      } catch {
        throw new Error("Invalid Base64 string");
      }
    },
  },
  text: {
    base64: (input) => {
      return btoa(
        encodeURIComponent(input).replace(/%([0-9A-F]{2})/g, (_m, p1) =>
          String.fromCharCode(parseInt(p1, 16))
        )
      );
    },
  },
  md: {
    html: (input) => mdToHtml(input),
  },
  csv: {
    json: (input) => csvToJson(input),
  },
};

/* ════════════════════════════════════════════════════════════════════
   PX/REM with configurable base
   ════════════════════════════════════════════════════════════════════ */

function pxToRemWithBase(input: string, base: number): string {
  const v = parseFloat(input.trim());
  if (isNaN(v)) throw new Error("Invalid number");
  return (v / base).toFixed(6).replace(/\.?0+$/, "");
}

function remToPxWithBase(input: string, base: number): string {
  const v = parseFloat(input.trim());
  if (isNaN(v)) throw new Error("Invalid number");
  return (v * base).toFixed(6).replace(/\.?0+$/, "");
}

/* ════════════════════════════════════════════════════════════════════
   PLACEHOLDER TEXT FOR EACH CONVERSION
   ════════════════════════════════════════════════════════════════════ */

const PLACEHOLDERS: Record<string, Record<string, string>> = {
  json: { yaml: '{"name": "John", "age": 30, "tags": ["dev", "design"]}', csv: '[{"name":"Alice","age":30},{"name":"Bob","age":25}]' },
  yaml: { json: "name: John\nage: 30\ntags:\n  - dev\n  - design" },
  hex: { rgb: "#3b82f6", decimal: "ff" },
  rgb: { hex: "59, 130, 246" },
  decimal: { hex: "255", binary: "42" },
  binary: { decimal: "101010" },
  celsius: { fahrenheit: "100" },
  fahrenheit: { celsius: "212" },
  km: { miles: "10" },
  miles: { km: "10" },
  kg: { lbs: "70" },
  lbs: { kg: "154" },
  px: { rem: "16" },
  rem: { px: "1" },
  unix: { date: "1700000000" },
  date: { unix: "2024-01-15T12:00:00Z" },
  base64: { text: "SGVsbG8gV29ybGQ=" },
  text: { base64: "Hello World" },
  md: { html: "# Hello World\n\nThis is **bold** and *italic*.\n\n- Item 1\n- Item 2\n\n[Link](https://example.com)" },
  csv: { json: "name,age,city\nAlice,30,NYC\nBob,25,LA" },
};

/* ════════════════════════════════════════════════════════════════════
   COMPONENT
   ════════════════════════════════════════════════════════════════════ */

export default function Converter({ from, to }: { from: string; to: string }) {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [baseFontSize, setBaseFontSize] = useState(16);

  const def = ALL_CONVERSIONS.find((c) => c.from === from && c.to === to);
  const fromLabel = def?.fromLabel ?? from.toUpperCase();
  const toLabel = def?.toLabel ?? to.toUpperCase();
  const convType = def?.type ?? "text";
  const formula = def?.formula;
  const placeholder = PLACEHOLDERS[from]?.[to] ?? "";

  const related = ALL_CONVERSIONS.filter(
    (c) => !(c.from === from && c.to === to) &&
      (c.from === from || c.to === to || (c.from === to && c.to === from) || c.from === to || c.to === from)
  ).slice(0, 8);

  useEffect(() => {
    setInput("");
    setOutput("");
    setError("");
  }, [from, to]);

  function doConvert(value: string) {
    setInput(value);
    if (!value.trim()) {
      setOutput("");
      setError("");
      return;
    }
    try {
      let result: string;
      if (from === "px" && to === "rem") {
        result = pxToRemWithBase(value, baseFontSize);
      } else if (from === "rem" && to === "px") {
        result = remToPxWithBase(value, baseFontSize);
      } else {
        const fn = CONVERTERS[from]?.[to];
        if (!fn) throw new Error("Conversion not supported");
        result = fn(value);
      }
      setOutput(result);
      setError("");
    } catch (e) {
      setError((e as Error).message);
      setOutput("");
    }
  }

  function handleBaseChange(newBase: number) {
    setBaseFontSize(newBase);
    if (input.trim()) {
      try {
        let result: string;
        if (from === "px" && to === "rem") {
          result = pxToRemWithBase(input, newBase);
        } else {
          result = remToPxWithBase(input, newBase);
        }
        setOutput(result);
        setError("");
      } catch (e) {
        setError((e as Error).message);
        setOutput("");
      }
    }
  }

  function copyOutput() {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  const isNotFound = !CONVERTERS[from]?.[to];

  if (isNotFound) {
    return (
      <>
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-1">Conversion Not Found</h1>
          <p className="text-[var(--text-secondary)] text-sm">
            The conversion from {from} to {to} is not available.
          </p>
        </div>
        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-4">Available Conversions</h2>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {ALL_CONVERSIONS.map((c) => (
              <Link
                key={`${c.from}-${c.to}`}
                href={`/convert/${c.from}/${c.to}`}
                className="block rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] p-3 hover:border-[var(--accent)] transition-colors text-sm"
              >
                {c.fromLabel} &rarr; {c.toLabel}
              </Link>
            ))}
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">
          Convert {fromLabel} to {toLabel}
        </h1>
        <p className="text-[var(--text-secondary)] text-sm">
          Free online {fromLabel} to {toLabel} converter. Fast, accurate, runs entirely in your browser.
          {formula && <> Formula: <code className="text-[var(--accent)]">{formula}</code></>}
        </p>
      </div>

      {/* AD SLOT - Top */}
      <div className="ad-slot mb-6">
        <span>Ad Space</span>
      </div>

      {/* PX/REM base font size control */}
      {(from === "px" || from === "rem") && (to === "rem" || to === "px") && (
        <div className="mb-4 flex items-center gap-3">
          <label className="text-sm text-[var(--text-secondary)]">Base font size:</label>
          <input
            type="number"
            min={1}
            max={100}
            value={baseFontSize}
            onChange={(e) => handleBaseChange(parseInt(e.target.value) || 16)}
            className="w-20 text-sm"
          />
          <span className="text-xs text-[var(--text-secondary)]">px</span>
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Input */}
        <div>
          <label className="block text-sm font-medium mb-2">
            {fromLabel} Input
          </label>
          {convType === "text" ? (
            <textarea
              rows={12}
              value={input}
              onChange={(e) => doConvert(e.target.value)}
              placeholder={placeholder}
              spellCheck={false}
            />
          ) : (
            <input
              type="number"
              value={input}
              onChange={(e) => doConvert(e.target.value)}
              placeholder={placeholder}
              step="any"
              className="text-lg py-3"
            />
          )}
        </div>

        {/* Output */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium">
              {toLabel} Output
            </label>
            {output && (
              <button
                onClick={copyOutput}
                className="text-xs text-[var(--accent)] hover:underline"
              >
                {copied ? "Copied!" : "Copy"}
              </button>
            )}
          </div>
          {error && (
            <div className="rounded-lg border border-[var(--error)] bg-[var(--error)]/10 p-3 text-sm text-[var(--error)] mb-3">
              {error}
            </div>
          )}
          {convType === "text" ? (
            <pre className="min-h-[288px]">{output}</pre>
          ) : (
            <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-tertiary)] p-4 min-h-[52px] flex items-center">
              <span className="text-2xl font-mono">{output || <span className="text-[var(--text-secondary)] text-base">Result will appear here</span>}</span>
            </div>
          )}
        </div>
      </div>

      {/* Reverse link */}
      {ALL_CONVERSIONS.some((c) => c.from === to && c.to === from) && (
        <div className="mt-4">
          <Link
            href={`/convert/${to}/${from}`}
            className="inline-flex items-center gap-2 text-sm text-[var(--accent)] hover:underline"
          >
            Reverse: Convert {toLabel} to {fromLabel} &rarr;
          </Link>
        </div>
      )}

      {/* AD SLOT - Bottom */}
      <div className="ad-slot mt-8">
        <span>Ad Space</span>
      </div>

      {/* Related conversions */}
      {related.length > 0 && (
        <section className="mt-10">
          <h2 className="text-lg font-semibold text-white mb-4">
            Related Conversions
          </h2>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((c) => (
              <Link
                key={`${c.from}-${c.to}`}
                href={`/convert/${c.from}/${c.to}`}
                className="block rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] p-3 hover:border-[var(--accent)] transition-colors text-sm"
              >
                {c.fromLabel} &rarr; {c.toLabel}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* SEO text */}
      <section className="mt-10 text-sm text-[var(--text-secondary)] space-y-2">
        <h2 className="text-lg font-semibold text-white">
          About {fromLabel} to {toLabel} Conversion
        </h2>
        <p>
          This free online tool converts {fromLabel} to {toLabel} instantly in your browser.
          No data is sent to any server &mdash; all processing happens client-side.
          {formula && <> The conversion uses the formula: <strong>{formula}</strong>.</>}
        </p>
        <p>
          Simply enter your {fromLabel} value in the input field and the {toLabel} result
          will appear in real-time. Use the copy button to quickly grab the output.
        </p>
      </section>

      {/* All conversions index */}
      <section className="mt-10">
        <h2 className="text-lg font-semibold text-white mb-4">
          All Converters
        </h2>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {ALL_CONVERSIONS.map((c) => (
            <Link
              key={`${c.from}-${c.to}`}
              href={`/convert/${c.from}/${c.to}`}
              className={`block rounded-lg border p-3 text-sm transition-colors ${
                c.from === from && c.to === to
                  ? "border-[var(--accent)] bg-[var(--accent)]/10 text-white"
                  : "border-[var(--border)] bg-[var(--bg-secondary)] hover:border-[var(--accent)]"
              }`}
            >
              {c.fromLabel} &rarr; {c.toLabel}
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
