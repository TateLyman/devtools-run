"use client";
import { useState } from "react";

function paraphrase(text: string, mode: string): string {
  if (!text.trim()) return "";
  const sentences = text.split(/(?<=[.!?])\s+/);

  return sentences.map((sentence) => {
    let result = sentence;

    // Common word replacements
    const replacements: Record<string, Record<string, string>> = {
      formal: {
        "good": "excellent", "bad": "inadequate", "big": "substantial", "small": "minimal",
        "help": "assist", "use": "utilize", "get": "obtain", "show": "demonstrate",
        "need": "require", "make": "create", "give": "provide", "start": "commence",
        "end": "conclude", "try": "attempt", "think": "consider", "important": "significant",
        "very": "exceedingly", "a lot": "considerably", "like": "similar to",
      },
      casual: {
        "utilize": "use", "obtain": "get", "demonstrate": "show", "require": "need",
        "commence": "start", "conclude": "end", "attempt": "try", "consider": "think about",
        "significant": "important", "substantial": "big", "assist": "help", "provide": "give",
        "excellent": "great", "inadequate": "bad", "furthermore": "also", "however": "but",
      },
      shorter: {
        "in order to": "to", "due to the fact that": "because", "at this point in time": "now",
        "in the event that": "if", "for the purpose of": "to", "in spite of the fact that": "although",
        "it is important to note that": "", "it should be noted that": "",
        "the fact that": "", "in my opinion": "", "basically": "", "actually": "",
        "very": "", "really": "", "just": "", "that": "",
      },
    };

    const wordMap = replacements[mode] || replacements.formal;

    for (const [from, to] of Object.entries(wordMap)) {
      const regex = new RegExp(`\\b${from}\\b`, "gi");
      result = result.replace(regex, to);
    }

    // Clean up double spaces
    result = result.replace(/\s+/g, " ").trim();

    return result;
  }).join(" ");
}

export default function Paraphrase() {
  const [input, setInput] = useState("");
  const [mode, setMode] = useState("formal");
  const [copied, setCopied] = useState(false);

  const output = paraphrase(input, mode);
  const inputWords = input.trim() ? input.trim().split(/\s+/).length : 0;
  const outputWords = output.trim() ? output.trim().split(/\s+/).length : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Paraphrasing Tool</h1>
        <p className="text-[var(--text-secondary)]">
          Rewrite text in different styles. Make it more formal, casual, or shorter. Free online paraphrasing tool.
        </p>
      </div>

      <div className="flex gap-2 justify-center">
        {[
          { id: "formal", label: "More Formal" },
          { id: "casual", label: "More Casual" },
          { id: "shorter", label: "Shorter" },
        ].map((m) => (
          <button key={m.id} onClick={() => setMode(m.id)} className={`px-4 py-2 rounded text-sm ${mode === m.id ? "bg-purple-600 text-white" : "bg-[var(--bg-secondary)] text-gray-400"}`}>{m.label}</button>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-sm font-medium">Original</label>
            <span className="text-xs text-gray-400">{inputWords} words</span>
          </div>
          <textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder="Paste your text here to paraphrase..." className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded px-4 py-3 text-white h-64 resize-none text-sm" />
        </div>
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-sm font-medium">Paraphrased</label>
            <div className="flex gap-2">
              <span className="text-xs text-gray-400">{outputWords} words</span>
              {output && <button onClick={() => { navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 2000); }} className="text-xs text-purple-400">{copied ? "Copied!" : "Copy"}</button>}
            </div>
          </div>
          <div className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded px-4 py-3 text-emerald-400 h-64 overflow-auto text-sm">{output || "Paraphrased text will appear here..."}</div>
        </div>
      </div>

      <p className="text-xs text-gray-500 text-center">Note: This tool uses word-level replacements. For AI-powered paraphrasing, consider using ChatGPT or Claude.</p>
    </div>
  );
}
