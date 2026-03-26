"use client";
import { useState } from "react";

function slugify(text: string, separator: string = "-"): string {
  return text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^\w\s-]/g, "").replace(/[\s_]+/g, separator).replace(new RegExp(`[${separator}]+`, "g"), separator).replace(new RegExp(`^${separator}|${separator}$`, "g"), "");
}

export default function SlugGenerator() {
  const [input, setInput] = useState("My Awesome Blog Post Title! (2026 Edition)");
  const [separator, setSeparator] = useState("-");

  const slug = slugify(input, separator);
  const copy = () => navigator.clipboard.writeText(slug);

  return (
    <div className="space-y-6">
      <section className="text-center">
        <h1 className="text-4xl font-bold mb-2">URL Slug Generator</h1>
        <p className="text-[var(--text-secondary)]">Convert text to clean URL slugs</p>
      </section>

      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-6">
        <label className="text-sm text-[var(--text-secondary)] block mb-1">Input Text</label>
        <input value={input} onChange={e => setInput(e.target.value)}
          className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg px-3 py-3 text-lg" placeholder="Enter title or text..." />
        <div className="flex gap-2 mt-3">
          <label className="text-sm text-[var(--text-secondary)]">Separator:</label>
          {["-", "_", "."].map(s => (
            <button key={s} onClick={() => setSeparator(s)}
              className={`px-3 py-1 rounded text-sm font-mono ${separator === s ? "bg-blue-600 text-white" : "bg-[var(--bg-primary)] border border-[var(--border)]"}`}>{s === "-" ? "hyphen (-)" : s === "_" ? "underscore (_)" : "dot (.)"}</button>
          ))}
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-blue-500/20 rounded-xl p-6">
        <div className="flex justify-between items-center">
          <code className="font-mono text-lg text-blue-400 break-all">{slug || "..."}</code>
          <button onClick={copy} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-bold ml-4 shrink-0">Copy</button>
        </div>
      </div>

      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-6">
        <h2 className="font-bold text-lg mb-3">What it does</h2>
        <ul className="space-y-1 text-sm text-[var(--text-secondary)]">
          <li>• Converts to lowercase</li>
          <li>• Replaces spaces with separator</li>
          <li>• Removes special characters (!@#$%^&*)</li>
          <li>• Removes accents (café → cafe)</li>
          <li>• Collapses multiple separators</li>
          <li>• Trims leading/trailing separators</li>
        </ul>
      </div>
    </div>
  );
}
