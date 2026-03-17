"use client";

import { useState } from "react";

import AdSlot from "../components/AdSlot";

function minifyCSS(css: string): string {
  let result = css;
  // Remove comments
  result = result.replace(/\/\*[\s\S]*?\*\//g, "");
  // Remove newlines and extra whitespace
  result = result.replace(/\s+/g, " ");
  // Remove spaces around selectors and braces
  result = result.replace(/\s*{\s*/g, "{");
  result = result.replace(/\s*}\s*/g, "}");
  result = result.replace(/\s*;\s*/g, ";");
  result = result.replace(/\s*:\s*/g, ":");
  result = result.replace(/\s*,\s*/g, ",");
  // Remove last semicolon before closing brace
  result = result.replace(/;}/g, "}");
  // Trim
  result = result.trim();
  return result;
}

function beautifyCSS(css: string): string {
  // First minify to normalize
  let result = minifyCSS(css);
  let output = "";
  let indent = 0;
  const indentStr = "  ";

  for (let i = 0; i < result.length; i++) {
    const char = result[i];

    if (char === "{") {
      output += " {\n";
      indent++;
      output += indentStr.repeat(indent);
    } else if (char === "}") {
      // Add semicolon to last property if missing
      output = output.trimEnd();
      if (output.length > 0 && output[output.length - 1] !== ";" && output[output.length - 1] !== "{" && output[output.length - 1] !== "}") {
        output += ";";
      }
      output += "\n";
      indent = Math.max(0, indent - 1);
      output += indentStr.repeat(indent) + "}";
      if (i < result.length - 1) {
        output += "\n";
        if (result[i + 1] !== "}") {
          output += "\n";
        }
      }
    } else if (char === ";") {
      output += ";\n";
      if (i < result.length - 1 && result[i + 1] !== "}") {
        output += indentStr.repeat(indent);
      }
    } else if (char === ":" && result[i - 1] !== " ") {
      output += ": ";
    } else if (char === "," && indent === 0) {
      output += ",\n";
    } else {
      output += char;
    }
  }

  return output.trim();
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  if (bytes < 1024) return bytes + " B";
  return (bytes / 1024).toFixed(2) + " KB";
}

export default function CssMinifyPage() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [stats, setStats] = useState<{ original: number; result: number } | null>(null);
  const [copied, setCopied] = useState(false);

  function handleMinify() {
    if (!input.trim()) return;
    const minified = minifyCSS(input);
    setOutput(minified);
    setStats({
      original: new TextEncoder().encode(input).length,
      result: new TextEncoder().encode(minified).length,
    });
  }

  function handleBeautify() {
    if (!input.trim()) return;
    const beautified = beautifyCSS(input);
    setOutput(beautified);
    setStats({
      original: new TextEncoder().encode(input).length,
      result: new TextEncoder().encode(beautified).length,
    });
  }

  function copyOutput() {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">CSS Minifier / Beautifier</h1>
        <p className="text-[var(--text-secondary)] text-sm">
          Minify CSS to reduce file size or beautify it for readability. See size savings instantly.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div>
          <label className="block text-sm font-medium mb-2">Input CSS</label>
          <textarea
            rows={14}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`.container {\n  display: flex;\n  /* center items */\n  align-items: center;\n  padding: 16px;\n}`}
            spellCheck={false}
          />
          <div className="flex gap-2 mt-3">
            <button
              onClick={handleMinify}
              className="px-4 py-2 rounded-lg bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white text-sm font-medium transition-colors"
            >
              Minify
            </button>
            <button
              onClick={handleBeautify}
              className="px-4 py-2 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border)] hover:border-[var(--accent)] text-sm font-medium transition-colors"
            >
              Beautify
            </button>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium">Output</label>
            {output && (
              <button
                onClick={copyOutput}
                className="text-xs text-[var(--accent)] hover:underline"
              >
                {copied ? "Copied!" : "Copy"}
              </button>
            )}
          </div>
          <pre className="min-h-[340px]">{output}</pre>

          {stats && (
            <div className="mt-3 rounded-lg border border-[var(--border)] bg-[var(--bg-tertiary)] p-3 text-sm">
              <div className="grid grid-cols-3 gap-2 text-center">
                <div>
                  <div className="text-[var(--text-secondary)] text-xs">Original</div>
                  <div className="font-mono font-medium">{formatBytes(stats.original)}</div>
                </div>
                <div>
                  <div className="text-[var(--text-secondary)] text-xs">Result</div>
                  <div className="font-mono font-medium">{formatBytes(stats.result)}</div>
                </div>
                <div>
                  <div className="text-[var(--text-secondary)] text-xs">Savings</div>
                  <div className={`font-mono font-medium ${stats.result < stats.original ? "text-green-400" : stats.result > stats.original ? "text-yellow-400" : ""}`}>
                    {stats.original === 0
                      ? "0%"
                      : stats.result <= stats.original
                      ? `-${Math.round(((stats.original - stats.result) / stats.original) * 100)}%`
                      : `+${Math.round(((stats.result - stats.original) / stats.original) * 100)}%`}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <AdSlot className="mt-8" />

      <section className="mt-10 text-sm text-[var(--text-secondary)] space-y-2">
        <h2 className="text-lg font-semibold text-white">
          About CSS Minification
        </h2>
        <p>
          CSS minification removes comments, whitespace, and unnecessary characters to reduce
          file size and improve page load times. Beautification does the opposite, adding proper
          indentation and formatting for readability. Both operations run entirely in your browser.
        </p>
      </section>
    </>
  );
}
