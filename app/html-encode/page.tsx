"use client";

import { useState } from "react";

const HTML_ENTITIES: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
  "\u00A0": "&nbsp;",
  "\u00A9": "&copy;",
  "\u00AE": "&reg;",
  "\u2122": "&trade;",
  "\u2013": "&ndash;",
  "\u2014": "&mdash;",
  "\u2018": "&lsquo;",
  "\u2019": "&rsquo;",
  "\u201C": "&ldquo;",
  "\u201D": "&rdquo;",
  "\u2026": "&hellip;",
  "\u00B0": "&deg;",
  "\u00B1": "&plusmn;",
  "\u00D7": "&times;",
  "\u00F7": "&divide;",
};

function encodeHTML(text: string): string {
  let result = "";
  for (const char of text) {
    if (HTML_ENTITIES[char]) {
      result += HTML_ENTITIES[char];
    } else {
      const code = char.charCodeAt(0);
      if (code > 127) {
        result += `&#${code};`;
      } else {
        result += char;
      }
    }
  }
  return result;
}

function decodeHTML(text: string): string {
  const textarea = document.createElement("textarea");
  textarea.innerHTML = text;
  return textarea.value;
}

export default function HtmlEncodePage() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [copied, setCopied] = useState(false);

  function handleConvert() {
    if (!input.trim()) {
      setOutput("");
      return;
    }
    if (mode === "encode") {
      setOutput(encodeHTML(input));
    } else {
      setOutput(decodeHTML(input));
    }
  }

  function handleInputChange(value: string) {
    setInput(value);
    if (!value.trim()) {
      setOutput("");
      return;
    }
    if (mode === "encode") {
      setOutput(encodeHTML(value));
    } else {
      setOutput(decodeHTML(value));
    }
  }

  function switchMode(newMode: "encode" | "decode") {
    setMode(newMode);
    setInput("");
    setOutput("");
  }

  function swapInputOutput() {
    const newMode = mode === "encode" ? "decode" : "encode";
    setMode(newMode);
    setInput(output);
    if (newMode === "encode") {
      setOutput(encodeHTML(output));
    } else {
      setOutput(decodeHTML(output));
    }
  }

  function copyOutput() {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">HTML Entity Encoder / Decoder</h1>
        <p className="text-[var(--text-secondary)] text-sm">
          Encode special characters to HTML entities or decode them back to text. Real-time conversion in your browser.
        </p>
      </div>

      {/* AD SLOT - Top */}
      <div className="ad-slot mb-6">
        {/* AD SLOT: in-content ad */}
        <span>Ad Space</span>
      </div>

      <div className="flex items-center gap-3 mb-4">
        <button
          onClick={() => switchMode("encode")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            mode === "encode"
              ? "bg-[var(--accent)] text-white"
              : "bg-[var(--bg-tertiary)] border border-[var(--border)]"
          }`}
        >
          Encode
        </button>
        <button
          onClick={() => switchMode("decode")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            mode === "decode"
              ? "bg-[var(--accent)] text-white"
              : "bg-[var(--bg-tertiary)] border border-[var(--border)]"
          }`}
        >
          Decode
        </button>
        <button
          onClick={swapInputOutput}
          className="px-4 py-2 rounded-lg text-sm font-medium bg-[var(--bg-tertiary)] border border-[var(--border)] hover:border-[var(--accent)] transition-colors ml-auto"
        >
          Swap
        </button>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div>
          <label className="block text-sm font-medium mb-2">
            {mode === "encode" ? "Plain Text Input" : "HTML Entities Input"}
          </label>
          <textarea
            rows={12}
            value={input}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder={
              mode === "encode"
                ? 'Enter text with special characters: <div class="test">&'
                : "Enter HTML entities: &lt;div class=&quot;test&quot;&gt;&amp;"
            }
            spellCheck={false}
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium">
              {mode === "encode" ? "HTML Entities Output" : "Decoded Text"}
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
          <pre className="min-h-[288px]">{output}</pre>
        </div>
      </div>

      {/* AD SLOT - Bottom */}
      <div className="ad-slot mt-8">
        {/* AD SLOT: in-content ad */}
        <span>Ad Space</span>
      </div>

      <section className="mt-10 text-sm text-[var(--text-secondary)] space-y-2">
        <h2 className="text-lg font-semibold text-white">
          About HTML Entity Encoding
        </h2>
        <p>
          HTML entity encoding converts special characters like &lt;, &gt;, &amp;, and quotes
          into their safe HTML entity equivalents. This prevents XSS attacks and ensures your
          HTML renders correctly. This tool also handles Unicode characters and named entities.
        </p>
      </section>
    </>
  );
}
