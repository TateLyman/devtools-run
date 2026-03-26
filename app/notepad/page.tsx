"use client";
import { useState, useEffect } from "react";

export default function Notepad() {
  const [text, setText] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const s = localStorage.getItem("notepad-text");
    if (s) setText(s);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => { localStorage.setItem("notepad-text", text); setSaved(true); setTimeout(() => setSaved(false), 1000); }, 500);
    return () => clearTimeout(t);
  }, [text]);

  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const chars = text.length;
  const lines = text ? text.split("\n").length : 0;

  const download = () => {
    const blob = new Blob([text], { type: "text/plain" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "note.txt"; a.click();
  };

  const copy = () => navigator.clipboard.writeText(text);
  const clear = () => { setText(""); localStorage.removeItem("notepad-text"); };

  return (
    <div className="space-y-4">
      <section className="text-center">
        <h1 className="text-4xl font-bold mb-1">Online Notepad</h1>
        <p className="text-sm text-[var(--text-secondary)]">Auto-saves to your browser. No signup needed.</p>
      </section>

      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl">
        <textarea value={text} onChange={e => setText(e.target.value)} rows={20} placeholder="Start typing..."
          className="w-full bg-transparent p-4 font-mono text-sm resize-none focus:outline-none" autoFocus />
      </div>

      <div className="flex justify-between items-center text-xs text-[var(--text-secondary)]">
        <div className="flex gap-4">
          <span>{words} words</span>
          <span>{chars} chars</span>
          <span>{lines} lines</span>
          {saved && <span className="text-emerald-400">Saved</span>}
        </div>
        <div className="flex gap-2">
          <button onClick={copy} className="bg-[var(--bg-secondary)] border border-[var(--border)] px-3 py-1 rounded text-xs hover:bg-[var(--bg-primary)]">Copy</button>
          <button onClick={download} className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs font-bold">Download</button>
          <button onClick={clear} className="bg-red-600/20 border border-red-600/30 text-red-400 px-3 py-1 rounded text-xs">Clear</button>
        </div>
      </div>
    </div>
  );
}
