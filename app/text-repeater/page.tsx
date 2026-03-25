"use client";
import { useState } from "react";

export default function TextRepeater() {
  const [text, setText] = useState("I will not forget my homework");
  const [count, setCount] = useState(100);
  const [separator, setSeparator] = useState("newline");
  const [copied, setCopied] = useState(false);

  const separators: Record<string, string> = { newline: "\n", space: " ", comma: ", ", none: "" };
  const output = Array(count).fill(text).join(separators[separator] || "\n");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Text Repeater</h1>
        <p className="text-[var(--text-secondary)]">Repeat any text up to 10,000 times. Choose separator. Copy with one click. Free text repeater for WhatsApp, homework, testing.</p>
      </div>
      <div className="max-w-lg mx-auto space-y-4">
        <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Text to repeat..." className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded px-4 py-3 text-white" />
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-gray-400 mb-1">Repeat: {count}x</label>
            <input type="range" min={1} max={10000} value={count} onChange={(e) => setCount(Number(e.target.value))} className="w-full accent-purple-500" />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Separator</label>
            <select value={separator} onChange={(e) => setSeparator(e.target.value)} className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded px-2 py-1.5 text-white text-sm">
              <option value="newline">New Line</option>
              <option value="space">Space</option>
              <option value="comma">Comma</option>
              <option value="none">None</option>
            </select>
          </div>
        </div>
        <pre className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded p-3 text-xs text-white max-h-48 overflow-auto whitespace-pre-wrap">{output.slice(0, 5000)}{output.length > 5000 ? "..." : ""}</pre>
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-400">{output.length.toLocaleString()} chars</span>
          <button onClick={() => { navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 2000); }} className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded font-bold">{copied ? "Copied!" : "Copy All"}</button>
        </div>
      </div>
    </div>
  );
}
