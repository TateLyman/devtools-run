"use client";
import { useState } from "react";

type EscapeMode = "json" | "html" | "url" | "regex" | "sql" | "csv" | "xml" | "javascript";

interface ModeInfo {
  id: EscapeMode;
  label: string;
  description: string;
  escape: (s: string) => string;
  unescape: (s: string) => string;
}

const modes: ModeInfo[] = [
  {
    id: "json",
    label: "JSON",
    description: "Escape/unescape strings for JSON values",
    escape: (s) => {
      return JSON.stringify(s).slice(1, -1);
    },
    unescape: (s) => {
      try { return JSON.parse(`"${s}"`); } catch { return s; }
    },
  },
  {
    id: "html",
    label: "HTML",
    description: "Escape/unescape HTML special characters",
    escape: (s) =>
      s.replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;"),
    unescape: (s) =>
      s.replace(/&#039;/g, "'")
        .replace(/&quot;/g, '"')
        .replace(/&gt;/g, ">")
        .replace(/&lt;/g, "<")
        .replace(/&amp;/g, "&"),
  },
  {
    id: "url",
    label: "URL",
    description: "Percent-encode/decode URL components",
    escape: (s) => encodeURIComponent(s),
    unescape: (s) => { try { return decodeURIComponent(s); } catch { return s; } },
  },
  {
    id: "regex",
    label: "Regex",
    description: "Escape special regex metacharacters",
    escape: (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
    unescape: (s) => s.replace(/\\([.*+?^${}()|[\]\\])/g, "$1"),
  },
  {
    id: "sql",
    label: "SQL",
    description: "Escape single quotes for SQL strings",
    escape: (s) => s.replace(/'/g, "''").replace(/\\/g, "\\\\"),
    unescape: (s) => s.replace(/''/g, "'").replace(/\\\\/g, "\\"),
  },
  {
    id: "csv",
    label: "CSV",
    description: "Escape values for CSV fields (RFC 4180)",
    escape: (s) => {
      if (s.includes('"') || s.includes(",") || s.includes("\n") || s.includes("\r")) {
        return '"' + s.replace(/"/g, '""') + '"';
      }
      return s;
    },
    unescape: (s) => {
      if (s.startsWith('"') && s.endsWith('"')) {
        return s.slice(1, -1).replace(/""/g, '"');
      }
      return s;
    },
  },
  {
    id: "xml",
    label: "XML",
    description: "Escape special XML characters",
    escape: (s) =>
      s.replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&apos;"),
    unescape: (s) =>
      s.replace(/&apos;/g, "'")
        .replace(/&quot;/g, '"')
        .replace(/&gt;/g, ">")
        .replace(/&lt;/g, "<")
        .replace(/&amp;/g, "&"),
  },
  {
    id: "javascript",
    label: "JavaScript",
    description: "Escape strings for JavaScript/TypeScript",
    escape: (s) =>
      s.replace(/\\/g, "\\\\")
        .replace(/'/g, "\\'")
        .replace(/"/g, '\\"')
        .replace(/\n/g, "\\n")
        .replace(/\r/g, "\\r")
        .replace(/\t/g, "\\t")
        .replace(/\0/g, "\\0"),
    unescape: (s) =>
      s.replace(/\\0/g, "\0")
        .replace(/\\t/g, "\t")
        .replace(/\\r/g, "\r")
        .replace(/\\n/g, "\n")
        .replace(/\\"/g, '"')
        .replace(/\\'/g, "'")
        .replace(/\\\\/g, "\\"),
  },
];

export default function StringEscape() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<EscapeMode>("json");
  const [direction, setDirection] = useState<"escape" | "unescape">("escape");
  const [copied, setCopied] = useState(false);

  const currentMode = modes.find((m) => m.id === mode)!;

  const process = () => {
    if (!input) { setOutput(""); return; }
    const fn = direction === "escape" ? currentMode.escape : currentMode.unescape;
    setOutput(fn(input));
  };

  const handleInputChange = (value: string) => {
    setInput(value);
    if (!value) { setOutput(""); return; }
    const fn = direction === "escape" ? currentMode.escape : currentMode.unescape;
    setOutput(fn(value));
  };

  const handleModeChange = (newMode: EscapeMode) => {
    setMode(newMode);
    if (input) {
      const m = modes.find((mm) => mm.id === newMode)!;
      const fn = direction === "escape" ? m.escape : m.unescape;
      setOutput(fn(input));
    }
  };

  const handleDirectionChange = (dir: "escape" | "unescape") => {
    setDirection(dir);
    if (input) {
      const fn = dir === "escape" ? currentMode.escape : currentMode.unescape;
      setOutput(fn(input));
    }
  };

  const copy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const swap = () => {
    setInput(output);
    setDirection(direction === "escape" ? "unescape" : "escape");
    const newDir = direction === "escape" ? "unescape" : "escape";
    const fn = newDir === "escape" ? currentMode.escape : currentMode.unescape;
    setOutput(fn(output));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">String Escape / Unescape Tool</h1>
        <p className="text-[var(--text-secondary)]">
          Escape and unescape strings for JSON, HTML, URL, SQL, Regex, CSV, XML, and JavaScript. Real-time conversion as you type.
        </p>
      </div>

      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-4 space-y-3">
        <div className="flex flex-wrap gap-2">
          {modes.map((m) => (
            <button
              key={m.id}
              onClick={() => handleModeChange(m.id)}
              className={`px-3 py-1.5 rounded text-sm font-bold transition-colors ${
                mode === m.id
                  ? "bg-purple-600 text-white"
                  : "bg-[var(--bg-primary)] text-[var(--text-secondary)] hover:text-white border border-[var(--border)]"
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => handleDirectionChange("escape")}
            className={`px-4 py-1.5 rounded text-sm font-bold ${direction === "escape" ? "bg-emerald-600 text-white" : "bg-[var(--bg-primary)] text-[var(--text-secondary)] hover:text-white border border-[var(--border)]"}`}
          >
            Escape
          </button>
          <button
            onClick={() => handleDirectionChange("unescape")}
            className={`px-4 py-1.5 rounded text-sm font-bold ${direction === "unescape" ? "bg-emerald-600 text-white" : "bg-[var(--bg-primary)] text-[var(--text-secondary)] hover:text-white border border-[var(--border)]"}`}
          >
            Unescape
          </button>
          <button onClick={swap} className="text-sm text-purple-400 hover:text-purple-300 ml-2">
            ⇄ Swap
          </button>
          <span className="text-xs text-[var(--text-secondary)] ml-auto">{currentMode.description}</span>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-bold text-purple-400 mb-1 block">Input</label>
          <textarea
            value={input}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder="Enter text to escape or unescape..."
            className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded px-4 py-3 text-white h-56 resize-none font-mono text-sm"
            spellCheck={false}
          />
        </div>
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-sm font-bold text-emerald-400">Output</label>
            {output && (
              <button onClick={copy} className="text-xs text-[var(--text-secondary)] hover:text-white">
                {copied ? "Copied!" : "Copy"}
              </button>
            )}
          </div>
          <textarea
            value={output}
            readOnly
            placeholder="Result will appear here..."
            className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded px-4 py-3 text-emerald-400 h-56 resize-none font-mono text-sm"
          />
        </div>
      </div>

      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-4 text-sm text-[var(--text-secondary)]">
        <h3 className="font-bold text-white mb-2">Escape Modes</h3>
        <div className="grid sm:grid-cols-2 gap-2">
          {modes.map((m) => (
            <div key={m.id}>
              <strong className="text-purple-400">{m.label}</strong> — {m.description}
            </div>
          ))}
        </div>
        <p className="mt-3 text-xs">All processing happens locally in your browser — no data is sent anywhere.</p>
      </div>
    </div>
  );
}
